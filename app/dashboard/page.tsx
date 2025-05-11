import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Settings, Calculator, FileText, Users, Battery, Database } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Witaj w systemie zarządzania wycenami instalacji fotowoltaicznych.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-[#1E8A3C]/5 to-[#1E8A3C]/10">
            <CardTitle className="text-sm font-medium text-neutral-800">Aktywne wyceny</CardTitle>
            <FileText className="h-4 w-4 text-[#1E8A3C]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-neutral-900">12</div>
            <p className="text-xs text-neutral-600">+2 w ostatnim tygodniu</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-[#1E8A3C]/5 to-[#1E8A3C]/10">
            <CardTitle className="text-sm font-medium text-neutral-800">Klienci</CardTitle>
            <Users className="h-4 w-4 text-[#1E8A3C]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-neutral-900">24</div>
            <p className="text-xs text-neutral-600">+4 w ostatnim miesiącu</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-[#1E8A3C]/5 to-[#1E8A3C]/10">
            <CardTitle className="text-sm font-medium text-neutral-800">Łączna moc instalacji</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-[#1E8A3C]"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2" />
              <path d="M12 21v2" />
              <path d="M4.22 4.22l1.42 1.42" />
              <path d="M18.36 18.36l1.42 1.42" />
              <path d="M1 12h2" />
              <path d="M21 12h2" />
              <path d="M4.22 19.78l1.42-1.42" />
              <path d="M18.36 5.64l1.42-1.42" />
            </svg>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-neutral-900">156 kWp</div>
            <p className="text-xs text-neutral-600">+32 kWp w ostatnim kwartale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2 border-none shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#1E8A3C]/5 to-[#1E8A3C]/10">
            <CardTitle className="text-neutral-800">Szybkie akcje</CardTitle>
            <CardDescription className="text-neutral-600">Najczęściej używane funkcje systemu</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 pt-6">
            <Link href="/kalkulator-wycen" className="w-full">
              <Button className="w-full bg-[#1E8A3C] hover:bg-[#1E8A3C]/90 text-white">
                <Calculator className="mr-2 h-4 w-4" />
                Nowa wycena
              </Button>
            </Link>
            <Link href="/dashboard/wyceny" className="w-full">
              <Button
                variant="outline"
                className="w-full border-[#E5B80B]/20 text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C]"
              >
                <FileText className="mr-2 h-4 w-4 text-[#E5B80B]" />
                Lista wycen
              </Button>
            </Link>
            <Link href="/dashboard/klienci" className="w-full">
              <Button
                variant="outline"
                className="w-full border-[#E5B80B]/20 text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C]"
              >
                <Users className="mr-2 h-4 w-4 text-[#E5B80B]" />
                Klienci
              </Button>
            </Link>
            <Link href="/dashboard/konfiguracja" className="w-full">
              <Button
                variant="outline"
                className="w-full border-[#E5B80B]/20 text-neutral-700 hover:bg-[#1E8A3C]/5 hover:text-[#1E8A3C]"
              >
                <Settings className="mr-2 h-4 w-4 text-[#E5B80B]" />
                Konfiguracja
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="col-span-2 border-none shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#1E8A3C]/5 to-[#1E8A3C]/10">
            <CardTitle className="text-neutral-800">Stan magazynu</CardTitle>
            <CardDescription className="text-neutral-600">Dostępność komponentów</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-[#1E8A3C]"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2" />
                    <path d="M12 21v2" />
                    <path d="M4.22 4.22l1.42 1.42" />
                    <path d="M18.36 18.36l1.42 1.42" />
                    <path d="M1 12h2" />
                    <path d="M21 12h2" />
                    <path d="M4.22 19.78l1.42-1.42" />
                    <path d="M18.36 5.64l1.42-1.42" />
                  </svg>
                  <span className="text-neutral-700">Panele fotowoltaiczne</span>
                </div>
                <span className="font-medium text-[#1E8A3C]">Dostępne (120 szt.)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-[#1E8A3C]" />
                  <span className="text-neutral-700">Falowniki</span>
                </div>
                <span className="font-medium text-[#E5B80B]">Ograniczona dostępność (8 szt.)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery className="h-4 w-4 text-[#1E8A3C]" />
                  <span className="text-neutral-700">Magazyny energii</span>
                </div>
                <span className="font-medium text-red-600">Brak w magazynie</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-[#1E8A3C]" />
                  <span className="text-neutral-700">Optymalizatory</span>
                </div>
                <span className="font-medium text-[#1E8A3C]">Dostępne (45 szt.)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#1E8A3C]/5 to-[#1E8A3C]/10">
            <CardTitle className="text-neutral-800">Ostatnie wyceny</CardTitle>
            <CardDescription className="text-neutral-600">5 ostatnio utworzonych wycen</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {[
                {
                  id: "WYC-2023-042",
                  client: "Jan Kowalski",
                  date: "2023-11-05",
                  power: "10.2 kWp",
                  status: "Aktywna",
                },
                { id: "WYC-2023-041", client: "Anna Nowak", date: "2023-11-03", power: "6.8 kWp", status: "Aktywna" },
                {
                  id: "WYC-2023-040",
                  client: "Piotr Wiśniewski",
                  date: "2023-11-01",
                  power: "12.4 kWp",
                  status: "Aktywna",
                },
                {
                  id: "WYC-2023-039",
                  client: "Magdalena Dąbrowska",
                  date: "2023-10-28",
                  power: "8.6 kWp",
                  status: "Wygasła",
                },
                {
                  id: "WYC-2023-038",
                  client: "Tomasz Lewandowski",
                  date: "2023-10-25",
                  power: "15.0 kWp",
                  status: "Zaakceptowana",
                },
              ].map((quote) => (
                <div key={quote.id} className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div>
                    <div className="font-medium text-neutral-800">{quote.client}</div>
                    <div className="text-sm text-neutral-600">
                      {quote.id} | {quote.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-neutral-800">{quote.power}</div>
                    <div
                      className={`text-sm ${
                        quote.status === "Aktywna"
                          ? "text-[#1E8A3C]"
                          : quote.status === "Wygasła"
                            ? "text-red-600"
                            : "text-[#1E8A3C]"
                      }`}
                    >
                      {quote.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#1E8A3C]/5 to-[#1E8A3C]/10">
            <CardTitle className="text-neutral-800">Popularne komponenty</CardTitle>
            <CardDescription className="text-neutral-600">Najczęściej wybierane komponenty w wycenach</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Panele</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">JA Solar 455W</span>
                    <span className="text-sm font-medium text-neutral-800">42%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-[#1E8A3C] h-full rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Falowniki</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">SolarEdge 6kW</span>
                    <span className="text-sm font-medium text-neutral-800">38%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-[#1E8A3C] h-full rounded-full" style={{ width: "38%" }}></div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Magazyny energii</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">BYD 10kWh</span>
                    <span className="text-sm font-medium text-neutral-800">27%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-[#1E8A3C] h-full rounded-full" style={{ width: "27%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
