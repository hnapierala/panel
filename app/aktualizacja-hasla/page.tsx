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

export default function UpdatePasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [manualMode, setManualMode] = useState(false)

  // Funkcja do parsowania fragmentu URL (części po #)
  const parseHash = () => {
    if (typeof window === "undefined") return {}

    const hash = window.location.hash.substring(1)
    const params: Record<string, string> = {}

    if (hash) {
      const pairs = hash.split("&")
      pairs.forEach((pair) => {
        const [key, value] = pair.split("=")
        if (key && value) {
          params[key] = decodeURIComponent(value)
        }
      })
    }

    return params
  }

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Pobierz parametry z URL i fragmentu
        const queryParams = Object.fromEntries(searchParams.entries())
        const hashParams = parseHash()
        const fullUrl = typeof window !== "undefined" ? window.location.href : ""

        // Zapisz informacje debugowania
        const debugText = `
          Full URL: ${fullUrl}
          Query Params: ${JSON.stringify(queryParams)}
          Hash Params: ${JSON.stringify(hashParams)}
        `
        setDebugInfo(debugText)
        console.log("Debug info:", debugText)

        // Sprawdź, czy mamy token w parametrach lub fragmencie
        const token = searchParams.get("token") || searchParams.get("access_token") || hashParams.access_token || ""

        if (!token && !manualMode) {
          setTokenError("Brak tokenu w URL. Sprawdź, czy używasz poprawnego linku z emaila.")
          return
        }

        // Jeśli jesteśmy w trybie manualnym, nie sprawdzaj tokenu
        if (manualMode) {
          return
        }

        // Sprawdź, czy token jest ważny
        const supabase = getSupabaseClient()

        // Jeśli mamy token w fragmencie URL, spróbuj ustawić sesję
        if (hashParams.access_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token || "",
          })

          if (error) {
            console.error("Błąd ustawiania sesji:", error)
            setTokenError("Token jest nieprawidłowy lub wygasł. Spróbuj zresetować hasło ponownie.")
            return
          }
        }

        // Sprawdź, czy mamy sesję
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setTokenError("Nie można zweryfikować sesji. Spróbuj zresetować hasło ponownie.")
        }
      } catch (error) {
        console.error("Błąd podczas sprawdzania tokenu:", error)
        setTokenError("Wystąpił błąd podczas weryfikacji tokenu. Spróbuj ponownie później.")
      }
    }

    checkToken()
  }, [searchParams, manualMode])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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

      // Aktualizuj hasło
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
          <CardTitle className="text-2xl font-bold">OZE System</CardTitle>
          <CardDescription>
            {tokenError && !manualMode ? "Problem z resetowaniem hasła" : "Ustaw nowe hasło"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokenError && !manualMode ? (
            <>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{tokenError}</AlertDescription>
              </Alert>

              <div className="mt-4">
                <Button className="w-full" variant="outline" onClick={() => setManualMode(true)}>
                  Spróbuj ustawić hasło ręcznie
                </Button>
              </div>

              <div className="mt-4">
                <Button className="w-full" onClick={() => router.push("/logowanie")}>
                  Wróć do logowania
                </Button>
              </div>

              <details className="mt-4 text-xs text-gray-500">
                <summary>Informacje debugowania (dla administratora)</summary>
                <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">{debugInfo}</pre>
              </details>
            </>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : success ? (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Hasło zostało pomyślnie zmienione. Za chwilę zostaniesz przekierowany do dashboardu.
              </AlertDescription>
            </Alert>
          ) : null}

          {(!tokenError || manualMode) && !success && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {manualMode && (
                <Alert className="mb-4 bg-blue-50 border-blue-500">
                  <AlertDescription className="text-blue-700">
                    Tryb ręczny: Możesz ustawić nowe hasło, jeśli jesteś już zalogowany lub masz ważną sesję.
                  </AlertDescription>
                </Alert>
              )}

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
