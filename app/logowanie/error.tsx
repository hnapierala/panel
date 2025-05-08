"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">OZE System</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
          <p className="font-bold">Wystąpił błąd</p>
          <p className="text-sm">{error.message || "Nieznany błąd"}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={reset}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    </div>
  )
}
