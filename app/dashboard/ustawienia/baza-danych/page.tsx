"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { supabaseApi } from "@/lib/supabase-api"
import { DEFAULT_DATA } from "@/lib/api-types"

export default function DatabaseSettingsPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const { toast } = useToast()

  // Inicjalizacja bazy danych
  const handleInitializeDatabase = async () => {
    try {
      setIsInitializing(true)
      const success = await supabaseApi.initializeData(DEFAULT_DATA)

      if (!success) {
        throw new Error("Nie udało się zainicjalizować danych")
      }

      toast({
        title: "Sukces",
        description: "Dane zostały pomyślnie zainicjalizowane.",
      })
    } catch (error) {
      console.error("Błąd podczas inicjalizacji danych:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas inicjalizacji danych. Spróbuj ponownie.",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/ustawienia">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Zarządzanie danymi</h1>
          <p className="text-muted-foreground">Inicjalizacja i zarządzanie bazą danych</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Zarządzanie bazą danych
            </CardTitle>
            <CardDescription>Inicjalizuj dane domyślne w bazie danych Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Inicjalizacja danych</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Inicjalizacja danych spowoduje dodanie domyślnych danych dla wszystkich kategorii. Istniejące dane
                  pozostaną bez zmian.
                </p>
                <Button
                  onClick={handleInitializeDatabase}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isInitializing}
                >
                  {isInitializing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Inicjalizowanie...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Inicjalizuj dane domyślne
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
