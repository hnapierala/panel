import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Download, Trash } from "lucide-react"
import Link from "next/link"

export default function QuotesPage() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lista wycen</h1>
        <p className="text-muted-foreground">Przeglądaj i zarządzaj wycenami instalacji fotowoltaicznych.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Szukaj wyceny..." className="w-full pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="active">Aktywne</SelectItem>
              <SelectItem value="expired">Wygasłe</SelectItem>
              <SelectItem value="converted">Zaakceptowane</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sortowanie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Najnowsze</SelectItem>
              <SelectItem value="oldest">Najstarsze</SelectItem>
              <SelectItem value="price-asc">Cena rosnąco</SelectItem>
              <SelectItem value="price-desc">Cena malejąco</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link href="/dashboard/konfiguracja/ceny-bazowe">
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nowa wycena
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wyceny</CardTitle>
          <CardDescription>Lista wszystkich wycen w systemie.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Data utworzenia</TableHead>
                <TableHead>Wygasa</TableHead>
                <TableHead>Moc</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: "WYC-2023-042",
                  client: "Jan Kowalski",
                  created: "2023-11-05",
                  expires: "2023-11-15",
                  power: "10.2 kWp",
                  price: "42 500 PLN",
                  status: "active",
                },
                {
                  id: "WYC-2023-041",
                  client: "Anna Nowak",
                  created: "2023-11-03",
                  expires: "2023-11-13",
                  power: "6.8 kWp",
                  price: "28 900 PLN",
                  status: "active",
                },
                {
                  id: "WYC-2023-040",
                  client: "Piotr Wiśniewski",
                  created: "2023-11-01",
                  expires: "2023-11-11",
                  power: "12.4 kWp",
                  price: "51 200 PLN",
                  status: "active",
                },
                {
                  id: "WYC-2023-039",
                  client: "Magdalena Dąbrowska",
                  created: "2023-10-28",
                  expires: "2023-11-08",
                  power: "8.6 kWp",
                  price: "36 800 PLN",
                  status: "expired",
                },
                {
                  id: "WYC-2023-038",
                  client: "Tomasz Lewandowski",
                  created: "2023-10-25",
                  expires: "2023-11-05",
                  power: "15.0 kWp",
                  price: "62 300 PLN",
                  status: "converted",
                },
                {
                  id: "WYC-2023-037",
                  client: "Katarzyna Zielińska",
                  created: "2023-10-22",
                  expires: "2023-11-02",
                  power: "5.4 kWp",
                  price: "24 600 PLN",
                  status: "expired",
                },
                {
                  id: "WYC-2023-036",
                  client: "Marcin Szymański",
                  created: "2023-10-20",
                  expires: "2023-10-30",
                  power: "9.8 kWp",
                  price: "41 200 PLN",
                  status: "converted",
                },
                {
                  id: "WYC-2023-035",
                  client: "Agnieszka Woźniak",
                  created: "2023-10-18",
                  expires: "2023-10-28",
                  power: "7.2 kWp",
                  price: "32 100 PLN",
                  status: "expired",
                },
              ].map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.client}</TableCell>
                  <TableCell>{quote.created}</TableCell>
                  <TableCell>{quote.expires}</TableCell>
                  <TableCell>{quote.power}</TableCell>
                  <TableCell>{quote.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        quote.status === "active" ? "default" : quote.status === "expired" ? "destructive" : "outline"
                      }
                    >
                      {quote.status === "active" ? "Aktywna" : quote.status === "expired" ? "Wygasła" : "Zaakceptowana"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Podgląd</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Pobierz</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Usuń</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
