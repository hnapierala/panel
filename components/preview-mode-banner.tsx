"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

export default function PreviewModeBanner() {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // Sprawdź, czy aplikacja działa w trybie podglądu
    const hostname = window.location.hostname
    setIsPreview(hostname.includes("vercel.app") || hostname === "localhost" || hostname === "127.0.0.1")
  }, [])

  if (!isPreview) return null

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>
          <span className="font-bold">Tryb podglądu:</span> Aplikacja działa w trybie podglądu. Dane są przechowywane
          tymczasowo i nie są zapisywane na serwerze produkcyjnym.
        </p>
      </div>
    </div>
  )
}
