"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = getSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/aktualizacja-hasla`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (error: any) {
      console.error("Błąd podczas resetowania hasła:", error)
      setError(error.message || "Wystąpił błąd podczas wysyłania linku do resetowania hasła")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Lewa kolumna - formularz resetowania hasła */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link href="/logowanie" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do logowania
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Resetowanie hasła</h1>

          {!success ? (
            <>
              <p className="text-gray-600 mb-6">
                Podaj adres e-mail powiązany z Twoim kontem, a my wyślemy Ci link do resetowania hasła.
              </p>

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

                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-amber-400 hover:bg-amber-500 text-black"
                  disabled={loading}
                >
                  {loading ? "Wysyłanie..." : "Wyślij link do resetowania"}
                </Button>
              </form>
            </>
          ) : (
            <Alert className="bg-green-50 border-green-200 mb-6">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Link wysłany</AlertTitle>
              <AlertDescription className="text-green-700">
                Jeśli adres {email} jest powiązany z kontem w naszym systemie, wkrótce otrzymasz e-mail z instrukcjami
                dotyczącymi resetowania hasła.
              </AlertDescription>
            </Alert>
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
