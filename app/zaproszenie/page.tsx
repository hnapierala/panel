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
  const [debugInfo, setDebugInfo] = useState<string>("")

  useEffect(() => {
    // Wyświetl informacje debugowania
    const currentUrl = window.location.href
    const searchParamsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      searchParamsObj[key] = value
    })

    setDebugInfo(`
      Pełny URL: ${currentUrl}
      Parametry: ${JSON.stringify(searchParamsObj, null, 2)}
      Fragment: ${window.location.hash}
    `)

    // Pobierz token z różnych możliwych miejsc
    const token =
      searchParams.get("token") ||
      searchParams.get("t") ||
      searchParams.get("access_token") ||
      searchParams.get("code") ||
      ""

    const type = searchParams.get("type") || "invite"

    console.log("Strona zaproszenia: Token:", token)
    console.log("Strona zaproszenia: Typ:", type)

    if (!token) {
      // Spróbuj pobrać token z fragmentu URL (części po #)
      const hash = window.location.hash
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1))
        const hashToken = hashParams.get("access_token") || hashParams.get("token") || hashParams.get("t") || ""

        if (hashToken) {
          console.log("Strona zaproszenia: Znaleziono token w fragmencie URL:", hashToken)
          processToken(hashToken, hashParams.get("type") || type)
          return
        }
      }

      setTokenError("Brak tokenu zaproszenia w URL. Sprawdź, czy używasz poprawnego linku z emaila.")
      return
    }

    processToken(token, type)
  }, [searchParams])

  const processToken = async (token: string, type: string) => {
    try {
      const supabase = getSupabaseClient()

      // Spróbuj wymienić token na sesję
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
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
        window.location.href = "/dashboard"
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

          <details className="mt-4 text-xs text-gray-500">
            <summary>Informacje debugowania (dla administratora)</summary>
            <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">{debugInfo}</pre>
          </details>
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
