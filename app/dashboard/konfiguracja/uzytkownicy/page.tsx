"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  // Przykładowi użytkownicy
  const users = [
    {
      id: "1",
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      role: "Administrator",
      lastLogin: "2023-11-05 14:30",
    },
    {
      id: "2",
      name: "Anna Nowak",
      email: "anna.nowak@example.com",
      role: "Handlowiec",
      lastLogin: "2023-11-04 09:15",
    },
    {
      id: "3",
      name: "Piotr Wiśniewski",
      email: "piotr.wisniewski@example.com",
      role: "Handlowiec",
      lastLogin: "2023-11-03 16:45",
    },
    {
      id: "4",
      name: "Magdalena Dąbrowska",
      email: "magdalena.dabrowska@example.com",
      role: "Handlowiec",
      lastLogin: "2023-10-28 11:20",
    },
    {
      id: "5",
      name: "Tomasz Lewandowski",
      email: "tomasz.lewandowski@example.com",
      role: "Administrator",
      lastLogin: "2023-10-25 08:30",
    },
  ]

  const handleDeleteUser = (userId: string) => {
    setSelectedUser(userId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Tutaj logika usuwania użytkownika
    console.log(`Usunięto użytkownika o ID: ${selectedUser}`)
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/konfiguracja" className="text-[#1E8A3C] hover:text-[#1E8A3C]/80">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Użytkownicy</h1>
            <p className="text-neutral-600">Zarządzaj kontami użytkowników i ich uprawnieniami.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <Input type="search" placeholder="Szukaj użytkownika..." className="w-full pl-8 border-neutral-200" />
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto bg-[#1E8A3C] hover:bg-[#1E8A3C]/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Dodaj użytkownika
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
              <DialogDescription>Wprowadź dane nowego użytkownika systemu.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Imię i nazwisko
                </Label>
                <Input id="name" className="col-span-3 border-neutral-200" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3 border-neutral-200" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rola
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3 border-neutral-200">
                    <SelectValue placeholder="Wybierz rolę" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="sales">Handlowiec</SelectItem>
                    <SelectItem value="viewer">Przeglądający</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Hasło
                </Label>
                <Input id="password" type="password" className="col-span-3 border-neutral-200" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Powtórz hasło
                </Label>
                <Input id="confirm-password" type="password" className="col-span-3 border-neutral-200" />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddUserOpen(false)}
                className="border-neutral-200"
              >
                Anuluj
              </Button>
              <Button type="submit" className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90 text-white">
                Dodaj użytkownika
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-neutral-100 px-6">
          <CardTitle className="text-lg font-medium text-neutral-900">Lista użytkowników</CardTitle>
          <CardDescription className="text-neutral-500">
            Lista wszystkich użytkowników z dostępem do systemu.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imię i nazwisko</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Ostatnie logowanie</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "Administrator"
                          ? "bg-[#1E8A3C]/10 text-[#1E8A3C]"
                          : "bg-[#E5B80B]/10 text-[#E5B80B]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="border-neutral-200 text-neutral-700">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edytuj</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-neutral-200 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Usuń</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć tego użytkownika? Ta operacja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-neutral-200"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
