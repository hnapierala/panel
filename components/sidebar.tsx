"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Settings,
  Sun,
  Moon,
  Users,
  FileText,
  BarChart2,
  ShoppingCart,
  Zap,
  Calculator,
  Wrench,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(theme === "light" ? "dark" : "light")
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Klienci",
      href: "/dashboard/klienci",
      icon: Users,
    },
    {
      name: "Wyceny",
      href: "/dashboard/wyceny",
      icon: Calculator,
    },
    {
      name: "Zamówienia",
      href: "/dashboard/zamowienia",
      icon: ShoppingCart,
    },
    {
      name: "Instalacje",
      href: "/dashboard/instalacje",
      icon: Zap,
    },
    {
      name: "Serwis",
      href: "/dashboard/serwis",
      icon: Wrench,
    },
    {
      name: "Raporty",
      href: "/dashboard/raporty",
      icon: BarChart2,
    },
    {
      name: "Dokumenty",
      href: "/dashboard/dokumenty",
      icon: FileText,
    },
    {
      name: "Ustawienia",
      href: "/dashboard/ustawienia",
      icon: Settings,
    },
  ]

  return (
    <div className="w-64 border-r flex-shrink-0">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="mb-5 px-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">OZE System</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Panel zarządzania</p>
        </div>

        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
                  pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                    : "text-gray-900 dark:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 mr-3",
                    pathname === item.href || pathname?.startsWith(`${item.href}/`)
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="flex items-center p-2 w-full text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
            )}
            Tryb {theme === "light" ? "ciemny" : "jasny"}
          </button>
        </div>
      </div>
    </div>
  )
}
