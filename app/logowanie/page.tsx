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
import { AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

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
    setDebugInfo(null)

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
        setDebugInfo({ type: "magic_link", data })
      } else {
        // Standardowe logowanie przez hasło
        console.log("Próba logowania z email:", email)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        setDebugInfo({ type: "password", data, error })

        if (error) {
          throw error
        }

        console.log("Logowanie udane, przekierowuję do dashboardu")

        // Dodaj małe opóźnienie przed przekierowaniem
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 500)
      }
    } catch (error: any) {
      console.error("Błąd logowania:", error)
      setError(error.message || "Wystąpił błąd podczas logowania. Spróbuj ponownie.")
    } finally {
      setLoading(false)
    }
  }

  // Funkcja do bezpośredniego logowania (dla celów debugowania)
  const handleDirectLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = getSupabaseClient()

      // Próba ustawienia sesji bezpośrednio
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setDebugInfo({ type: "direct_login", data, error })

      if (error) {
        throw error
      }

      // Sprawdź, czy sesja została utworzona
      const sessionCheck = await supabase.auth.getSession()

      if (sessionCheck.data.session) {
        alert("Logowanie udane! Kliknij OK, aby przejść do dashboardu.")
        window.location.href = "/dashboard"
      } else {
        throw new Error("Sesja nie została utworzona pomimo udanego logowania")
      }
    } catch (error: any) {
      console.error("Błąd bezpośredniego logowania:", error)
      setError(error.message || "Wystąpił błąd podczas bezpośredniego logowania.")
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
            <Alert className="mb-4">
              <AlertDescription>
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

          {!useMagicLink && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleDirectLogin}
              disabled={loading || !email || !password}
            >
              Alternatywne logowanie
            </Button>
          )}

          <div className="mt-4">
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-gray-500"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? "Ukryj informacje debugowania" : "Pokaż informacje debugowania"}
            </Button>

            {showDebug && debugInfo && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
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
