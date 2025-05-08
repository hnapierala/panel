"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function InvitePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [showDebug, setShowDebug] = useState(false)
  const [tokenVerified, setTokenVerified] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token") || ""
  const type = searchParams.get("type") || ""
  const emailFromParams = searchParams.get("email") || ""
  const redirectTo = searchParams.get("redirect_to") || "/dashboard"

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true)
        setError(null)

        // Pobierz parametry z URL
        // const token = searchParams.get("token") || ""
        // const type = searchParams.get("type") || ""
        // const emailFromParams = searchParams.get("email") || ""
        // const redirectTo = searchParams.get("redirect_to") || "/dashboard"

        // Zapisz informacje debugowania
        const fullUrl = window.location.href
        const params = Object.fromEntries(searchParams.entries())
        const hashParams = new URLSearchParams(window.location.hash.substring(1))

        setDebugInfo(`
          Pełny URL: ${fullUrl}
          Parametry: ${JSON.stringify(params)}
          Fragment: ${window.location.hash}
          Parametry fragmentu: ${JSON.stringify(Object.fromEntries(hashParams.entries()))}
          Token: ${token}
          Typ: ${type}
          Email: ${emailFromParams}
          Przekierowanie: ${redirectTo}
        `)

        // Ustaw email z parametrów
        if (emailFromParams) {
          setEmail(emailFromParams)
        }

        // Jeśli nie ma tokenu lub emaila, pokaż błąd
        if (!token) {
          setError("Brak tokenu zaproszenia. Sprawdź, czy używasz poprawnego linku z emaila.")
          setLoading(false)
          return
        }

        if (!emailFromParams) {
          setError("Brak adresu email w parametrach. Wprowadź swój adres email ręcznie.")
          setLoading(false)
          return
        }

        // Wszystko OK, możemy kontynuować
        // setTokenVerified(true)
        await verifyToken()
        setLoading(false)
      } catch (error: any) {
        console.error("Błąd inicjalizacji strony:", error)
        setError(`Wystąpił błąd: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [searchParams])

  const verifyToken = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, type }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = "Błąd weryfikacji tokenu"

        try {
          const errorJson = JSON.parse(errorData)
          errorMessage = errorJson.error || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e, errorData)
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      setTokenVerified(true)
      setSuccess("Token zweryfikowany pomyślnie")
    } catch (error) {
      console.error("Error verifying token:", error)
      setError(error instanceof Error ? error.message : "Błąd weryfikacji tokenu")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!email) {
      setError("Adres email jest wymagany")
      return
    }

    if (!password) {
      setError("Hasło jest wymagane")
      return
    }

    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków")
      return
    }

    if (password !== confirmPassword) {
      setError("Hasła nie są zgodne")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, token, type }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = "Błąd ustawiania hasła"

        try {
          const errorJson = JSON.parse(errorData)
          errorMessage = errorJson.error || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e, errorData)
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      setSuccess("Hasło zostało ustawione pomyślnie. Przekierowywanie...")

      // Redirect after a short delay
      setTimeout(() => {
        router.push(redirectTo || "/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Error setting password:", error)
      setError(error instanceof Error ? error.message : "Błąd ustawiania hasła")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">OZE System</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
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

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Inicjalizacja...</p>
          </div>
        ) : (
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
                readOnly={!!searchParams.get("email")}
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
              disabled={loading || !tokenVerified}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Ustaw hasło i zaloguj się
            </button>
          </form>
        )}

        <details className="mt-4 text-xs text-gray-500">
          <summary onClick={() => setShowDebug(!showDebug)}>Informacje debugowania (dla administratora)</summary>
          {showDebug && <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">{debugInfo}</pre>}
        </details>
      </div>
    </div>
  )
}
