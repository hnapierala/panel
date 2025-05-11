"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut()

        if (error) {
          throw error
        }

        // Przekieruj do strony logowania po pomyślnym wylogowaniu
        router.push("/auth/login")
      } catch (err) {
        console.error("Błąd podczas wylogowywania:", err)
        setError("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.")
      }
    }

    handleLogout()
  }, [router, supabase.auth])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-gray-900">Wylogowywanie...</h1>
          {error ? (
            <div className="mt-4 text-red-500">{error}</div>
          ) : (
            <div className="mt-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#1E8A3C]" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
