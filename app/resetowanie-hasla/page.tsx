"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import supabase from "@/lib/supabase-client"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Pełny URL z protokołem i domeną
      const redirectUrl = `${window.location.origin}/aktualizacja-hasla`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        throw error
      }

      setSuccess("Link do resetowania hasła został wysłany na Twój adres email.")
    } catch (error: any) {
      setError(error.message || "Wystąpił błąd podczas wysyłania linku resetowania hasła")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">OZE System</h1>
        <h2 className="text-xl mb-6 text-center text-gray-600">Resetowanie hasła</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 relative"
              role="alert"
            >
              <span className="block sm:inline">{success}</span>
            </div>
            <p className="mb-4">Sprawdź swoją skrzynkę email i kliknij link, aby zresetować hasło.</p>
            <Link href="/logowanie" className="text-blue-600 hover:text-blue-500">
              Wróć do logowania
            </Link>
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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Wysyłanie..." : "Wyślij link resetowania hasła"}
            </button>

            <div className="text-center mt-4">
              <Link href="/logowanie" className="text-sm text-blue-600 hover:text-blue-500">
                Wróć do logowania
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
