"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Calculator, Save, Plus, Minus, HelpCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalculatorService } from "@/services/calculator.service"
import { Stepper } from "@/components/stepper"
import type {
  Panel,
  Inverter,
  Optimizer,
  MountingSystem,
  EnergyStorage,
  AccessoriesConfig,
  PriceCalculation,
  InverterType,
  MountingType,
  ClientData,
  QuoteData,
} from "@/types/calculator.types"

// Schemat walidacji formularza
const baseFormSchema = z.object({
  // Dane klienta
  firstName: z.string().min(1, { message: "Imię jest wymagane" }),
  lastName: z.string().min(1, { message: "Nazwisko jest wymagane" }),
  phone: z.string().min(9, { message: "Nieprawidłowy numer telefonu" }),
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  street: z.string().optional(),
  buildingNumber: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),

  // Komponenty
  panelManufacturer: z.string().min(1, { message: "Wybierz producenta paneli" }),
  panelModel: z.string().min(1, { message: "Wybierz model paneli" }),
  inverterType: z.string().min(1, { message: "Wybierz typ falownika" }),
  inverterManufacturer: z.string().min(1, { message: "Wybierz producenta falownika" }),
  inverterModel: z.string().min(1, { message: "Wybierz model falownika" }),
  optimizerModel: z.string().optional(),
  mountingType: z.string().min(1, { message: "Wybierz typ montażu" }),
  storageModel: z.string().optional(),

  // Marża
  marginType: z.enum(["percentage", "amount"]),
  marginPercentage: z
    .number()
    .min(0, { message: "Marża nie może być ujemna" })
    .max(100, { message: "Marża nie może przekraczać 100%" }),
  marginAmount: z.number().min(0, { message: "Marża nie może być ujemna" }),
})

// Kroki kreatora
const steps = [
  { id: "components", name: "1. Komponenty", description: "Wybór komponentów instalacji" },
  { id: "price", name: "2. Cena bazowa", description: "Ustalenie ceny i marży" },
  { id: "client", name: "3. Dane klienta", description: "Wprowadzenie danych klienta" },
]

export default function BasePriceCalculatorPage() {
  // Stan komponentu
  const [currentStep, setCurrentStep] = useState(0)
  const [panelCount, setPanelCount] = useState<number>(8)
  const [totalPower, setTotalPower] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Dane z bazy
  const [panels, setPanels] = useState<Panel[]>([])
  const [filteredPanels, setFilteredPanels] = useState<Panel[]>([])
  const [panelManufacturers, setPanelManufacturers] = useState<string[]>([])

  const [inverters, setInverters] = useState<Inverter[]>([])
  const [filteredInverters, setFilteredInverters] = useState<Inverter[]>([])
  const [inverterManufacturers, setInverterManufacturers] = useState<string[]>([])

  const [optimizers, setOptimizers] = useState<Optimizer[]>([])
  const [filteredOptimizers, setFilteredOptimizers] = useState<Optimizer[]>([])

  const [mountingSystems, setMountingSystems] = useState<MountingSystem[]>([])

  const [energyStorages, setEnergyStorages] = useState<EnergyStorage[]>([])
  const [filteredStorages, setFilteredStorages] = useState<EnergyStorage[]>([])

  const [accessoriesConfig, setAccessoriesConfig] = useState<AccessoriesConfig>({ ranges: [] })

  // Wybrane elementy
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null)
  const [selectedInverter, setSelectedInverter] = useState<Inverter | null>(null)
  const [selectedOptimizer, setSelectedOptimizer] = useState<Optimizer | null>(null)
  const [selectedMountingSystem, setSelectedMountingSystem] = useState<MountingSystem | null>(null)
  const [selectedStorage, setSelectedStorage] = useState<EnergyStorage | null>(null)

  // Flagi
  const [optimizersRequired, setOptimizersRequired] = useState(false)
  const [showHighPowerOptimizers, setShowHighPowerOptimizers] = useState(false)
  const [storageDisabled, setStorageDisabled] = useState(false)
  const [showOptimizers, setShowOptimizers] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Inicjalizacja formularza
  const form = useForm<z.infer<typeof baseFormSchema>>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      street: "",
      buildingNumber: "",
      postalCode: "",
      city: "",

      panelManufacturer: "",
      panelModel: "",
      inverterType: "all",
      inverterManufacturer: "",
      inverterModel: "",
      optimizerModel: "",
      mountingType: "",
      storageModel: "",

      marginType: "percentage",
      marginPercentage: 20,
      marginAmount: 0,
    },
  })

  // Pobieranie danych z bazy przy inicjalizacji
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Pobieranie paneli
        const panelsData = await CalculatorService.getPanels()
        setPanels(panelsData)

        // Wyodrębnienie unikalnych producentów paneli
        const manufacturers = [...new Set(panelsData.map((panel) => panel.manufacturer))]
        setPanelManufacturers(manufacturers)

        // Pobieranie falowników
        const invertersData = await CalculatorService.getInverters()
        setInverters(invertersData)

        // Wyodrębnienie unikalnych producentów falowników
        const inverterManufacturers = [...new Set(invertersData.map((inverter) => inverter.manufacturer))]
        setInverterManufacturers(inverterManufacturers)

        // Pobieranie optymalizatorów
        const optimizersData = await CalculatorService.getOptimizers()
        setOptimizers(optimizersData)

        // Pobieranie systemów montażowych
        const mountingSystemsData = await CalculatorService.getMountingSystems()
        setMountingSystems(mountingSystemsData)

        // Pobieranie magazynów energii
        const storagesData = await CalculatorService.getEnergyStorages()
        setEnergyStorages(storagesData)

        // Pobieranie konfiguracji akcesoriów
        const accessoriesConfigData = await CalculatorService.getAccessoriesConfig()
        setAccessoriesConfig(accessoriesConfigData)
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Obsługa zmiany producenta paneli
  const handlePanelManufacturerChange = (manufacturer: string) => {
    form.setValue("panelManufacturer", manufacturer)
    form.setValue("panelModel", "")
    setSelectedPanel(null)

    // Filtrowanie paneli według wybranego producenta
    const filtered = panels.filter((panel) => panel.manufacturer === manufacturer)
    setFilteredPanels(filtered)
  }

  // Obsługa zmiany modelu paneli
  const handlePanelModelChange = (modelId: string) => {
    form.setValue("panelModel", modelId)

    // Znalezienie wybranego panelu
    const panel = panels.find((p) => p.id === modelId) || null
    setSelectedPanel(panel)

    // Aktualizacja mocy instalacji
    if (panel) {
      setTotalPower((panel.power * panelCount) / 1000)
    }
  }

  // Obsługa zmiany typu falownika
  const handleInverterTypeChange = (type: string) => {
    form.setValue("inverterType", type)
    form.setValue("inverterManufacturer", "")
    form.setValue("inverterModel", "")
    form.setValue("optimizerModel", "")
    form.setValue("storageModel", "")

    setSelectedInverter(null)
    setSelectedOptimizer(null)
    setSelectedStorage(null)

    // Filtrowanie falowników według wybranego typu
    const inverterType = type as InverterType

    // Jeśli wybrano "all", pokaż wszystkie falowniki
    if (inverterType === "all") {
      setFilteredInverters(inverters)

      // Wyodrębnienie unikalnych producentów dla wszystkich falowników
      const manufacturers = [...new Set(inverters.map((inverter) => inverter.manufacturer))]
      setInverterManufacturers(manufacturers)
    } else {
      // Filtruj falowniki lokalnie zamiast robić nowe zapytanie
      const filtered = inverters.filter((inverter) => inverter.type.includes(inverterType))
      setFilteredInverters(filtered)

      // Wyodrębnienie unikalnych producentów dla wyfiltrowanych falowników
      const manufacturers = [...new Set(filtered.map((inverter) => inverter.manufacturer))]
      setInverterManufacturers(manufacturers)
    }

    // Ustawienie flagi dla magazynu energii
    setStorageDisabled(inverterType === "grid")
  }

  // Obsługa zmiany producenta falownika
  const handleInverterManufacturerChange = (manufacturer: string) => {
    form.setValue("inverterManufacturer", manufacturer)
    form.setValue("inverterModel", "")
    form.setValue("optimizerModel", "")
    form.setValue("storageModel", "")

    setSelectedInverter(null)
    setSelectedOptimizer(null)
    setSelectedStorage(null)

    // Filtrowanie falowników według wybranego producenta
    const filtered = filteredInverters.filter((inverter) => inverter.manufacturer === manufacturer)
    setFilteredInverters(filtered)
  }

  // Obsługa zmiany modelu falownika
  const handleInverterModelChange = (modelId: string) => {
    form.setValue("inverterModel", modelId)

    // Znalezienie wybranego falownika
    const inverter = inverters.find((i) => i.id === modelId) || null
    setSelectedInverter(inverter)

    if (inverter) {
      // Sprawdzenie czy falownik wymaga optymalizatorów
      const isSolarEdge = inverter.manufacturer.toUpperCase() === "SOLAREDGE"
      setOptimizersRequired(isSolarEdge)
      setShowOptimizers(isSolarEdge || inverter.manufacturer.toUpperCase() === "HUAWEI")

      // Sprawdzenie czy pokazać optymalizatory 1:2 dla falowników SolarEdge > 16kW
      setShowHighPowerOptimizers(isSolarEdge && inverter.power > 16)

      // Filtrowanie optymalizatorów kompatybilnych z wybranym falownikiem
      CalculatorService.getOptimizers(inverter.id).then((filteredOptimizers) => {
        setFilteredOptimizers(filteredOptimizers)

        // Jeśli optymalizatory są wymagane, automatycznie wybierz pierwszy
        if (isSolarEdge && filteredOptimizers.length > 0) {
          // Wybierz standardowy optymalizator 1:1 lub 1:2 w zależności od mocy falownika
          const ratio = inverter.power > 16 ? "1:2" : "1:1"
          const defaultOptimizer = filteredOptimizers.find((o) => o.ratio === ratio) || filteredOptimizers[0]
          form.setValue("optimizerModel", defaultOptimizer.id)
          setSelectedOptimizer(defaultOptimizer)
        }
      })

      // Filtrowanie magazynów energii kompatybilnych z wybranym falownikiem
      CalculatorService.getEnergyStorages(inverter.id).then((filteredStorages) => {
        setFilteredStorages(filteredStorages)
      })
    }
  }

  // Obsługa zmiany modelu optymalizatora
  const handleOptimizerModelChange = (modelId: string) => {
    form.setValue("optimizerModel", modelId)

    // Znalezienie wybranego optymalizatora
    const optimizer = optimizers.find((o) => o.id === modelId) || null
    setSelectedOptimizer(optimizer)
  }

  // Obsługa zmiany typu montażu
  const handleMountingTypeChange = (type: string) => {
    form.setValue("mountingType", type)

    // Znalezienie wybranego systemu montażowego
    const mountingType = type as MountingType
    const mountingSystem = mountingSystems.find((m) => m.type === mountingType) || null
    setSelectedMountingSystem(mountingSystem)
  }

  // Obsługa zmiany modelu magazynu energii
  const handleStorageModelChange = (modelId: string) => {
    form.setValue("storageModel", modelId)

    if (modelId === "none") {
      setSelectedStorage(null)
      return
    }

    // Znalezienie wybranego magazynu energii
    const storage = energyStorages.find((s) => s.id === modelId) || null
    setSelectedStorage(storage)
  }

  // Obsługa zmiany liczby paneli
  const handlePanelCountChange = (count: number) => {
    if (count < 8) count = 8 // Minimum 8 paneli
    setPanelCount(count)

    // Aktualizacja mocy instalacji
    if (selectedPanel) {
      setTotalPower((selectedPanel.power * count) / 1000)
    }
  }

  // Obsługa zmiany typu marży
  const handleMarginTypeChange = (type: "percentage" | "amount") => {
    form.setValue("marginType", type)

    // Jeśli zmieniono typ marży, przelicz wartość
    if (type === "percentage" && calculation) {
      const percentage = form.getValues("marginPercentage")
      const amount = (calculation.basePrice * percentage) / 100
      form.setValue("marginAmount", Math.round(amount))
    } else if (type === "amount" && calculation) {
      const amount = form.getValues("marginAmount")
      const percentage = (amount / calculation.basePrice) * 100
      form.setValue("marginPercentage", Math.round(percentage * 10) / 10)
    }
  }

  // Obsługa zmiany wartości marży procentowej
  const handleMarginPercentageChange = (value: number) => {
    form.setValue("marginPercentage", value)

    // Przelicz kwotę marży
    if (calculation) {
      const amount = (calculation.basePrice * value) / 100
      form.setValue("marginAmount", Math.round(amount))
    }
  }

  // Obsługa zmiany kwoty marży
  const handleMarginAmountChange = (value: number) => {
    form.setValue("marginAmount", value)

    // Przelicz procent marży
    if (calculation) {
      const percentage = (value / calculation.basePrice) * 100
      form.setValue("marginPercentage", Math.round(percentage * 10) / 10)
    }
  }

  // Funkcja obliczająca cenę
  const calculatePrice = () => {
    if (!selectedPanel || !selectedInverter || !selectedMountingSystem) {
      console.error("Brak wymaganych komponentów do obliczenia ceny")
      return
    }

    // Dodaj debugowanie
    console.log("Dane do obliczeń:", {
      panel: selectedPanel,
      panelCount,
      inverter: selectedInverter,
      optimizer: selectedOptimizer,
      mountingSystem: selectedMountingSystem,
      storage: selectedStorage,
      accessoriesConfig,
      totalPower,
    })

    setIsCalculating(true)

    try {
      // Sprawdź, czy wszystkie wymagane dane są dostępne
      if (!selectedPanel.price || !selectedInverter.price || !selectedMountingSystem.pricePerKw) {
        console.error("Brak wymaganych danych cenowych")
        setIsCalculating(false)
        return
      }

      // Symulacja opóźnienia obliczeń
      setTimeout(() => {
        try {
          const marginType = form.getValues("marginType")
          let marginValue = 0

          if (marginType === "percentage") {
            marginValue = form.getValues("marginPercentage") || 0
          } else {
            // Bezpieczne obliczanie marży kwotowej
            const marginAmount = form.getValues("marginAmount") || 0
            const baseValue =
              selectedPanel.price * panelCount +
              selectedInverter.price +
              selectedMountingSystem.pricePerKw * totalPower +
              (selectedStorage ? selectedStorage.price : 0)

            // Unikaj dzielenia przez zero
            marginValue = baseValue > 0 ? (marginAmount / baseValue) * 100 : 0
          }

          // Upewnij się, że marginValue jest liczbą
          marginValue = isNaN(marginValue) ? 0 : marginValue

          const calculation = CalculatorService.calculatePrice(
            selectedPanel,
            panelCount,
            selectedInverter,
            selectedOptimizer,
            selectedMountingSystem,
            selectedStorage,
            accessoriesConfig,
            marginValue,
          )

          // Sprawdź, czy obliczenia zwróciły poprawne wartości
          if (calculation && !isNaN(calculation.basePrice)) {
            setCalculation(calculation)

            // Aktualizuj wartości marży
            if (marginType === "percentage") {
              form.setValue("marginAmount", Math.round(calculation.marginAmount))
            } else {
              const percentage =
                calculation.basePrice > 0
                  ? Math.round((calculation.marginAmount / calculation.basePrice) * 100 * 10) / 10
                  : 0
              form.setValue("marginPercentage", percentage)
            }
          } else {
            console.error("Obliczenia zwróciły nieprawidłowe wartości", calculation)
            // Ustaw domyślne wartości, aby uniknąć NaN
            setCalculation({
              panelsPrice: 0,
              inverterPrice: 0,
              optimizersPrice: 0,
              mountingPrice: 0,
              storagePrice: 0,
              accessoriesPrice: 0,
              basePrice: 0,
              margin: 0,
              marginAmount: 0,
              finalPrice: 0,
              commission: 0,
            })
          }
        } catch (error) {
          console.error("Błąd podczas obliczania ceny:", error)
          // Ustaw domyślne wartości, aby uniknąć NaN
          setCalculation({
            panelsPrice: 0,
            inverterPrice: 0,
            optimizersPrice: 0,
            mountingPrice: 0,
            storagePrice: 0,
            accessoriesPrice: 0,
            basePrice: 0,
            margin: 0,
            marginAmount: 0,
            finalPrice: 0,
            commission: 0,
          })
        } finally {
          setIsCalculating(false)
        }
      }, 800)
    } catch (error) {
      console.error("Błąd podczas przygotowania do obliczania ceny:", error)
      setIsCalculating(false)
    }
  }

  // Przejście do następnego kroku
  const goToNextStep = () => {
    // Jeśli jesteśmy na kroku komponentów, sprawdź czy wszystkie wymagane komponenty są wybrane
    if (currentStep === 0) {
      if (!selectedPanel || !selectedInverter || !selectedMountingSystem) {
        return
      }

      // Automatycznie oblicz cenę przy przejściu do kroku ceny bazowej
      setIsCalculating(true)
      calculatePrice()
    }

    // Standardowe przejście do następnego kroku
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  // Przejście do poprzedniego kroku
  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  // Przejście do wybranego kroku
  const goToStep = (step: number) => {
    // Jeśli przechodzimy do kroku ceny bazowej, oblicz cenę
    if (step === 1 && currentStep !== 1 && !calculation) {
      calculatePrice()
    }

    setCurrentStep(step)
  }

  // Obsługa zapisu wyceny
  const saveQuote = async (values: z.infer<typeof baseFormSchema>) => {
    if (!calculation || !selectedPanel || !selectedInverter || !selectedMountingSystem) {
      return
    }

    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    try {
      const clientData: ClientData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        street: values.street,
        buildingNumber: values.buildingNumber,
        postalCode: values.postalCode,
        city: values.city,
      }

      const quoteData: QuoteData = {
        clientData,
        selectedPanelId: selectedPanel.id,
        panelCount,
        selectedInverterId: selectedInverter.id,
        selectedOptimizerId: selectedOptimizer?.id,
        selectedMountingType: selectedMountingSystem.type,
        selectedStorageId: selectedStorage?.id,
        calculation,
        status: "active",
      }

      const result = await CalculatorService.saveQuote(quoteData)

      if (result.success) {
        setSaveSuccess(true)
        // Resetowanie formularza po udanym zapisie
        setTimeout(() => {
          form.reset()
          setPanelCount(8)
          setTotalPower(0)
          setCalculation(null)
          setSelectedPanel(null)
          setSelectedInverter(null)
          setSelectedOptimizer(null)
          setSelectedMountingSystem(null)
          setSelectedStorage(null)
          setCurrentStep(0)
          setSaveSuccess(false)
        }, 3000)
      } else {
        setSaveError(result.error || "Wystąpił błąd podczas zapisywania wyceny")
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania wyceny:", error)
      setSaveError("Wystąpił nieoczekiwany błąd podczas zapisywania wyceny")
    } finally {
      setSaving(false)
    }
  }

  // Sugerowanie falownika na podstawie mocy instalacji
  const getSuggestedInverterPower = () => {
    if (totalPower <= 0) return { min: 0, max: 0 }

    // Sugerowana moc falownika: od 0.8 do 1.2 mocy instalacji
    return {
      min: Math.round(totalPower * 0.8 * 10) / 10,
      max: Math.round(totalPower * 1.2 * 10) / 10,
    }
  }

  // Sprawdzenie czy falownik jest sugerowany
  const isInverterSuggested = (inverter: Inverter) => {
    if (totalPower <= 0) return false

    const { min, max } = getSuggestedInverterPower()
    return inverter.power >= min && inverter.power <= max
  }

  // Sprawdzenie czy można przejść do następnego kroku
  const canGoToNextStep = () => {
    switch (currentStep) {
      case 0: // Komponenty
        return !!selectedPanel && !!selectedInverter && !!selectedMountingSystem
      case 1: // Cena bazowa
        return !!calculation
      default:
        return true
    }
  }

  // Renderowanie kroku komponentów
  const renderComponentsStep = () => {
    return (
      <div className="space-y-6">
        {/* 1.1 Panele */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-slate-800">1.1 Panele fotowoltaiczne</CardTitle>
            <CardDescription>Wybierz producenta, model i ilość paneli.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="panelManufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producent paneli</FormLabel>
                    <Select onValueChange={handlePanelManufacturerChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz producenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {panelManufacturers.map((manufacturer) => (
                          <SelectItem key={manufacturer} value={manufacturer}>
                            {manufacturer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="panelModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model paneli</FormLabel>
                    <Select
                      onValueChange={handlePanelModelChange}
                      value={field.value}
                      disabled={!form.getValues("panelManufacturer")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredPanels.map((panel) => (
                          <SelectItem key={panel.id} value={panel.id}>
                            {panel.model} - {panel.power}W
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="panelCount">Liczba paneli (min. 8 szt.)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePanelCountChange(panelCount - 1)}
                    disabled={panelCount <= 8}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="panelCount"
                    type="number"
                    value={panelCount}
                    onChange={(e) => handlePanelCountChange(Number(e.target.value))}
                    min={8}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePanelCountChange(panelCount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Moc instalacji</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input value={totalPower.toFixed(2)} readOnly />
                  <div className="text-sm font-medium">kWp</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1.2 Falownik */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-slate-800">1.2 Falownik</CardTitle>
            <CardDescription>Wybierz typ, producenta i model falownika.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="inverterType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ falownika</FormLabel>
                  <Select onValueChange={handleInverterTypeChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ falownika" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="hybrid">Hybrydowe</SelectItem>
                      <SelectItem value="grid">Sieciowe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inverterManufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producent falownika</FormLabel>
                    <Select
                      onValueChange={handleInverterManufacturerChange}
                      value={field.value}
                      disabled={!form.getValues("inverterType")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz producenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inverterManufacturers.map((manufacturer) => (
                          <SelectItem key={manufacturer} value={manufacturer}>
                            {manufacturer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inverterModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model falownika</FormLabel>
                    <Select
                      onValueChange={handleInverterModelChange}
                      value={field.value}
                      disabled={!form.getValues("inverterManufacturer")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredInverters.map((inverter) => (
                          <SelectItem
                            key={inverter.id}
                            value={inverter.id}
                            className={isInverterSuggested(inverter) ? "bg-green-50 font-medium" : ""}
                          >
                            {inverter.model} - {inverter.power}kW
                            {isInverterSuggested(inverter) && " (Sugerowany)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {totalPower > 0 && (
                      <FormDescription>
                        Sugerowana moc falownika: {getSuggestedInverterPower().min}-{getSuggestedInverterPower().max} kW
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 1.2.1 Optymalizatory mocy */}
        {showOptimizers && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-800">1.2.1 Optymalizatory mocy</CardTitle>
                  <CardDescription>Wybierz model optymalizatorów.</CardDescription>
                </div>
                {optimizersRequired && (
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">Wymagane</div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="optimizerModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model optymalizatora</FormLabel>
                    <Select onValueChange={handleOptimizerModelChange} value={field.value} disabled={!selectedInverter}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredOptimizers
                          .filter((o) => (showHighPowerOptimizers ? true : o.ratio !== "1:2"))
                          .map((optimizer) => (
                            <SelectItem key={optimizer.id} value={optimizer.id}>
                              {optimizer.model} {optimizer.ratio ? `(${optimizer.ratio})` : ""}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* 1.3 System montażowy */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-slate-800">1.3 System montażowy</CardTitle>
            <CardDescription>Wybierz typ montażu.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="mountingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ montażu</FormLabel>
                  <Select onValueChange={handleMountingTypeChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ montażu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mountingSystems.map((system) => (
                        <SelectItem key={system.type} value={system.type}>
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 1.4 Magazyn energii */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-slate-800">1.4 Magazyn energii</CardTitle>
            <CardDescription>Wybierz model magazynu energii.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="storageModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model magazynu energii</FormLabel>
                  <Select
                    onValueChange={handleStorageModelChange}
                    value={field.value}
                    disabled={!selectedInverter || storageDisabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Brak magazynu energii</SelectItem>
                      {filteredStorages.map((storage) => (
                        <SelectItem key={storage.id} value={storage.id}>
                          {storage.manufacturer} {storage.model} - {storage.capacity}kWh
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {storageDisabled && (
                    <FormDescription className="text-amber-600">
                      Magazyn energii nie jest dostępny dla falowników sieciowych.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderowanie kroku ceny bazowej
  const renderPriceStep = () => {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 rounded-t-lg">
          <CardTitle className="text-slate-800">2. Cena bazowa</CardTitle>
          <CardDescription>Ustal cenę i marżę dla instalacji.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-slate-600">Obliczanie ceny bazowej...</p>
            </div>
          ) : !calculation ? (
            <div className="flex justify-center py-8">
              <Button onClick={calculatePrice} disabled={isCalculating} className="bg-blue-600 hover:bg-blue-700">
                <Calculator className="mr-2 h-4 w-4" />
                Oblicz cenę bazową
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-blue-50 p-6 border border-blue-100">
                <div className="text-center">
                  <div className="text-sm text-blue-600 mb-1 font-medium">Cena bazowa netto</div>
                  <div className="text-3xl font-bold text-blue-900">
                    {!isNaN(calculation.basePrice) ? calculation.basePrice.toLocaleString() : "0"} PLN
                  </div>
                  {totalPower > 0 && (
                    <div className="text-sm text-blue-600 mt-1">
                      {!isNaN(calculation.basePrice) && totalPower > 0
                        ? Math.round(calculation.basePrice / totalPower).toLocaleString()
                        : "0"}{" "}
                      PLN/kWp
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="marginType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Typ marży</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => handleMarginTypeChange(value as "percentage" | "amount")}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="percentage" />
                            </FormControl>
                            <FormLabel className="font-normal">Procentowa</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="amount" />
                            </FormControl>
                            <FormLabel className="font-normal">Kwotowa</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("marginType") === "percentage" ? (
                  <FormField
                    control={form.control}
                    name="marginPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marża (%)</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={0}
                              max={50}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => handleMarginPercentageChange(value[0])}
                              className="py-2"
                            />
                            <div className="flex justify-between">
                              <Input
                                type="number"
                                value={field.value}
                                onChange={(e) => handleMarginPercentageChange(Number(e.target.value))}
                                className="w-20"
                              />
                              <span className="text-sm text-gray-500">%</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="marginAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marża (PLN)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={field.value}
                              onChange={(e) => handleMarginAmountChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-gray-500">PLN</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-2 bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Cena bazowa:</span>
                  <span className="font-medium">{calculation.basePrice.toLocaleString()} PLN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    Marża (
                    {form.watch("marginType") === "percentage" ? `${form.watch("marginPercentage")}%` : "kwotowa"}):
                  </span>
                  <span className="font-medium">{form.watch("marginAmount").toLocaleString()} PLN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Prowizja (80% marży):</span>
                  <span className="font-medium">
                    {Math.round(form.watch("marginAmount") * 0.8).toLocaleString()} PLN
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-800">Cena końcowa:</span>
                  <span className="font-bold text-lg text-blue-700">
                    {(calculation.basePrice + form.watch("marginAmount")).toLocaleString()} PLN
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  // Renderowanie kroku danych klienta
  const renderClientStep = () => {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 rounded-t-lg">
          <CardTitle className="text-slate-800">3. Dane klienta</CardTitle>
          <CardDescription>Wprowadź dane klienta, aby zapisać wycenę.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {saveSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Wycena została pomyślnie zapisana i będzie ważna przez 7 dni roboczych.
                </AlertDescription>
              </Alert>
            )}

            {saveError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Imię klienta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder="Nazwisko klienta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="Numer telefonu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Adres email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />
            <h3 className="text-lg font-medium text-slate-800">Adres (opcjonalnie)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ulica</FormLabel>
                    <FormControl>
                      <Input placeholder="Ulica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buildingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numer budynku</FormLabel>
                    <FormControl>
                      <Input placeholder="Numer budynku" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod pocztowy</FormLabel>
                    <FormControl>
                      <Input placeholder="Kod pocztowy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miejscowość</FormLabel>
                    <FormControl>
                      <Input placeholder="Miejscowość" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderowanie aktualnego kroku
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderComponentsStep()
      case 1:
        return renderPriceStep()
      case 2:
        return renderClientStep()
      default:
        return null
    }
  }

  // Renderowanie przycisków nawigacji
  const renderNavigation = () => {
    const isLastStep = currentStep === steps.length - 1
    const isFirstStep = currentStep === 0

    return (
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goToPreviousStep} disabled={isFirstStep} className="border-slate-300">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wstecz
        </Button>

        {isLastStep ? (
          <Button onClick={form.handleSubmit(saveQuote)} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Zapisywanie..." : "Zapisz wycenę"}
          </Button>
        ) : (
          <Button
            onClick={goToNextStep}
            disabled={!canGoToNextStep() || isCalculating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === 0 && isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Obliczanie...
              </>
            ) : (
              <>
                Dalej
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  // Renderowanie podsumowania
  const renderSummary = () => {
    return (
      <Card className="sticky top-6 border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 rounded-t-lg">
          <CardTitle className="text-slate-800">Podsumowanie</CardTitle>
          <CardDescription>Wybrane komponenty i cena instalacji.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-slate-600">Ładowanie danych...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {selectedPanel && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Panele:</span>
                      <span className="font-medium text-slate-800">
                        {selectedPanel.manufacturer} {selectedPanel.model}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Liczba paneli:</span>
                      <span className="font-medium text-slate-800">{panelCount} szt.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Moc instalacji:</span>
                      <span className="font-medium text-slate-800">{totalPower.toFixed(2)} kWp</span>
                    </div>
                  </>
                )}

                {selectedInverter && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Falownik:</span>
                      <span className="font-medium text-slate-800">
                        {selectedInverter.manufacturer} {selectedInverter.model}
                      </span>
                    </div>
                  </>
                )}

                {selectedOptimizer && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Optymalizatory:</span>
                    <span className="font-medium text-slate-800">
                      {selectedOptimizer.manufacturer} {selectedOptimizer.model}
                    </span>
                  </div>
                )}

                {selectedMountingSystem && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">System montażowy:</span>
                      <span className="font-medium text-slate-800">{selectedMountingSystem.name}</span>
                    </div>
                  </>
                )}

                {selectedStorage && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Magazyn energii:</span>
                      <span className="font-medium text-slate-800">
                        {selectedStorage.manufacturer} {selectedStorage.model}
                      </span>
                    </div>
                  </>
                )}

                {calculation && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Cena bazowa:</span>
                      <span className="font-medium text-slate-800">{calculation.basePrice.toLocaleString()} PLN</span>
                    </div>

                    {form.watch("marginType") === "percentage" ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Marża ({form.watch("marginPercentage")}%):</span>
                        <span className="font-medium text-slate-800">
                          {form.watch("marginAmount").toLocaleString()} PLN
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Marża (kwotowa):</span>
                        <span className="font-medium text-slate-800">
                          {form.watch("marginAmount").toLocaleString()} PLN
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Prowizja (80%):</span>
                      <span className="font-medium text-slate-800">
                        {Math.round(form.watch("marginAmount") * 0.8).toLocaleString()} PLN
                      </span>
                    </div>
                  </>
                )}
              </div>

              {calculation && (
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <div className="text-center">
                    <div className="text-sm text-blue-600 mb-1 font-medium">Cena końcowa</div>
                    <div className="text-3xl font-bold text-blue-900">
                      {!isNaN(calculation.basePrice) && !isNaN(form.watch("marginAmount"))
                        ? (calculation.basePrice + form.watch("marginAmount")).toLocaleString()
                        : "0"}{" "}
                      PLN
                    </div>
                    {totalPower > 0 && (
                      <div className="text-sm text-blue-600 mt-1">
                        {!isNaN(calculation.basePrice) && !isNaN(form.watch("marginAmount")) && totalPower > 0
                          ? Math.round(
                              (calculation.basePrice + form.watch("marginAmount")) / totalPower,
                            ).toLocaleString()
                          : "0"}{" "}
                        PLN/kWp
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4 text-slate-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Przejdź przez wszystkie kroki, aby skonfigurować instalację fotowoltaiczną i obliczyć jej cenę.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div className="bg-slate-50 py-6 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/dashboard/konfiguracja" className="text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kreator ceny bazowej</h1>
              </div>
              <p className="text-slate-500">Skonfiguruj i oblicz cenę bazową dla instalacji fotowoltaicznej.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Stepper steps={steps} currentStep={currentStep} onStepClick={goToStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form className="space-y-6">
                {renderCurrentStep()}
                {renderNavigation()}
              </form>
            </Form>
          </div>

          <div>{renderSummary()}</div>
        </div>
      </div>
    </div>
  )
}
