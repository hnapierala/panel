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
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")

  // Sprawdź, czy użytkownik jest już zalogowany
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.getSession()

        if (data.session) {
          console.log("Użytkownik jest już zalogowany, przekierowuję do dashboardu")
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("Błąd podczas sprawdzania sesji:", err)
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = getSupabaseClient()

      if (useMagicLink) {
        // Logowanie przez magic link
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })

        if (error) {
          throw error
        }

        setMagicLinkSent(true)
      } else {
        // Standardowe logowanie przez hasło
        console.log("Próba logowania z email:", email)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        setSuccess(true)
        console.log("Logowanie udane, przekierowuję do dashboardu")

        // Dodaj małe opóźnienie przed przekierowaniem
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1000)
      }
    } catch (error: any) {
      console.error("Błąd logowania:", error)
      setError(error.message || "Wystąpił błąd podczas logowania. Spróbuj ponownie.")

      // Dodaj informacje debugowania
      setDebugInfo(`
        Typ błędu: ${error.name}
        Wiadomość: ${error.message}
        Kod: ${error.code || "brak"}
        Status: ${error.status || "brak"}
      `)
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">OZE System</CardTitle>
            <CardDescription>Link do logowania wysłany</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Link do logowania został wysłany na adres {email}. Sprawdź swoją skrzynkę email i kliknij link, aby się
                zalogować.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => {
                setMagicLinkSent(false)
                setUseMagicLink(false)
              }}
            >
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
          <CardDescription>Zaloguj się do swojego konta</CardDescription>
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
                Logowanie udane! Za chwilę zostaniesz przekierowany do dashboardu.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!useMagicLink && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <a href="/resetowanie-hasla" className="text-sm text-blue-600 hover:text-blue-500">
                    Zapomniałeś hasła?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!useMagicLink}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="magic-link"
                checked={useMagicLink}
                onCheckedChange={(checked) => setUseMagicLink(checked === true)}
              />
              <Label htmlFor="magic-link" className="text-sm font-normal">
                Zaloguj się przez link wysłany na email (bez hasła)
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logowanie..." : useMagicLink ? "Wyślij link logowania" : "Zaloguj się"}
            </Button>
          </form>

          {debugInfo && (
            <details className="mt-4 text-xs text-gray-500">
              <summary>Informacje debugowania (dla administratora)</summary>
              <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">{debugInfo}</pre>
            </details>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Nie masz konta?{" "}
            <a href="/kontakt" className="text-blue-600 hover:text-blue-500">
              Skontaktuj się z administratorem
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
