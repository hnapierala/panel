"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Moon, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Calculator, Settings, FileText, Users } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface CalculatorLayoutProps {
  children: ReactNode
}

export default function CalculatorLayout({ children }: CalculatorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Zamknij sidebar przy zmianie rozmiaru ekranu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [sidebarOpen])

  // Obsługa klawisza Escape do zamykania menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [sidebarOpen])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Górny pasek z logo, przełącznikiem motywu i wylogowaniem - widoczny tylko gdy menu jest zamknięte */}
      {!sidebarOpen && (
        <header className="sticky top-0 z-10 flex h-16 sm:h-20 items-center justify-between border-b border-neutral-100 bg-white px-2 sm:px-4 md:px-6 pt-safe pb-safe">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-[#1E8A3C] hover:bg-[#1E8A3C]/10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
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
      )}

      <div className="flex flex-1">
        {/* Overlay z animacją */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 z-20"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar z animacją - zaczyna się od samej góry */}
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: sidebarOpen ? 0 : "-100%" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 1,
          }}
          className="fixed top-0 bottom-0 left-0 z-30 w-[85%] max-w-[280px] sm:w-64 border-r border-neutral-100 bg-white pb-safe pt-safe"
        >
          {/* Nagłówek menu tylko z przyciskiem X */}
          <div className="flex items-center justify-end p-4 border-b border-neutral-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-[#1E8A3C] hover:bg-[#1E8A3C]/10"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Zamknij menu</span>
            </Button>
          </div>

          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="grid gap-1 px-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: sidebarOpen ? 0.1 + index * 0.05 : 0,
                    duration: 0.2,
                  }}
                >
                  <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C] text-sm sm:text-base py-2.5 sm:py-1.5 h-auto"
                    >
                      <item.icon className="mr-2 h-4 w-4 text-[#1E8A3C]" />
                      {item.label}
                    </Button>
                  </Link>
                  {item.separator && <Separator className="my-2 bg-neutral-100" />}
                </motion.div>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Główna zawartość */}
        <main className="flex-1 w-full overflow-x-hidden">
          {/* Nagłówek dla głównej zawartości, widoczny tylko gdy menu jest otwarte */}
          {sidebarOpen && (
            <header className="sticky top-0 z-10 flex h-16 sm:h-20 items-center justify-between border-b border-neutral-100 bg-white px-2 sm:px-4 md:px-6 pt-safe pb-safe">
              <div className="w-10 h-10"></div> {/* Placeholder dla zachowania układu */}
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
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

// Dane menu dla łatwiejszego zarządzania
const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", separator: false },
  { href: "/kalkulator-wycen", icon: Calculator, label: "Kalkulator wycen", separator: false },
  { href: "/dashboard/wyceny", icon: FileText, label: "Lista wycen", separator: false },
  { href: "/dashboard/klienci", icon: Users, label: "Klienci", separator: true },
  { href: "/dashboard/konfiguracja", icon: Settings, label: "Ustawienia", separator: false },
]

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#1E8A3C] hover:bg-transparent hover:text-[#1E8A3C]/80"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-white">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-20 items-center justify-center border-b border-neutral-100 px-4">
            <Image src="/logo.png" alt="OZE System" width={220} height={60} className="h-20 w-auto" priority />
          </div>
          <nav className="grid gap-1 px-2 p-4">
            {menuItems.map((item) => (
              <div key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C]"
                  >
                    <item.icon className="mr-2 h-4 w-4 text-[#1E8A3C]" />
                    {item.label}
                  </Button>
                </Link>
                {item.separator && <Separator className="my-2 bg-neutral-100" />}
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
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
