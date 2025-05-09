import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WycenyPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wyceny</h1>
        <Button>Nowa wycena</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista wycen</CardTitle>
          <CardDescription>Przeglądaj i zarządzaj wycenami instalacji fotowoltaicznych</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center">
              Brak wycen do wyświetlenia. Kliknij "Nowa wycena", aby utworzyć pierwszą wycenę.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
