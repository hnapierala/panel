"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { getSupabaseClient, clearSupabaseClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = getSupabaseClient()

  // Sprawdź, czy użytkownik jest już zalogowany
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router, supabase.auth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Wyczyść poprzednią sesję
      clearSupabaseClient()

      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Przekieruj do dashboardu po pomyślnym logowaniu
      window.location.href = "/dashboard"
    } catch (err: any) {
      console.error("Błąd logowania:", err)
      setError("Nieprawidłowy email lub hasło. Spróbuj ponownie.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <Image src="/logo.png" alt="OZE System" width={220} height={60} className="h-20 w-auto" priority />
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Zaloguj się do systemu</h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="w-full bg-[#1E8A3C] hover:bg-[#1E8A3C]/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logowanie...
              </>
            ) : (
              "Zaloguj się"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
