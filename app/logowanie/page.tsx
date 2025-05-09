"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">OZE System</CardTitle>
            <CardDescription className="text-center">Zaloguj się na swoje konto</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Błąd</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Adres email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Hasło</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logowanie..." : "Zaloguj się"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-500">
              Nie masz konta?{" "}
              <a href="mailto:kontakt@oze-system.tech" className="text-blue-500 hover:underline">
                Skontaktuj się z nami
              </a>
            </p>
            <Link href="/resetowanie-hasla" className="text-sm text-blue-500 hover:underline">
              Zapomniałeś hasła?
            </Link>
          </CardFooter>
        </Card>

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
  )
}
