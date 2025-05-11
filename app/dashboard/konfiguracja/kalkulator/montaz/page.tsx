"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, Search, Loader2, AlertCircle } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from "@/lib/supabase"
import Image from "next/image"

interface MountingSystem {
  id: string
  name: string
  type: string
  price_per_kw: number
  created_at?: string
}

export default function MountingSystemsPage() {
  const [mountingSystems, setMountingSystems] = useState<MountingSystem[]>([])
  const [filteredSystems, setFilteredSystems] = useState<MountingSystem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSystem, setCurrentSystem] = useState<MountingSystem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "dach skośny",
    price_per_kw: 0,
  })

  // Pobieranie systemów montażowych z bazy danych
  useEffect(() => {
    const fetchMountingSystems = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("mounting_systems")
          .select("*")
          .order("type", { ascending: true })
          .order("name", { ascending: true })

        if (error) throw new Error(error.message)

        setMountingSystems(data || [])
        setFilteredSystems(data || [])
      } catch (err) {
        console.error("Błąd podczas pobierania systemów montażowych:", err)
        setError("Wystąpił błąd podczas pobierania danych. Spróbuj odświeżyć stronę.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMountingSystems()
  }, [])

  // Filtrowanie systemów na podstawie wyszukiwania
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSystems(mountingSystems)
    } else {
      const lowercaseSearch = searchTerm.toLowerCase()
      const filtered = mountingSystems.filter(
        (system) =>
          system.name.toLowerCase().includes(lowercaseSearch) || system.type.toLowerCase().includes(lowercaseSearch),
      )
      setFilteredSystems(filtered)
    }
  }, [searchTerm, mountingSystems])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price_per_kw" ? Number(value) : value,
    })
  }

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
    })
  }

  const handleAddSystem = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase.from("mounting_systems").insert([formData])

      if (error) throw new Error(error.message)

      // Odświeżenie listy systemów
      const { data, error: fetchError } = await supabase
        .from("mounting_systems")
        .select("*")
        .order("type", { ascending: true })
        .order("name", { ascending: true })

      if (fetchError) throw new Error(fetchError.message)

      setMountingSystems(data || [])
      setFilteredSystems(data || [])

      // Zamknięcie formularza i reset stanu
      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        type: "dach skośny",
        price_per_kw: 0,
      })
    } catch (err) {
      console.error("Błąd podczas dodawania systemu montażowego:", err)
      setError("Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSystem = async () => {
    if (!currentSystem) return

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase.from("mounting_systems").update(formData).eq("id", currentSystem.id)

      if (error) throw new Error(error.message)

      // Odświeżenie listy systemów
      const { data, error: fetchError } = await supabase
        .from("mounting_systems")
        .select("*")
        .order("type", { ascending: true })
        .order("name", { ascending: true })

      if (fetchError) throw new Error(fetchError.message)

      setMountingSystems(data || [])
      setFilteredSystems(data || [])

      // Zamknięcie formularza i reset stanu
      setIsEditDialogOpen(false)
      setCurrentSystem(null)
    } catch (err) {
      console.error("Błąd podczas edycji systemu montażowego:", err)
      setError("Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSystem = async () => {
    if (!currentSystem) return

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase.from("mounting_systems").delete().eq("id", currentSystem.id)

      if (error) throw new Error(error.message)

      // Odświeżenie listy systemów
      const { data, error: fetchError } = await supabase
        .from("mounting_systems")
        .select("*")
        .order("type", { ascending: true })
        .order("name", { ascending: true })

      if (fetchError) throw new Error(fetchError.message)

      setMountingSystems(data || [])
      setFilteredSystems(data || [])

      // Zamknięcie dialogu potwierdzenia
      setIsDeleteDialogOpen(false)
      setCurrentSystem(null)
    } catch (err) {
      console.error("Błąd podczas usuwania systemu montażowego:", err)
      setError("Wystąpił błąd podczas usuwania danych. Spróbuj ponownie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (system: MountingSystem) => {
    setCurrentSystem(system)
    setFormData({
      name: system.name,
      type: system.type,
      price_per_kw: system.price_per_kw,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (system: MountingSystem) => {
    setCurrentSystem(system)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Nagłówek z przyciskiem powrotu */}
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
              src="/icons/mounting_system.png"
              alt="Systemy montażowe"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Systemy montażowe</h1>
        </div>
        <p className="text-neutral-600">Zarządzaj dostępnymi systemami montażowymi i ich cenami za kW.</p>
      </div>

      {/* Opis i akcje */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Szukaj systemów..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90">
          <Plus className="mr-2 h-4 w-4" />
          Dodaj system montażowy
        </Button>
      </div>

      {/* Komunikat o błędzie */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabela systemów montażowych */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nazwa</TableHead>
              <TableHead className="w-[200px]">Typ</TableHead>
              <TableHead className="text-right">Cena za kW [PLN]</TableHead>
              <TableHead className="text-right w-[120px]">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1E8A3C]" />
                    <span className="ml-2">Ładowanie danych...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSystems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-neutral-500">
                  {searchTerm
                    ? "Nie znaleziono systemów spełniających kryteria wyszukiwania"
                    : "Brak systemów montażowych w bazie danych"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSystems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell>{system.type}</TableCell>
                  <TableCell className="text-right">{system.price_per_kw.toLocaleString()} PLN</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(system)}>
                        <Pencil className="h-4 w-4 text-neutral-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(system)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog dodawania */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dodaj system montażowy</DialogTitle>
            <DialogDescription>Wprowadź dane nowego systemu montażowego.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nazwa</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nazwa systemu montażowego"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Typ</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Wybierz typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dach skośny">Dach skośny</SelectItem>
                  <SelectItem value="dach płaski">Dach płaski</SelectItem>
                  <SelectItem value="grunt">Grunt</SelectItem>
                  <SelectItem value="elewacja">Elewacja</SelectItem>
                  <SelectItem value="carport">Carport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price_per_kw">Cena za kW [PLN]</Label>
              <Input
                id="price_per_kw"
                name="price_per_kw"
                type="number"
                value={formData.price_per_kw}
                onChange={handleInputChange}
                placeholder="Cena za kW"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90" onClick={handleAddSystem} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Dodawanie...
                </>
              ) : (
                "Dodaj system"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog edycji */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edytuj system montażowy</DialogTitle>
            <DialogDescription>Zmień dane systemu montażowego.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">Nazwa</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nazwa systemu montażowego"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-type">Typ</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Wybierz typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dach skośny">Dach skośny</SelectItem>
                  <SelectItem value="dach płaski">Dach płaski</SelectItem>
                  <SelectItem value="grunt">Grunt</SelectItem>
                  <SelectItem value="elewacja">Elewacja</SelectItem>
                  <SelectItem value="carport">Carport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-price_per_kw">Cena za kW [PLN]</Label>
              <Input
                id="edit-price_per_kw"
                name="price_per_kw"
                type="number"
                value={formData.price_per_kw}
                onChange={handleInputChange}
                placeholder="Cena za kW"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90" onClick={handleEditSystem} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                "Zapisz zmiany"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog usuwania */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Usuń system montażowy</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć system montażowy "{currentSystem?.name}"? Ta operacja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleDeleteSystem} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Usuwanie...
                </>
              ) : (
                "Usuń system"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
