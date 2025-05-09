import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UzytkownicyPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Zarządzanie użytkownikami</h1>
        <Button>Zaproś użytkownika</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Narzędzia administracyjne</CardTitle>
          <CardDescription>Narzędzia do zarządzania użytkownikami</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/uzytkownicy/potwierdz-email">Potwierdź email użytkownika</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/ustawienia/uzytkownicy/resetuj-haslo">Resetuj hasło użytkownika</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista użytkowników</CardTitle>
          <CardDescription>Przeglądaj i zarządzaj użytkownikami systemu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center">
              Brak użytkowników do wyświetlenia. Kliknij "Zaproś użytkownika", aby dodać pierwszego użytkownika.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
