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
import { Search, Plus, Eye, FileText, Mail, Phone } from "lucide-react"

export default function ClientsPage() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Klienci</h1>
        <p className="text-muted-foreground">Przeglądaj i zarządzaj klientami w systemie.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Szukaj klienta..." className="w-full pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszyscy</SelectItem>
              <SelectItem value="active">Aktywni</SelectItem>
              <SelectItem value="inactive">Nieaktywni</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sortowanie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Najnowsi</SelectItem>
              <SelectItem value="oldest">Najstarsi</SelectItem>
              <SelectItem value="name-asc">Nazwisko A-Z</SelectItem>
              <SelectItem value="name-desc">Nazwisko Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nowy klient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Klienci</CardTitle>
          <CardDescription>Lista wszystkich klientów w systemie.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imię i nazwisko</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Adres</TableHead>
                <TableHead>Liczba wycen</TableHead>
                <TableHead>Ostatnia wycena</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: "1",
                  name: "Jan Kowalski",
                  email: "jan.kowalski@example.com",
                  phone: "+48 123 456 789",
                  address: "ul. Kwiatowa 1, 00-001 Warszawa",
                  quotes: 3,
                  lastQuote: "2023-11-05",
                },
                {
                  id: "2",
                  name: "Anna Nowak",
                  email: "anna.nowak@example.com",
                  phone: "+48 234 567 890",
                  address: "ul. Polna 2, 00-002 Warszawa",
                  quotes: 1,
                  lastQuote: "2023-11-03",
                },
                {
                  id: "3",
                  name: "Piotr Wiśniewski",
                  email: "piotr.wisniewski@example.com",
                  phone: "+48 345 678 901",
                  address: "ul. Leśna 3, 00-003 Warszawa",
                  quotes: 2,
                  lastQuote: "2023-11-01",
                },
                {
                  id: "4",
                  name: "Magdalena Dąbrowska",
                  email: "magdalena.dabrowska@example.com",
                  phone: "+48 456 789 012",
                  address: "ul. Słoneczna 4, 00-004 Warszawa",
                  quotes: 1,
                  lastQuote: "2023-10-28",
                },
                {
                  id: "5",
                  name: "Tomasz Lewandowski",
                  email: "tomasz.lewandowski@example.com",
                  phone: "+48 567 890 123",
                  address: "ul. Ogrodowa 5, 00-005 Warszawa",
                  quotes: 2,
                  lastQuote: "2023-10-25",
                },
                {
                  id: "6",
                  name: "Katarzyna Zielińska",
                  email: "katarzyna.zielinska@example.com",
                  phone: "+48 678 901 234",
                  address: "ul. Parkowa 6, 00-006 Warszawa",
                  quotes: 1,
                  lastQuote: "2023-10-22",
                },
                {
                  id: "7",
                  name: "Marcin Szymański",
                  email: "marcin.szymanski@example.com",
                  phone: "+48 789 012 345",
                  address: "ul. Lipowa 7, 00-007 Warszawa",
                  quotes: 1,
                  lastQuote: "2023-10-20",
                },
                {
                  id: "8",
                  name: "Agnieszka Woźniak",
                  email: "agnieszka.wozniak@example.com",
                  phone: "+48 890 123 456",
                  address: "ul. Brzozowa 8, 00-008 Warszawa",
                  quotes: 1,
                  lastQuote: "2023-10-18",
                },
              ].map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>{client.quotes}</TableCell>
                  <TableCell>{client.lastQuote}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Podgląd</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Wyceny</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                        <span className="sr-only">Telefon</span>
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
