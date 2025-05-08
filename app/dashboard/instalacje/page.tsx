import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function InstalacjePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Instalacje</h1>
          <p className="text-muted-foreground">Zarządzaj instalacjami fotowoltaicznymi</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nowa instalacja
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista instalacji</CardTitle>
          <CardDescription>
            Ta sekcja jest w trakcie implementacji. Tutaj będzie można zarządzać instalacjami.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Funkcjonalność zarządzania instalacjami będzie dostępna wkrótce.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
