"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Plus, Pencil, Trash2, Search, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

// Definicja typu dla falownika
interface Inverter {
  id: string
  manufacturer: string
  model: string
  power: number
  price: number
  purchase_price?: number
  margin?: number
  type: string[]
  efficiency: number
  warranty: number
  created_at?: string
}

// Schema walidacji formularza
const inverterFormSchema = z.object({
  manufacturer: z.string().min(1, { message: "Producent jest wymagany" }),
  model: z.string().min(1, { message: "Model jest wymagany" }),
  power: z.coerce.number().min(0.1, { message: "Moc musi być większa od 0" }),
  price: z.coerce.number().min(0, { message: "Cena nie może być ujemna" }),
  purchase_price: z.coerce.number().min(0, { message: "Cena zakupu nie może być ujemna" }),
  margin: z.coerce.number().min(0, { message: "Marża nie może być ujemna" }),
  type: z.array(z.string()).min(1, { message: "Wybierz co najmniej jeden typ falownika" }),
  efficiency: z.coerce.number().min(1).max(100, { message: "Wydajność musi być między 1 a 100%" }),
  warranty: z.coerce.number().min(1, { message: "Gwarancja musi być większa od 0" }),
})

export default function InvertersPage() {
  const [inverters, setInverters] = useState<Inverter[]>([])
  const [filteredInverters, setFilteredInverters] = useState<Inverter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingInverter, setEditingInverter] = useState<Inverter | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [inverterToDelete, setInverterToDelete] = useState<Inverter | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const router = useRouter()

  // Inicjalizacja formularza
  const form = useForm<z.infer<typeof inverterFormSchema>>({
    resolver: zodResolver(inverterFormSchema),
    defaultValues: {
      manufacturer: "",
      model: "",
      power: 0,
      price: 0,
      purchase_price: 0,
      margin: 20, // Domyślna marża 20%
      type: [],
      efficiency: 0,
      warranty: 0,
    },
  })

  // Efekt do automatycznego obliczania ceny końcowej na podstawie ceny zakupu i marży
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "purchase_price" || name === "margin") {
        const purchasePrice = Number.parseFloat(value.purchase_price?.toString() || "0")
        const margin = Number.parseFloat(value.margin?.toString() || "0")

        if (!isNaN(purchasePrice) && !isNaN(margin)) {
          const finalPrice = purchasePrice * (1 + margin / 100)
          form.setValue("price", Math.round(finalPrice * 100) / 100)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  // Pobieranie falowników z bazy danych
  useEffect(() => {
    const fetchInverters = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("inverters")
          .select("*")
          .order("manufacturer", { ascending: true })
          .order("power", { ascending: false })

        if (error) throw new Error(error.message)

        setInverters(data || [])
        setFilteredInverters(data || [])
      } catch (err) {
        console.error("Błąd podczas pobierania falowników:", err)
        setError("Wystąpił błąd podczas pobierania danych. Spróbuj odświeżyć stronę.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInverters()
  }, [])

  // Filtrowanie falowników na podstawie wyszukiwania
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInverters(inverters)
    } else {
      const lowercaseSearch = searchTerm.toLowerCase()
      const filtered = inverters.filter(
        (inverter) =>
          inverter.manufacturer.toLowerCase().includes(lowercaseSearch) ||
          inverter.model.toLowerCase().includes(lowercaseSearch) ||
          inverter.power.toString().includes(lowercaseSearch) ||
          inverter.type.some((type) => type.toLowerCase().includes(lowercaseSearch)),
      )
      setFilteredInverters(filtered)
    }
  }, [searchTerm, inverters])

  // Obsługa dodawania/edycji falownika
  const handleSubmit = async (values: z.infer<typeof inverterFormSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()

      if (editingInverter) {
        // Aktualizacja istniejącego falownika
        const { error } = await supabase.from("inverters").update(values).eq("id", editingInverter.id)

        if (error) throw new Error(error.message)

        toast({
          title: "Falownik zaktualizowany",
          description: `Falownik ${values.manufacturer} ${values.model} został pomyślnie zaktualizowany.`,
        })
      } else {
        // Dodawanie nowego falownika
        const { error } = await supabase.from("inverters").insert([values])

        if (error) throw new Error(error.message)

        toast({
          title: "Falownik dodany",
          description: `Falownik ${values.manufacturer} ${values.model} został pomyślnie dodany.`,
        })
      }

      // Odświeżenie listy falowników
      const { data, error: fetchError } = await supabase
        .from("inverters")
        .select("*")
        .order("manufacturer", { ascending: true })
        .order("power", { ascending: false })

      if (fetchError) throw new Error(fetchError.message)

      setInverters(data || [])
      setFilteredInverters(data || [])

      // Zamknięcie formularza i reset stanu
      setIsFormDialogOpen(false)
      setEditingInverter(null)
      form.reset()
    } catch (err) {
      console.error("Błąd podczas zapisywania falownika:", err)
      setError("Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie.")
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Wystąpił błąd podczas zapisywania falownika. Spróbuj ponownie.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obsługa usuwania falownika
  const handleDelete = async () => {
    if (!inverterToDelete) return

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase.from("inverters").delete().eq("id", inverterToDelete.id)

      if (error) throw new Error(error.message)

      toast({
        title: "Falownik usunięty",
        description: `Falownik ${inverterToDelete.manufacturer} ${inverterToDelete.model} został pomyślnie usunięty.`,
      })

      // Odświeżenie listy falowników
      const { data, error: fetchError } = await supabase
        .from("inverters")
        .select("*")
        .order("manufacturer", { ascending: true })
        .order("power", { ascending: false })

      if (fetchError) throw new Error(fetchError.message)

      setInverters(data || [])
      setFilteredInverters(data || [])

      // Zamknięcie dialogu potwierdzenia
      setIsDeleteDialogOpen(false)
      setInverterToDelete(null)
    } catch (err) {
      console.error("Błąd podczas usuwania falownika:", err)
      setError("Wystąpił błąd podczas usuwania danych. Spróbuj ponownie.")
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Wystąpił błąd podczas usuwania falownika. Spróbuj ponownie.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obsługa edycji falownika
  const handleEdit = (inverter: Inverter) => {
    setEditingInverter(inverter)
    form.reset({
      manufacturer: inverter.manufacturer,
      model: inverter.model,
      power: inverter.power,
      price: inverter.price,
      purchase_price: inverter.purchase_price || 0,
      margin: inverter.margin || 20,
      type: inverter.type,
      efficiency: inverter.efficiency,
      warranty: inverter.warranty,
    })
    setIsFormDialogOpen(true)
  }

  // Obsługa otwierania dialogu usuwania
  const handleDeleteClick = (inverter: Inverter) => {
    setInverterToDelete(inverter)
    setIsDeleteDialogOpen(true)
  }

  // Obsługa otwierania formularza dodawania
  const handleAddClick = () => {
    setEditingInverter(null)
    form.reset({
      manufacturer: "",
      model: "",
      power: 0,
      price: 0,
      purchase_price: 0,
      margin: 20, // Domyślna marża 20%
      type: [],
      efficiency: 0,
      warranty: 0,
    })
    setIsFormDialogOpen(true)
  }

  // Funkcja pomocnicza do wyświetlania typu falownika
  const getInverterTypeLabel = (type: string) => {
    switch (type) {
      case "grid":
        return { label: "Sieciowy", color: "bg-blue-100 text-blue-800" }
      case "hybrid":
        return { label: "Hybrydowy", color: "bg-green-100 text-green-800" }
      case "offgrid":
        return { label: "Wyspowy", color: "bg-orange-100 text-orange-800" }
      default:
        return { label: type, color: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Nagłówek z przyciskiem powrotu */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/konfiguracja/kalkulator" className="text-[#1E8A3C] hover:text-[#1E8A3C]/80">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Falowniki</h1>
      </div>

      {/* Opis i akcje */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-neutral-100 p-2 rounded-lg flex items-center justify-center h-14 w-14">
            <Image src="/icons/inverter.png" alt="Falowniki" width={40} height={40} className="object-contain" />
          </div>
          <p className="text-neutral-600">Zarządzaj dostępnymi modelami falowników i ich cenami.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Szukaj falowników..."
              className="pl-9 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddClick} className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90">
            <Plus className="mr-2 h-4 w-4" />
            Dodaj falownik
          </Button>
        </div>
      </div>

      {/* Komunikat o błędzie */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabela falowników */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Producent</TableHead>
              <TableHead className="w-[180px]">Model</TableHead>
              <TableHead className="text-right">Moc [kW]</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead className="text-right">Wydajność [%]</TableHead>
              <TableHead className="text-right">Gwarancja [lat]</TableHead>
              <TableHead className="text-right">Cena zakupu [PLN]</TableHead>
              <TableHead className="text-right">Marża [%]</TableHead>
              <TableHead className="text-right">Cena końcowa [PLN]</TableHead>
              <TableHead className="text-right w-[100px]">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1E8A3C]" />
                    <span className="ml-2">Ładowanie danych...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredInverters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-neutral-500">
                  {searchTerm
                    ? "Nie znaleziono falowników spełniających kryteria wyszukiwania"
                    : "Brak falowników w bazie danych"}
                </TableCell>
              </TableRow>
            ) : (
              filteredInverters.map((inverter) => (
                <TableRow key={inverter.id}>
                  <TableCell className="font-medium">{inverter.manufacturer}</TableCell>
                  <TableCell>{inverter.model}</TableCell>
                  <TableCell className="text-right">{inverter.power}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {inverter.type.map((type) => {
                        const typeInfo = getInverterTypeLabel(type)
                        return (
                          <Badge key={type} className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{inverter.efficiency}%</TableCell>
                  <TableCell className="text-right">{inverter.warranty}</TableCell>
                  <TableCell className="text-right">{inverter.purchase_price?.toLocaleString() || "-"} PLN</TableCell>
                  <TableCell className="text-right">{inverter.margin?.toLocaleString() || "-"}%</TableCell>
                  <TableCell className="text-right">{inverter.price.toLocaleString()} PLN</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(inverter)}>
                        <Pencil className="h-4 w-4 text-neutral-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(inverter)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog formularza dodawania/edycji */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingInverter ? "Edytuj falownik" : "Dodaj nowy falownik"}</DialogTitle>
            <DialogDescription>
              {editingInverter ? "Zmień parametry falownika" : "Wprowadź dane nowego falownika"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Producent</FormLabel>
                      <FormControl>
                        <Input placeholder="Producent" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Model" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="power"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moc [kW]</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Moc" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="efficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wydajność [%]</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Wydajność" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gwarancja [lat]</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Gwarancja" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={() => (
                    <FormItem>
                      <FormLabel>Typ falownika</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {["grid", "hybrid", "offgrid"].map((type) => {
                          const typeInfo = getInverterTypeLabel(type)
                          return (
                            <Badge
                              key={type}
                              className={`${
                                form.watch("type")?.includes(type) ? typeInfo.color : "bg-gray-100 text-gray-500"
                              } cursor-pointer px-3 py-1`}
                              onClick={() => {
                                const currentTypes = form.getValues("type") || []
                                if (currentTypes.includes(type)) {
                                  form.setValue(
                                    "type",
                                    currentTypes.filter((t) => t !== type),
                                  )
                                } else {
                                  form.setValue("type", [...currentTypes, type])
                                }
                              }}
                            >
                              {typeInfo.label}
                            </Badge>
                          )
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="purchase_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cena zakupu [PLN]</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Cena zakupu"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marża [%]</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Marża"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cena końcowa [PLN]</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Cena końcowa"
                          {...field}
                          className="bg-gray-50"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Anuluj
                </Button>
                <Button type="submit" className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingInverter ? "Zapisywanie..." : "Dodawanie..."}
                    </>
                  ) : editingInverter ? (
                    "Zapisz zmiany"
                  ) : (
                    "Dodaj falownik"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć falownik {inverterToDelete?.manufacturer} {inverterToDelete?.model}? Ta
              operacja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Usuwanie...
                </>
              ) : (
                "Usuń falownik"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
