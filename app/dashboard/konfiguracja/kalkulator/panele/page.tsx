"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from "@/lib/supabase"
import Image from "next/image"

interface Panel {
  id: string
  manufacturer: string
  model: string
  power: number
  price: number
  efficiency: number
  warranty: number
}

export default function PanelsPage() {
  const [panels, setPanels] = useState<Panel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPanel, setCurrentPanel] = useState<Panel | null>(null)
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    power: 0,
    price: 0,
    efficiency: 0,
    warranty: 0,
  })

  useEffect(() => {
    fetchPanels()
  }, [])

  async function fetchPanels() {
    try {
      setLoading(true)
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("panels").select("*").order("manufacturer", { ascending: true })

      if (error) {
        throw error
      }

      setPanels(data || [])
    } catch (error) {
      console.error("Błąd podczas pobierania paneli:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPanels = panels.filter(
    (panel) =>
      panel.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      panel.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "manufacturer" || name === "model" ? value : Number(value),
    })
  }

  const handleAddPanel = async () => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("panels").insert([formData])

      if (error) {
        throw error
      }

      setIsAddDialogOpen(false)
      setFormData({
        manufacturer: "",
        model: "",
        power: 0,
        price: 0,
        efficiency: 0,
        warranty: 0,
      })
      fetchPanels()
    } catch (error) {
      console.error("Błąd podczas dodawania panelu:", error)
    }
  }

  const handleEditPanel = async () => {
    if (!currentPanel) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("panels").update(formData).eq("id", currentPanel.id)

      if (error) {
        throw error
      }

      setIsEditDialogOpen(false)
      setCurrentPanel(null)
      fetchPanels()
    } catch (error) {
      console.error("Błąd podczas edycji panelu:", error)
    }
  }

  const handleDeletePanel = async () => {
    if (!currentPanel) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("panels").delete().eq("id", currentPanel.id)

      if (error) {
        throw error
      }

      setIsDeleteDialogOpen(false)
      setCurrentPanel(null)
      fetchPanels()
    } catch (error) {
      console.error("Błąd podczas usuwania panelu:", error)
    }
  }

  const openEditDialog = (panel: Panel) => {
    setCurrentPanel(panel)
    setFormData({
      manufacturer: panel.manufacturer,
      model: panel.model,
      power: panel.power,
      price: panel.price,
      efficiency: panel.efficiency,
      warranty: panel.warranty,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (panel: Panel) => {
    setCurrentPanel(panel)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/konfiguracja/kalkulator">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Powrót
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-neutral-100 p-2 rounded-lg flex items-center justify-center h-14 w-14">
            <Image
              src="/icons/panel.png"
              alt="Panele fotowoltaiczne"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Panele fotowoltaiczne</h1>
        </div>
        <p className="text-neutral-600">Zarządzaj dostępnymi modelami paneli fotowoltaicznych i ich cenami.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            type="search"
            placeholder="Szukaj paneli..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj panel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowy panel</DialogTitle>
              <DialogDescription>Wprowadź dane nowego panelu fotowoltaicznego.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="manufacturer">Producent</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" value={formData.model} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="power">Moc [W]</Label>
                  <Input id="power" name="power" type="number" value={formData.power} onChange={handleInputChange} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Cena [PLN]</Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="efficiency">Wydajność [%]</Label>
                  <Input
                    id="efficiency"
                    name="efficiency"
                    type="number"
                    step="0.01"
                    value={formData.efficiency}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="warranty">Gwarancja [lata]</Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    type="number"
                    value={formData.warranty}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Anuluj
              </Button>
              <Button className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90" onClick={handleAddPanel}>
                Dodaj
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producent</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Moc [W]</TableHead>
              <TableHead>Cena [PLN]</TableHead>
              <TableHead>Wydajność [%]</TableHead>
              <TableHead>Gwarancja [lata]</TableHead>
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Ładowanie danych...
                </TableCell>
              </TableRow>
            ) : filteredPanels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nie znaleziono paneli. Dodaj pierwszy panel, klikając przycisk "Dodaj panel".
                </TableCell>
              </TableRow>
            ) : (
              filteredPanels.map((panel) => (
                <TableRow key={panel.id}>
                  <TableCell>{panel.manufacturer}</TableCell>
                  <TableCell>{panel.model}</TableCell>
                  <TableCell>{panel.power}</TableCell>
                  <TableCell>{panel.price.toLocaleString()} zł</TableCell>
                  <TableCell>{panel.efficiency}%</TableCell>
                  <TableCell>{panel.warranty}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(panel)} className="h-8 w-8">
                        <Pencil className="h-4 w-4 text-neutral-500" />
                        <span className="sr-only">Edytuj</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(panel)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Usuń</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog edycji */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj panel</DialogTitle>
            <DialogDescription>Zmień dane panelu fotowoltaicznego.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-manufacturer">Producent</Label>
                <Input
                  id="edit-manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input id="edit-model" name="model" value={formData.model} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-power">Moc [W]</Label>
                <Input id="edit-power" name="power" type="number" value={formData.power} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-price">Cena [PLN]</Label>
                <Input id="edit-price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-efficiency">Wydajność [%]</Label>
                <Input
                  id="edit-efficiency"
                  name="efficiency"
                  type="number"
                  step="0.01"
                  value={formData.efficiency}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-warranty">Gwarancja [lata]</Label>
                <Input
                  id="edit-warranty"
                  name="warranty"
                  type="number"
                  value={formData.warranty}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Anuluj
            </Button>
            <Button className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90" onClick={handleEditPanel}>
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog usuwania */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń panel</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć panel {currentPanel?.manufacturer} {currentPanel?.model}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleDeletePanel}>
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
