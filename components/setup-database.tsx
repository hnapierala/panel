"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Database, CheckCircle } from "lucide-react"

export default function SetupDatabase() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setErrorMessage("Wprowadź URL i klucz Supabase")
      setStatus("error")
      return
    }

    setStatus("testing")
    setErrorMessage("")

    try {
      // Testowanie połączenia z Supabase
      const response = await fetch("/api/test-database-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supabaseUrl,
          supabaseKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się połączyć z bazą danych")
      }

      // Zapisanie konfiguracji
      const saveResponse = await fetch("/api/save-database-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supabaseUrl,
          supabaseKey,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Nie udało się zapisać konfiguracji")
      }

      setStatus("success")
    } catch (error) {
      console.error("Błąd podczas testowania połączenia:", error)
      setErrorMessage(error instanceof Error ? error.message : "Nieznany błąd")
      setStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Konfiguracja bazy danych
        </CardTitle>
        <CardDescription>
          Skonfiguruj połączenie z bazą danych Supabase, aby przechowywać dane aplikacji.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">URL Supabase</Label>
            <Input
              id="supabase-url"
              placeholder="https://xxxxxxxxxxxx.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-key">Klucz anonimowy Supabase</Label>
            <Input
              id="supabase-key"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
            />
          </div>

          {status === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {errorMessage || "Wystąpił błąd podczas łączenia z bazą danych. Sprawdź dane i spróbuj ponownie."}
            </div>
          )}

          {status === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Połączenie z bazą danych zostało pomyślnie skonfigurowane!
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleTestConnection} className="w-full" disabled={status === "testing"}>
          {status === "testing" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testowanie połączenia...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Połączono
            </>
          ) : (
            "Testuj i zapisz połączenie"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
