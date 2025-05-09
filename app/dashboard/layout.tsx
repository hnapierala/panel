import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/logowanie")
  }

  const { data: userData } = await supabase.auth.getUser()
  const userEmail = userData.user?.email || "Użytkownik"

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              OZE System
            </Link>
            <nav className="ml-10 flex space-x-4">
              <Link
                href="/dashboard/wyceny"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Wyceny
              </Link>
              <Link
                href="/dashboard/klienci"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Klienci
              </Link>
              <Link
                href="/dashboard/ustawienia"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Ustawienia
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{userEmail}</span>
            <form action="/api/auth/signout" method="post">
              <Button type="submit" variant="outline">
                Wyloguj się
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
