import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function KlienciPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Klienci</h1>
        <Button>Nowy klient</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista klientów</CardTitle>
          <CardDescription>Przeglądaj i zarządzaj bazą klientów</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center">
              Brak klientów do wyświetlenia. Kliknij "Nowy klient", aby dodać pierwszego klienta.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
