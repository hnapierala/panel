import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function KalkulatorConfigPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Konfiguracja kalkulatora cen bazowych</h1>
        <p className="text-neutral-600">Zarządzaj komponentami, cenami i parametrami kalkulatora wycen.</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {configItems.map((item, index) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-neutral-100 p-2.5 rounded-lg flex items-center justify-center w-14 h-14">
                  <Image
                    src={item.iconSrc || "/placeholder.svg"}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-neutral-900">{item.title}</h2>
                  <p className="text-sm text-neutral-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>
            {index < configItems.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}

const configItems = [
  {
    href: "/dashboard/konfiguracja/kalkulator/panele",
    iconSrc: "/icons/panel.png",
    title: "Panele fotowoltaiczne",
    description: "Zarządzaj dostępnymi modelami paneli fotowoltaicznych i ich cenami.",
  },
  {
    href: "/dashboard/konfiguracja/kalkulator/falowniki",
    iconSrc: "/icons/inverter.png",
    title: "Falowniki",
    description: "Zarządzaj dostępnymi modelami falowników i ich cenami.",
  },
  {
    href: "/dashboard/konfiguracja/kalkulator/optymalizatory",
    iconSrc: "/icons/optimizer.png",
    title: "Optymalizatory mocy",
    description: "Zarządzaj dostępnymi modelami optymalizatorów mocy i ich cenami.",
  },
  {
    href: "/dashboard/konfiguracja/kalkulator/magazyny",
    iconSrc: "/icons/battery.png",
    title: "Magazyny energii",
    description: "Zarządzaj dostępnymi modelami magazynów energii i ich cenami.",
  },
  {
    href: "/dashboard/konfiguracja/kalkulator/montaz",
    iconSrc: "/icons/mounting_system.png",
    title: "Systemy montażowe",
    description: "Zarządzaj dostępnymi systemami montażowymi i ich cenami.",
  },
  {
    href: "/dashboard/konfiguracja/kalkulator/akcesoria",
    iconSrc: "/icons/inverter.png", // Tymczasowo używamy ikony falownika dla akcesoriów
    title: "Akcesoria i drobnica",
    description: "Zarządzaj cenami akcesoriów i drobnych elementów instalacji.",
  },
]
