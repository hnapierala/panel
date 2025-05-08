import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function WycenyPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wyceny</h1>
          <p className="text-muted-foreground">Twórz i zarządzaj wycenami instalacji fotowoltaicznych</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nowa wycena
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista wycen</CardTitle>
          <CardDescription>
            Ta sekcja jest w trakcie implementacji. Tutaj będzie można tworzyć i zarządzać wycenami.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Funkcjonalność wycen będzie dostępna wkrótce.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
