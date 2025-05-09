"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  // Użyj singletona klienta Supabase
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Sprawdź, czy użytkownik jest już zalogowany
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Błąd podczas pobierania sesji:", error)
          return
        }

        if (data.session) {
          console.log("Użytkownik jest już zalogowany, przekierowywanie do:", redirectTo)
          window.location.href = redirectTo // Użyj bezpośredniego przekierowania zamiast router.push
        }
      } catch (error) {
        console.error("Błąd podczas sprawdzania sesji:", error)
      }
    }

    checkSession()
  }, [redirectTo, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      console.log("Próba logowania dla:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        console.error("Błąd logowania:", error)

        // Tłumaczenie typowych błędów Supabase na język polski
        if (error.message === "Email not confirmed") {
          throw new Error(
            "Email nie został potwierdzony. Sprawdź swoją skrzynkę email lub skontaktuj się z administratorem.",
          )
        } else if (error.message === "Invalid login credentials") {
          throw new Error("Nieprawidłowy email lub hasło.")
        } else {
          throw error
        }
      }

      console.log("Logowanie udane, przekierowywanie do:", redirectTo)

      // Użyj bezpośredniego przekierowania zamiast router.push
      window.location.href = redirectTo
    } catch (error: any) {
      console.error("Błąd podczas logowania:", error)
      setError(error.message || "Wystąpił błąd podczas logowania")

      // Dodaj informacje debugowania
      setDebugInfo(`
        Błąd: ${error.message}
        Stack: ${error.stack}
      `)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Lewa kolumna - formularz logowania */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Platforma OZE System</h1>

          <h2 className="text-xl font-medium text-gray-700 mb-6">Zaloguj się:</h2>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Błąd</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700">
                Adres e-mail
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-12 text-base"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700">
                  Hasło
                </Label>
                <Link href="/resetowanie-hasla" className="text-sm text-blue-600 hover:underline">
                  Nie pamiętasz hasła?
                </Link>
              </div>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-12 text-base"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-amber-400 hover:bg-amber-500 text-black"
              disabled={loading}
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          {/* Informacje debugowania - widoczne tylko w trybie deweloperskim */}
          {process.env.NODE_ENV === "development" && debugInfo && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <details>
                <summary>Informacje debugowania</summary>
                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* Prawa kolumna - informacje o systemie */}
      <div className="hidden lg:block w-1/2 bg-gray-50 p-16 border-l">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Czym jest OZE System?</h2>

          <div className="prose text-gray-600">
            <p className="mb-4">
              OZE System jest aplikacją webową, służącą do przygotowywania kompletnych wycen dla Twojego klienta. Składa
              się z formularza z danymi rejestracyjnymi Twojego Klienta, danymi dotyczącymi zużycia energii
              elektrycznej, komponentami elektrowni słonecznej oraz proponowanymi formami sfinansowania jej zakupu.
            </p>

            <p className="mb-4">
              Gdy wpiszesz wymagane informacje, nasz kalkulator wygeneruje ofertę w formie PDF lub w formie linku do
              udostępnienia w formacie html.
            </p>

            <p>
              Ponadto OZE System posiada pełną bazę niezbędnych materiałów marketingowych i sprzedażowych niezbędnych w
              Twojej pracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
