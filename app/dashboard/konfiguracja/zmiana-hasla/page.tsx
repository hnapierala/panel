"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase"

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Walidacja siły hasła
  const passwordStrength = (password: string) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return ""
    if (strength <= 2) return "Słabe"
    if (strength <= 4) return "Średnie"
    return "Silne"
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength === 0) return ""
    if (strength <= 2) return "bg-red-500"
    if (strength <= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Walidacja
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Wszystkie pola są wymagane")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Nowe hasło i potwierdzenie hasła nie są zgodne")
      return
    }

    if (passwordStrength(newPassword) < 3) {
      setError("Nowe hasło jest zbyt słabe. Użyj kombinacji dużych i małych liter, cyfr oraz znaków specjalnych.")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = getSupabaseClient()

      // Zmiana hasła bez weryfikacji starego hasła
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message || "Wystąpił błąd podczas zmiany hasła")
        return
      }

      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.")
      console.error("Błąd zmiany hasła:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const strength = passwordStrength(newPassword)

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/konfiguracja" className="text-[#1E8A3C] hover:text-[#1E8A3C]/80">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Zmiana hasła</h1>
          <p className="text-neutral-600">Zmień swoje hasło dostępu do systemu.</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-white border-b border-neutral-100 px-6">
            <CardTitle className="text-lg font-medium text-neutral-900">Zmiana hasła</CardTitle>
            <CardDescription className="text-neutral-500">
              Wprowadź aktualne hasło oraz nowe hasło, aby zmienić swoje hasło dostępu.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <Alert className="bg-green-50 border-green-100 text-green-800">
                  <Check className="h-4 w-4" />
                  <AlertDescription>Hasło zostało pomyślnie zmienione.</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-neutral-700">
                  Aktualne hasło
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-neutral-700">
                  Nowe hasło
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C]"
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-neutral-500">Siła hasła:</span>
                      <span
                        className={`text-xs font-medium ${
                          strength <= 2 ? "text-red-600" : strength <= 4 ? "text-yellow-600" : "text-green-600"
                        }`}
                      >
                        {getPasswordStrengthText(strength)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor(strength)}`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <ul className="mt-2 text-xs text-neutral-500 space-y-1">
                      <li className={newPassword.length >= 8 ? "text-green-600" : ""}>• Minimum 8 znaków</li>
                      <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                        • Przynajmniej jedna duża litera
                      </li>
                      <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                        • Przynajmniej jedna mała litera
                      </li>
                      <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>• Przynajmniej jedna cyfra</li>
                      <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}>
                        • Przynajmniej jeden znak specjalny
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-neutral-700">
                  Powtórz nowe hasło
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C]"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Hasła nie są zgodne</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1E8A3C] hover:bg-[#1E8A3C]/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Zapisywanie..." : "Zmień hasło"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
