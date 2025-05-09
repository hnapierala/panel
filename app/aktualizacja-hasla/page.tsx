"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hashError, setHashError] = useState(false)

  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Sprawdź, czy użytkownik ma ważny hash resetowania hasła
    const checkHash = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        setHashError(true)
      }
    }

    checkHash()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne")
      return
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Po 3 sekundach przekieruj do strony logowania
      setTimeout(() => {
        router.push("/logowanie")
      }, 3000)
    } catch (error: any) {
      console.error("Błąd podczas aktualizacji hasła:", error)
      setError(error.message || "Wystąpił błąd podczas aktualizacji hasła")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Lewa kolumna - formularz aktualizacji hasła */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link href="/logowanie" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do logowania
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Aktualizacja hasła</h1>

          {hashError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nieprawidłowy link</AlertTitle>
              <AlertDescription>
                Link do resetowania hasła jest nieprawidłowy lub wygasł. Spróbuj zresetować hasło ponownie.
              </AlertDescription>
            </Alert>
          ) : success ? (
            <Alert className="bg-green-50 border-green-200 mb-6">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Hasło zaktualizowane</AlertTitle>
              <AlertDescription className="text-green-700">
                Twoje hasło zostało pomyślnie zaktualizowane. Za chwilę zostaniesz przekierowany do strony logowania.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p className="text-gray-600 mb-6">Wprowadź nowe hasło dla swojego konta.</p>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Błąd</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="password" className="text-gray-700">
                    Nowe hasło
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 h-12 text-base"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Potwierdź nowe hasło
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 h-12 text-base"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-amber-400 hover:bg-amber-500 text-black"
                  disabled={loading}
                >
                  {loading ? "Aktualizowanie..." : "Aktualizuj hasło"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Prawa kolumna - informacje o systemie */}
      <div className="hidden lg:block w-1/2 border-l">
        <div className="h-full flex flex-col justify-center px-16">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Czym jest OZE System?</h2>

            <div className="text-gray-600">
              <p className="mb-4">
                OZE System jest aplikacją webową, służącą do przygotowywania kompletnych wycen dla Twojego klienta.
                Składa się z formularza z danymi rejestracyjnymi Twojego Klienta, danymi dotyczącymi zużycia energii
                elektrycznej, komponentami elektrowni słonecznej oraz proponowanymi formami sfinansowania jej zakupu.
              </p>

              <p className="mb-4">
                Gdy wpiszesz wymagane informacje, nasz kalkulator wygeneruje ofertę w formie PDF lub w formie linku do
                udostępnienia w formacie html.
              </p>

              <p>
                Ponadto OZE System posiada pełną bazę niezbędnych materiałów marketingowych i sprzedażowych niezbędnych
                w Twojej pracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
