import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Settings, Users, KeyRound } from "lucide-react"

export default function ConfigPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Ustawienia</h1>
        <p className="text-neutral-600">Zarządzaj ustawieniami systemu i konfiguracją kalkulatora.</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {configItems.map((item, index) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#1E8A3C]/10 p-2.5 rounded-lg">
                  <item.icon className="h-5 w-5 text-[#1E8A3C]" />
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
    href: "/dashboard/konfiguracja/kalkulator",
    icon: Settings,
    title: "Konfiguracja kalkulatora cen bazowych",
    description: "Zarządzaj komponentami, cenami i parametrami kalkulatora wycen.",
  },
  {
    href: "/dashboard/konfiguracja/uzytkownicy",
    icon: Users,
    title: "Użytkownicy",
    description: "Zarządzaj kontami użytkowników i ich uprawnieniami.",
  },
  {
    href: "/dashboard/konfiguracja/zmiana-hasla",
    icon: KeyRound,
    title: "Zmiana hasła",
    description: "Zmień hasło do swojego konta.",
  },
]
