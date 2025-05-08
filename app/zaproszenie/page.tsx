"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import supabase from "@/lib/supabase-client"

export default function InvitePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Funkcja do wylogowania użytkownika
    const logout = async () => {
      try {
        await supabase.auth.signOut()
        console.log("Wylogowano użytkownika")
      } catch (error) {
        console.error("Błąd podczas wylogowywania:", error)
      }
    }

    // Funkcja do inicjalizacji strony
    const initPage = async () => {
      try {
        setLoading(true)

        // Najpierw wyloguj użytkownika, aby zapobiec automatycznemu zalogowaniu
        await logout()

        // Zapisz informacje debugowania
        const fullUrl = window.location.href
        const params = Object.fromEntries(searchParams.entries())
        const hashParams = new URLSearchParams(window.location.hash.substring(1))

        setDebugInfo(`
          Pełny URL: ${fullUrl}
          Parametry: ${JSON.stringify(params)}
          Fragment: ${window.location.hash}
          Parametry fragmentu: ${JSON.stringify(Object.fromEntries(hashParams.entries()))}
        `)

        // Spróbuj pobrać email z tokenu lub parametrów
        let emailFromToken = ""

        // Sprawdź, czy email jest w parametrach
        if (searchParams.has("email")) {
          emailFromToken = searchParams.get("email") || ""
        }

        // Jeśli nie ma emaila w parametrach, spróbuj go wyciągnąć z tokenu
        if (!emailFromToken) {
          // Pobierz token z parametrów lub fragmentu
          const token =
            searchParams.get("token") || searchParams.get("access_token") || hashParams.get("access_token") || ""

          if (token) {
            // Spróbuj zdekodować token JWT
            try {
              const parts = token.split(".")
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]))
                if (payload.email) {
                  emailFromToken = payload.email
                }
              }
            } catch (e) {
              console.error("Błąd dekodowania tokenu:", e)
            }
          }
        }

        // Jeśli udało się pobrać email, ustaw go
        if (emailFromToken) {
          setEmail(emailFromToken)
        }
      } catch (error) {
        console.error("Błąd podczas inicjalizacji strony:", error)
        setError("Wystąpił błąd podczas przetwarzania zaproszenia.")
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Adres email jest wymagany")
      return
    }

    if (password !== confirmPassword) {
      setError("Hasła nie są zgodne")
      return
    }

    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Najpierw wyloguj użytkownika
      await supabase.auth.signOut()

      // Pobierz token z parametrów lub fragmentu
      const token =
        searchParams.get("token") ||
        searchParams.get("access_token") ||
        new URLSearchParams(window.location.hash.substring(1)).get("access_token") ||
        ""

      if (token) {
        // Jeśli mamy token, użyj go do ustawienia hasła
        const { error } = await supabase.auth.updateUser({
          password: password,
        })

        if (error) {
          throw error
        }

        setSuccess("Hasło zostało pomyślnie ustawione. Przekierowywanie do dashboardu...")

        // Zaloguj użytkownika
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          throw signInError
        }

        // Przekieruj do dashboardu
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        // Jeśli nie mamy tokenu, spróbuj zresetować hasło
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/aktualizacja-hasla`,
        })

        if (error) {
          throw error
        }

        setSuccess("Wysłaliśmy link do resetowania hasła na Twój adres email.")
      }
    } catch (error: any) {
      console.error("Błąd podczas ustawiania hasła:", error)
      setError(error.message || "Wystąpił błąd podczas ustawiania hasła")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">OZE System</h1>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Inicjalizacja...</p>
          </div>
        ) : (
          <>
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 relative"
                role="alert"
              >
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Adres email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nowe hasło
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Potwierdź hasło
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Przetwarzanie..." : "Ustaw hasło i zaloguj się"}
                </button>
              </form>
            )}

            <details className="mt-4 text-xs text-gray-500">
              <summary>Informacje debugowania (dla administratora)</summary>
              <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">{debugInfo}</pre>
            </details>
          </>
        )}
      </div>
    </div>
  )
}
