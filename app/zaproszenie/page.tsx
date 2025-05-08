"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import supabase from "@/lib/supabase-client"

export default function InvitePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [tokenType, setTokenType] = useState<string | null>(null)
  const [showManualForm, setShowManualForm] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Wyloguj użytkownika na początku, aby zapobiec automatycznemu zalogowaniu
    const logout = async () => {
      await supabase.auth.signOut()
    }

    logout()

    // Pobierz token z URL
    const tokenFromParams = searchParams.get("token")
    const typeFromParams = searchParams.get("type")

    // Pobierz token z fragmentu URL (po #)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get("access_token")
    const typeFromHash = hashParams.get("type")

    if (tokenFromParams) {
      setToken(tokenFromParams)
      setTokenType(typeFromParams)
    } else if (accessToken) {
      setToken(accessToken)
      setTokenType(typeFromHash)
    } else {
      setError("Brak tokenu w URL. Sprawdź, czy używasz poprawnego linku z emaila.")
    }

    setLoading(false)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      // Jeśli mamy token, próbujemy go użyć
      if (token) {
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
        // Jeśli nie mamy tokenu, próbujemy zalogować użytkownika
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          // Jeśli logowanie się nie powiodło, wysyłamy link do resetowania hasła
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/aktualizacja-hasla`,
          })

          if (resetError) {
            throw resetError
          }

          setSuccess("Wysłaliśmy link do resetowania hasła na Twój adres email.")
        } else {
          // Jeśli logowanie się powiodło, przekierowujemy do dashboardu
          setSuccess("Zalogowano pomyślnie. Przekierowywanie do dashboardu...")

          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        }
      }
    } catch (error: any) {
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
              <>
                {token || showManualForm ? (
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
                ) : (
                  <div className="text-center">
                    <p className="mb-4">Brak tokenu w URL. Możesz spróbować ustawić hasło ręcznie.</p>
                    <button
                      onClick={() => setShowManualForm(true)}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Spróbuj ustawić hasło ręcznie
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 text-center">
              <Link href="/logowanie" className="text-sm text-blue-600 hover:text-blue-500">
                Wróć do logowania
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
