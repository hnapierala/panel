import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RaportyPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Raporty</h1>
        <p className="text-muted-foreground">Analizuj dane i generuj raporty</p>
      </div>

      <Tabs defaultValue="sprzedaz">
        <TabsList className="mb-4">
          <TabsTrigger value="sprzedaz">Sprzedaż</TabsTrigger>
          <TabsTrigger value="instalacje">Instalacje</TabsTrigger>
          <TabsTrigger value="serwis">Serwis</TabsTrigger>
          <TabsTrigger value="finanse">Finanse</TabsTrigger>
        </TabsList>

        <TabsContent value="sprzedaz">
          <Card>
            <CardHeader>
              <CardTitle>Raport sprzedaży</CardTitle>
              <CardDescription>
                Ta sekcja jest w trakcie implementacji. Tutaj będzie można generować raporty sprzedaży.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Funkcjonalność raportów sprzedaży będzie dostępna wkrótce.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instalacje">
          <Card>
            <CardHeader>
              <CardTitle>Raport instalacji</CardTitle>
              <CardDescription>
                Ta sekcja jest w trakcie implementacji. Tutaj będzie można generować raporty instalacji.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Funkcjonalność raportów instalacji będzie dostępna wkrótce.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serwis">
          <Card>
            <CardHeader>
              <CardTitle>Raport serwisowy</CardTitle>
              <CardDescription>
                Ta sekcja jest w trakcie implementacji. Tutaj będzie można generować raporty serwisowe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Funkcjonalność raportów serwisowych będzie dostępna wkrótce.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finanse">
          <Card>
            <CardHeader>
              <CardTitle>Raport finansowy</CardTitle>
              <CardDescription>
                Ta sekcja jest w trakcie implementacji. Tutaj będzie można generować raporty finansowe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Funkcjonalność raportów finansowych będzie dostępna wkrótce.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
