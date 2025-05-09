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

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const initPage = async () => {
      try {
        // Pobierz parametry z URL
        const token = searchParams.get("token") || ""
        const type = searchParams.get("type") || ""
        const emailFromParams = searchParams.get("email") || ""
        const redirectTo = searchParams.get("redirect_to") || "/dashboard"

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
      } catch (error: any) {
        console.error("Błąd inicjalizacji strony:", error)
        setError(`Wystąpił błąd: ${error.message}`)
      }
    }

    initPage()
  }, [searchParams])

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

      const token = searchParams.get("token") || ""
      const type = searchParams.get("type") || ""

      console.log("Wysyłanie żądania ustawienia hasła:", { email, token, type })

      // 1. Ustaw hasło
      const passwordResponse = await fetch("/api/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, token, type }),
      })

      let passwordData
      try {
        const responseText = await passwordResponse.text()
        console.log("Odpowiedź z API set-password:", responseText)

        passwordData = JSON.parse(responseText)
      } catch (e) {
        console.error("Błąd parsowania odpowiedzi JSON:", e)
        throw new Error("Nieprawidłowa odpowiedź z serwera")
      }

      if (!passwordResponse.ok) {
        throw new Error(passwordData.error || "Błąd ustawiania hasła")
      }

      // 2. Potwierdź email
      const confirmResponse = await fetch("/api/confirm-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      let confirmData
      try {
        const confirmText = await confirmResponse.text()
        console.log("Odpowiedź z API confirm-email:", confirmText)

        confirmData = JSON.parse(confirmText)
      } catch (e) {
        console.error("Błąd parsowania odpowiedzi JSON:", e)
        // Nie przerywamy procesu, jeśli potwierdzenie emaila się nie powiedzie
      }

      if (!confirmResponse.ok) {
        console.error("Błąd potwierdzania emaila:", confirmData?.error)
        // Nie przerywamy procesu, jeśli potwierdzenie emaila się nie powiedzie
      }

      setSuccess("Hasło zostało ustawione pomyślnie. Przekierowywanie...")

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/logowanie"
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
        <p className="text-center mb-6">Ustaw hasło, aby aktywować swoje konto</p>

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
            <p className="mt-4">Przetwarzanie...</p>
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
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Ustaw hasło i zaloguj się
            </button>
          </form>
        )}

        <details className="mt-4 text-xs text-gray-500">
          <summary>Informacje debugowania (dla administratora)</summary>
          {showDebug && <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">{debugInfo}</pre>}
        </details>
      </div>
    </div>
  )
}
