"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PriceCalculatorLayoutProps {
  children: ReactNode
}

export default function PriceCalculatorLayout({ children }: PriceCalculatorLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Drugi pasek z przyciskiem powrotu */}
      <div className="flex h-16 items-center border-b border-neutral-100 bg-white px-4 md:px-6">
        <Link href="/dashboard/konfiguracja" className="flex items-center gap-2 text-[#1E8A3C] hover:text-[#1E8A3C]/80">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Powrót</span>
        </Link>
      </div>

      <main className="flex-1">{children}</main>
    </div>
  )
}
