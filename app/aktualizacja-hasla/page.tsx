"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Sprawdź, czy użytkownik jest zalogowany
    const checkSession = async () => {
      const supabase = getSupabaseClient()
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        // Jeśli nie ma sesji, przekieruj do strony logowania
        router.push("/logowanie")
      }
    }

    checkSession()
  }, [router])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Sprawdź, czy hasła są zgodne
    if (password !== confirmPassword) {
      setError("Hasła nie są zgodne")
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Przekieruj do dashboardu po 3 sekundach
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error: any) {
      console.error("Błąd aktualizacji hasła:", error)
      setError(error.message || "Wystąpił błąd podczas aktualizacji hasła. Spróbuj ponownie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Aktualizacja hasła</CardTitle>
          <CardDescription>Wprowadź nowe hasło dla swojego konta</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Hasło zostało pomyślnie zaktualizowane. Za chwilę zostaniesz przekierowany do dashboardu.
              </AlertDescription>
            </Alert>
          )}
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
            <Button type="submit" className="w-full" disabled={loading || success}>
              {loading ? "Aktualizacja..." : "Aktualizuj hasło"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            <a href="/logowanie" className="text-blue-600 hover:text-blue-500">
              Wróć do logowania
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
