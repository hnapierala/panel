import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Database,
  CloudSunIcon as SolarPanel,
  Zap,
  Construction,
  Package,
  Wrench,
  Percent,
  CreditCard,
} from "lucide-react"

export default function UstawieniaPage() {
  const settingsCategories = [
    {
      title: "Panele fotowoltaiczne",
      description: "Zarządzaj dostępnymi panelami, ich mocą i cenami",
      icon: SolarPanel,
      href: "/dashboard/ustawienia/panele",
    },
    {
      title: "Falowniki",
      description: "Zarządzaj dostępnymi falownikami i ich parametrami",
      icon: Zap,
      href: "/dashboard/ustawienia/falowniki",
    },
    {
      title: "Konstrukcje",
      description: "Zarządzaj dostępnymi konstrukcjami montażowymi",
      icon: Construction,
      href: "/dashboard/ustawienia/konstrukcje",
    },
    {
      title: "Akcesoria",
      description: "Zarządzaj dostępnymi akcesoriami i materiałami",
      icon: Package,
      href: "/dashboard/ustawienia/akcesoria",
    },
    {
      title: "Usługi",
      description: "Zarządzaj usługami montażowymi i dodatkowymi",
      icon: Wrench,
      href: "/dashboard/ustawienia/uslugi",
    },
    {
      title: "Stawki",
      description: "Zarządzaj stawkami VAT i innymi stawkami procentowymi",
      icon: Percent,
      href: "/dashboard/ustawienia/stawki",
    },
    {
      title: "Ceny",
      description: "Zarządzaj cenami energii i innymi stałymi cenami",
      icon: CreditCard,
      href: "/dashboard/ustawienia/ceny",
    },
    {
      title: "Baza danych",
      description: "Zarządzaj danymi, wykonuj kopie zapasowe i przywracaj dane",
      icon: Database,
      href: "/dashboard/ustawienia/baza-danych",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ustawienia</h1>
        <p className="text-muted-foreground">Zarządzaj ustawieniami aplikacji i danymi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Link key={category.href} href={category.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <category.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
