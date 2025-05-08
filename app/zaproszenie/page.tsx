"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function InvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  // Pobierz token z URL
  const token = searchParams.get("token") || searchParams.get("t") || ""

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenError("Brak tokenu zaproszenia w URL. Sprawdź, czy używasz poprawnego linku z emaila.")
        return
      }

      try {
        const supabase = getSupabaseClient()

        // Sprawdź, czy token jest ważny i pobierz email
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "invite",
        })

        if (error) {
          console.error("Błąd weryfikacji tokenu:", error)
          setTokenError("Token zaproszenia jest nieprawidłowy lub wygasł. Poproś o nowe zaproszenie.")
          return
        }

        // Pobierz email z sesji
        if (data?.user?.email) {
          setEmail(data.user.email)
        } else {
          setTokenError("Nie można pobrać adresu email. Spróbuj ponownie lub poproś o nowe zaproszenie.")
        }
      } catch (err) {
        console.error("Błąd podczas weryfikacji tokenu:", err)
        setTokenError("Wystąpił błąd podczas weryfikacji tokenu. Spróbuj ponownie później.")
      }
    }

    verifyToken()
  }, [token])

  const handleSetPassword = async (e: React.FormEvent) => {
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

    // Sprawdź, czy hasło ma odpowiednią długość
    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków")
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()

      // Ustaw nowe hasło
      const { error } = await supabase.auth.updateUser({
        password: password,
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
      console.error("Błąd ustawiania hasła:", error)
      setError(error.message || "Wystąpił błąd podczas ustawiania hasła. Spróbuj ponownie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">OZE System</CardTitle>
          <CardDescription>
            {tokenError
              ? "Problem z zaproszeniem"
              : email
                ? `Ustaw hasło dla konta ${email}`
                : "Ustaw hasło dla swojego konta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokenError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : success ? (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Hasło zostało pomyślnie ustawione. Za chwilę zostaniesz przekierowany do dashboardu.
              </AlertDescription>
            </Alert>
          ) : null}

          {!tokenError && !success && (
            <form onSubmit={handleSetPassword} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? "Ustawianie hasła..." : "Ustaw hasło i zaloguj się"}
              </Button>
            </form>
          )}
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
