"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [tokenVerified, setTokenVerified] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  // Get parameters from URL
  const token = searchParams.get("token") || ""
  const type = searchParams.get("type") || ""
  const emailFromUrl = searchParams.get("email") || ""
  const redirectTo = searchParams.get("redirect_to") || "/dashboard"

  useEffect(() => {
    // Set email from URL parameter
    if (emailFromUrl) {
      setEmail(emailFromUrl)
    }

    // Verify token
    if (token && type === "invite") {
      verifyToken()
    }
  }, [token, type, emailFromUrl])

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Błąd weryfikacji tokenu")
      }

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Błąd ustawiania hasła")
      }

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">OZE System</h1>
          {type === "invite" ? (
            <p className="mt-2 text-gray-600">Ustaw hasło, aby aktywować swoje konto</p>
          ) : (
            <p className="mt-2 text-gray-600">Ustaw nowe hasło</p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Błąd</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Sukces</AlertTitle>
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Adres email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              disabled={!!emailFromUrl}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Nowe hasło</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Przetwarzanie..." : "Ustaw hasło i zaloguj się"}
          </Button>
        </form>

        <div>
          <button
            type="button"
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <Info className="mr-1 h-4 w-4" />
            Informacje debugowania (dla administratora)
          </button>

          {showDebug && (
            <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-4 text-xs">
              <p>
                <strong>Pełny URL:</strong> {window.location.href}
              </p>
              <p>
                <strong>Parametry:</strong>{" "}
                {JSON.stringify({
                  token,
                  type,
                  email: emailFromUrl,
                  redirect_to: redirectTo,
                })}
              </p>
              <p>
                <strong>Fragment:</strong> {window.location.hash}
              </p>
              <p>
                <strong>Token zweryfikowany:</strong> {tokenVerified ? "Tak" : "Nie"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
