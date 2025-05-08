import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function DokumentyPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dokumenty</h1>
          <p className="text-muted-foreground">Zarządzaj dokumentami i szablonami</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Dodaj dokument
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dokumenty klientów</CardTitle>
            <CardDescription>Dokumenty związane z klientami i zamówieniami</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Funkcjonalność zarządzania dokumentami klientów będzie dostępna wkrótce.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szablony dokumentów</CardTitle>
            <CardDescription>Szablony umów, wycen i innych dokumentów</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Funkcjonalność zarządzania szablonami dokumentów będzie dostępna wkrótce.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
