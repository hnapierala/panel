"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Save, CheckCircle2, AlertCircle, Loader2, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PanelDetail from "@/components/settings/panel-detail"
import type { SolarPanel } from "@/lib/api-types"
import { panelsApi } from "@/lib/supabase-api"

export default function PanelsSettingsPage() {
  // Stan dla paneli
  const [panels, setPanels] = useState<SolarPanel[]>([])
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Pobieranie paneli z API
  const fetchPanels = async () => {
    try {
      setIsLoading(true)
      const data = await panelsApi.getAll()
      setPanels(data)
      toast({
        title: "Sukces",
        description: `Pobrano ${data.length} paneli z bazy danych.`,
      })
    } catch (error) {
      console.error("Błąd podczas pobierania paneli:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać paneli. Spróbuj odświeżyć stronę.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Pobieranie paneli przy inicjalizacji
  useEffect(() => {
    fetchPanels()
  }, [])

  // Funkcja do zapisywania zmian dla pojedynczego panelu
  const handleSavePanel = async (panel: SolarPanel) => {
    setSaveStatus("saving")

    try {
      const success = await panelsApi.update(panel.id, panel)

      if (!success) {
        throw new Error("Nie udało się zapisać panelu")
      }

      setSaveStatus("saved")
      toast({
        title: "Sukces",
        description: "Panel został zaktualizowany.",
      })

      // Odśwież listę paneli
      fetchPanels()
    } catch (error) {
      console.error("Błąd podczas zapisywania panelu:", error)
      setSaveStatus("error")
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać panelu. Spróbuj ponownie.",
        variant: "destructive",
      })
    }

    // Po 2 sekundach przywróć stan idle
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  // Funkcja do dodawania nowego panelu
  const handleAddPanel = async () => {
    try {
      const newPanel = {
        name: "Nowy panel",
        power: 0,
        price: 0,
        efficiency: 0,
        warranty: 0,
        dimensions: "",
        weight: 0,
        manufacturer: "",
        type: "",
      }

      const addedPanel = await panelsApi.add(newPanel)

      if (!addedPanel) {
        throw new Error("Nie udało się dodać panelu")
      }

      toast({
        title: "Dodano nowy panel",
        description: "Nowy panel został dodany do bazy danych.",
      })

      // Odśwież listę paneli i wybierz nowo dodany panel do edycji
      await fetchPanels()
      setSelectedPanelId(addedPanel.id)
    } catch (error) {
      console.error("Błąd podczas dodawania panelu:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się dodać panelu. Spróbuj ponownie.",
        variant: "destructive",
      })
    }
  }

  // Funkcja do dodawania panelu Skichała Trina
  const handleAddTrinaPanel = async () => {
    try {
      const newPanel = {
        name: "Skichała Trina",
        power: 400,
        price: 580,
        efficiency: 20.1,
        warranty: 25,
        dimensions: "1700x1000x35",
        weight: 21.0,
        manufacturer: "Trina Solar",
        type: "Monokrystaliczny",
      }

      const addedPanel = await panelsApi.add(newPanel)

      if (!addedPanel) {
        throw new Error("Nie udało się dodać panelu")
      }

      toast({
        title: "Dodano panel Skichała Trina",
        description: "Panel Skichała Trina został dodany do bazy danych.",
      })

      // Odśwież listę paneli i wybierz nowo dodany panel do edycji
      await fetchPanels()
      setSelectedPanelId(addedPanel.id)
    } catch (error) {
      console.error("Błąd podczas dodawania panelu:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się dodać panelu. Spróbuj ponownie.",
        variant: "destructive",
      })
    }
  }

  // Funkcja do usuwania panelu
  const handleDeletePanel = async (id: string) => {
    try {
      const success = await panelsApi.delete(id)

      if (!success) {
        throw new Error("Nie udało się usunąć panelu")
      }

      if (selectedPanelId === id) {
        setSelectedPanelId(null)
      }

      toast({
        title: "Usunięto panel",
        description: "Panel został usunięty z bazy danych.",
      })

      // Odśwież listę paneli
      fetchPanels()
    } catch (error) {
      console.error("Błąd podczas usuwania panelu:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć panelu. Spróbuj ponownie.",
        variant: "destructive",
      })
    }
  }

  // Funkcja do aktualizacji panelu
  const handleUpdatePanel = (updatedPanel: SolarPanel) => {
    setPanels(panels.map((panel) => (panel.id === updatedPanel.id ? updatedPanel : panel)))
  }

  // Renderowanie przycisku zapisywania z odpowiednim stanem
  const renderSaveButton = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <Button disabled className="bg-yellow-500 hover:bg-yellow-600">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Zapisywanie...
          </Button>
        )
      case "saved":
        return (
          <Button className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Zapisano!
          </Button>
        )
      case "error":
        return (
          <Button className="bg-red-500 hover:bg-red-600">
            <AlertCircle className="mr-2 h-4 w-4" />
            Błąd!
          </Button>
        )
      default:
        return (
          <Button
            onClick={() => selectedPanelId && handleSavePanel(panels.find((p) => p.id === selectedPanelId)!)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Zapisz zmiany
          </Button>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/ustawienia">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Panele fotowoltaiczne</h1>
            <p className="text-muted-foreground">Zarządzaj dostępnymi panelami, ich mocą i cenami</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchPanels} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Odśwież
          </Button>
          <Button onClick={handleAddTrinaPanel} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Dodaj Skichała Trina
          </Button>
          <Button onClick={handleAddPanel} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Dodaj panel
          </Button>
        </div>
      </div>

      {!selectedPanelId ? (
        // Widok listy paneli
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Lista paneli</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producent</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Moc (W)</TableHead>
                  <TableHead>Cena (zł)</TableHead>
                  <TableHead>Wydajność (%)</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {panels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Brak paneli. Dodaj nowy panel.
                    </TableCell>
                  </TableRow>
                ) : (
                  panels.map((panel) => (
                    <TableRow key={panel.id}>
                      <TableCell className="font-medium">{panel.manufacturer}</TableCell>
                      <TableCell>{panel.name}</TableCell>
                      <TableCell>{panel.power} W</TableCell>
                      <TableCell>{panel.price} zł</TableCell>
                      <TableCell>{panel.efficiency}%</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => setSelectedPanelId(panel.id)}
                        >
                          Edytuj
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleDeletePanel(panel.id)}
                        >
                          Usuń
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        // Widok edycji panelu
        <div className="w-full">
          <PanelDetail
            panel={panels.find((p) => p.id === selectedPanelId)!}
            onUpdate={handleUpdatePanel}
            onSave={() => handleSavePanel(panels.find((p) => p.id === selectedPanelId)!)}
          />
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedPanelId(null)} className="mr-2">
              Powrót do listy
            </Button>
            {renderSaveButton()}
          </div>
        </div>
      )}
    </div>
  )
}
