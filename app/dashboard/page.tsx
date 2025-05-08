"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        setUser(data.user)
      } catch (error: any) {
        console.error("Błąd pobierania użytkownika:", error)
        setError(error.message || "Wystąpił błąd podczas pobierania danych użytkownika.")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      window.location.href = "/logowanie"
    } catch (error: any) {
      console.error("Błąd wylogowania:", error)
      setError(error.message || "Wystąpił błąd podczas wylogowywania.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Ładowanie...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Witaj w panelu administracyjnym OZE System</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {user && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Informacje o użytkowniku</h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Ostatnie logowanie:</strong> {new Date(user.last_sign_in_at).toLocaleString()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Panele fotowoltaiczne</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Zarządzaj panelami fotowoltaicznymi w systemie.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => (window.location.href = "/dashboard/ustawienia/panele")}>
                  Przejdź do paneli
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Falowniki</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Zarządzaj falownikami w systemie.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => (window.location.href = "/dashboard/ustawienia/falowniki")}>
                  Przejdź do falowników
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wyceny</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Twórz i zarządzaj wycenami dla klientów.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => (window.location.href = "/dashboard/wyceny")}>
                  Przejdź do wycen
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>
            Wyloguj się
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
