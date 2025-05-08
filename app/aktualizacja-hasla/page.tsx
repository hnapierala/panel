"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  // Sprawdź token w URL
  useEffect(() => {
    const handleHashChange = async () => {
      try {
        const hash = window.location.hash
        if (hash && hash.includes("access_token=")) {
          // Token jest w URL, próbujemy go przetworzyć
          const supabase = getSupabaseClient()
          const { error } = await supabase.auth.getSession()

          if (error) {
            setTokenError("Nieprawidłowy lub wygasły token. Spróbuj zresetować hasło ponownie.")
          }
        } else if (!hash) {
          // Brak tokenu w URL
          setTokenError("Brak tokenu w URL. Sprawdź, czy używasz poprawnego linku z emaila.")
        }
      } catch (err) {
        console.error("Błąd podczas przetwarzania tokenu:", err)
        setTokenError("Wystąpił błąd podczas przetwarzania tokenu. Spróbuj zresetować hasło ponownie.")
      }
    }

    handleHashChange()

    // Nasłuchuj na zmiany w hash (fragment URL)
    window.addEventListener("hashchange", handleHashChange)
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Sprawdź, czy hasła są zgodne
    if (password !== confirmPassword) {
      setError("Hasła nie są zgodne")
      return
    }

    // Sprawdź, czy hasło ma odpowiednią długość
    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Po 3 sekundach przekieruj do dashboardu
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 3000)
    } catch (error: any) {
      console.error("Błąd aktualizacji hasła:", error)
      setError("Wystąpił błąd podczas aktualizacji hasła. Spróbuj ponownie.")
    } finally {
      setLoading(false)
    }
  }

  // Jeśli jest błąd tokenu, pokaż komunikat
  if (tokenError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">OZE System</CardTitle>
            <CardDescription>Problem z resetowaniem hasła</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => (window.location.href = "/logowanie")}>
              Wróć do logowania
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">OZE System</CardTitle>
          <CardDescription>Ustaw nowe hasło</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Hasło zostało pomyślnie zaktualizowane. Za chwilę zostaniesz przekierowany do dashboardu.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nowe hasło</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Aktualizowanie..." : "Ustaw nowe hasło"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
