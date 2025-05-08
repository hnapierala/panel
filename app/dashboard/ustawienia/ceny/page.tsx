"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Save, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient, type Price } from "@/lib/api-client"
import { Input } from "@/components/ui/input"

export default function CenyPage() {
  // Stan dla cen
  const [prices, setPrices] = useState<Price[]>([])
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Pobieranie cen z API
  const fetchPrices = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getData<Price>("prices")
      setPrices(data)
    } catch (error) {
      console.error("Błąd podczas pobierania cen:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać cen. Spróbuj odświeżyć stronę.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Pobieranie cen przy inicjalizacji
  useEffect(() => {
    fetchPrices()
  }, [])

  // Funkcja do zapisywania zmian
  const handleSaveChanges = async () => {
    setSaveStatus("saving")

    try {
      // Zapisz wszystkie ceny
      const success = await apiClient.updateAllItems("prices", prices)

      if (!success) {
        throw new Error("Nie udało się zapisać cen")
      }

      setSaveStatus("saved")
      toast({
        title: "Sukces",
        description: "Zmiany zostały zapisane.",
      })
    } catch (error) {
      console.error("Błąd podczas zapisywania zmian:", error)
      setSaveStatus("error")
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać zmian. Spróbuj ponownie.",
        variant: "destructive",
      })
    }

    // Po 2 sekundach przywróć stan idle
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  // Funkcja do dodawania nowej ceny
  const handleAddPrice = () => {
    const newPrice: Price = {
      id: `temp_${Date.now()}`, // Tymczasowe ID, zostanie zastąpione przez ID z serwera
      name: "Nowa cena",
      value: 0,
      unit: "zł/kWh",
    }

    setPrices([...prices, newPrice])
    setEditingPriceId(newPrice.id)

    toast({
      title: "Dodano nową cenę",
      description: "Nowa cena została dodana. Pamiętaj o zapisaniu zmian.",
    })
  }

  // Funkcja do usuwania ceny
  const handleDeletePrice = (id: string) => {
    setPrices(prices.filter((price) => price.id !== id))

    if (editingPriceId === id) {
      setEditingPriceId(null)
    }

    toast({
      title: "Usunięto cenę",
      description: "Cena została usunięta. Pamiętaj o zapisaniu zmian.",
    })
  }

  // Funkcja do aktualizacji ceny
  const handleUpdatePrice = (id: string, field: keyof Price, value: string | number) => {
    setPrices(prices.map((price) => (price.id === id ? { ...price, [field]: value } : price)))
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
          <Button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700">
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
            <h1 className="text-2xl font-bold">Ceny</h1>
            <p className="text-muted-foreground">Zarządzaj cenami energii i innymi stałymi cenami</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddPrice} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Dodaj cenę
          </Button>
          {renderSaveButton()}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Lista cen</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>Wartość</TableHead>
                <TableHead>Jednostka</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Brak cen. Dodaj nową cenę.
                  </TableCell>
                </TableRow>
              ) : (
                prices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell>
                      {editingPriceId === price.id ? (
                        <Input
                          value={price.name}
                          onChange={(e) => handleUpdatePrice(price.id, "name", e.target.value)}
                        />
                      ) : (
                        price.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPriceId === price.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={price.value}
                          onChange={(e) => handleUpdatePrice(price.id, "value", Number.parseFloat(e.target.value) || 0)}
                        />
                      ) : (
                        price.value
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPriceId === price.id ? (
                        <Input
                          value={price.unit}
                          onChange={(e) => handleUpdatePrice(price.id, "unit", e.target.value)}
                        />
                      ) : (
                        price.unit
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingPriceId === price.id ? (
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingPriceId(null)}>
                          Gotowe
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => setEditingPriceId(price.id)}
                        >
                          Edytuj
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-500 hover:bg-red-50"
                        onClick={() => handleDeletePrice(price.id)}
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
    </div>
  )
}
