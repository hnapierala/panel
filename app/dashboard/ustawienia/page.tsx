import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UstawieniaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ustawienia</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Zarządzaj swoim profilem i danymi osobowymi</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/ustawienia/profil">Edytuj profil</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Użytkownicy</CardTitle>
            <CardDescription>Zarządzaj użytkownikami systemu</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/ustawienia/uzytkownicy">Zarządzaj użytkownikami</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Baza danych</CardTitle>
            <CardDescription>Zarządzaj danymi w systemie</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/ustawienia/baza-danych">Zarządzaj bazą danych</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
