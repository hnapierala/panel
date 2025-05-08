"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error in invitation page:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-red-700">Wystąpił błąd</h2>
        <p className="text-red-600">
          {error.message || "Wystąpił nieoczekiwany błąd podczas przetwarzania zaproszenia."}
        </p>
        <Button variant="outline" onClick={reset} className="mx-auto">
          Spróbuj ponownie
        </Button>
        <div className="pt-4">
          <a href="/logowanie" className="text-sm text-gray-500 hover:text-gray-700">
            Wróć do logowania
          </a>
        </div>
      </div>
    </div>
  )
}
