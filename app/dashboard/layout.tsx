"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Calculator, Settings, FileText, Users, Moon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 flex h-16 sm:h-20 items-center justify-between border-b border-neutral-100 bg-white px-2 sm:px-4 md:px-6 pt-safe pb-safe">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#1E8A3C] hover:bg-[#1E8A3C]/10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        <div className="flex items-center justify-center">
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="OZE System"
              width={220}
              height={60}
              className="h-12 sm:h-16 md:h-20 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-[#1E8A3C] hover:bg-transparent hover:text-[#1E8A3C]/80"
          >
            <Link href="/auth/logout">Wyloguj</Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar jako overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed top-16 sm:top-20 bottom-0 left-0 z-30 w-[85%] max-w-[280px] sm:w-64 border-r border-neutral-100 bg-white transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:z-0 pb-safe`}
        >
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="grid gap-1 px-2">
              <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C] text-sm sm:text-base py-2.5 sm:py-1.5 h-auto"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4 text-[#1E8A3C]" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/kalkulator-wycen" onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C] text-sm sm:text-base py-2.5 sm:py-1.5 h-auto"
                >
                  <Calculator className="mr-2 h-4 w-4 text-[#1E8A3C]" />
                  Kalkulator wycen
                </Button>
              </Link>
              <Link href="/dashboard/wyceny" onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C] text-sm sm:text-base py-2.5 sm:py-1.5 h-auto"
                >
                  <FileText className="mr-2 h-4 w-4 text-[#1E8A3C]" />
                  Lista wycen
                </Button>
              </Link>
              <Link href="/dashboard/klienci" onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C] text-sm sm:text-base py-2.5 sm:py-1.5 h-auto"
                >
                  <Users className="mr-2 h-4 w-4 text-[#1E8A3C]" />
                  Klienci
                </Button>
              </Link>
              <Separator className="my-2 bg-neutral-100" />
              <Link href="/dashboard/konfiguracja" onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C] text-sm sm:text-base py-2.5 sm:py-1.5 h-auto"
                >
                  <Settings className="mr-2 h-4 w-4 text-[#1E8A3C]" />
                  Ustawienia
                </Button>
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-[#1E8A3C] hover:bg-transparent hover:text-[#1E8A3C]/80"
    >
      <Moon className="h-5 w-5" />
      <span className="sr-only">Przełącz motyw</span>
    </Button>
  )
}
