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
import { ArrowLeft, ArrowRight, Calculator, Save, Plus, Minus, AlertCircle, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Importujemy CalculatorService z nowego pliku
import { CalculatorService } from "@/services/calculator-service"
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

// Schemat walidacji formularza pozostaje bez zmian
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
  // Stan komponentu pozostaje bez zmian
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

  // Wszystkie funkcje obsługi zdarzeń pozostają bez zmian
  const handlePanelManufacturerChange = (manufacturer: string) => {
    form.setValue("panelManufacturer", manufacturer)
    form.setValue("panelModel", "")
    setSelectedPanel(null)

    // Filtrowanie paneli według wybranego producenta
    const filtered = panels.filter((panel) => panel.manufacturer === manufacturer)
    setFilteredPanels(filtered)
  }

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

  const handleOptimizerModelChange = (modelId: string) => {
    form.setValue("optimizerModel", modelId)

    // Znalezienie wybranego optymalizatora
    const optimizer = optimizers.find((o) => o.id === modelId) || null
    setSelectedOptimizer(optimizer)
  }

  const handleMountingTypeChange = (type: string) => {
    form.setValue("mountingType", type)

    // Znalezienie wybranego systemu montażowego
    const mountingType = type as MountingType
    const mountingSystem = mountingSystems.find((m) => m.type === mountingType) || null
    setSelectedMountingSystem(mountingSystem)
  }

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

  const handlePanelCountChange = (count: number) => {
    if (count < 8) count = 8 // Minimum 8 paneli
    setPanelCount(count)

    // Aktualizacja mocy instalacji
    if (selectedPanel) {
      setTotalPower((selectedPanel.power * count) / 1000)
    }
  }

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

  const handleMarginPercentageChange = (value: number) => {
    form.setValue("marginPercentage", value)

    // Przelicz kwotę marży
    if (calculation) {
      const amount = (calculation.basePrice * value) / 100
      form.setValue("marginAmount", Math.round(amount))
    }
  }

  const handleMarginAmountChange = (value: number) => {
    form.setValue("marginAmount", value)

    // Przelicz procent marży
    if (calculation) {
      const percentage = (value / calculation.basePrice) * 100
      form.setValue("marginPercentage", Math.round(percentage * 10) / 10)
    }
  }

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

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const goToStep = (step: number) => {
    // Jeśli przechodzimy do kroku ceny bazowej, oblicz cenę
    if (step === 1 && currentStep !== 1 && !calculation) {
      calculatePrice()
    }

    setCurrentStep(step)
  }

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

  const getSuggestedInverterPower = () => {
    if (totalPower <= 0) return { min: 0, max: 0 }

    // Sugerowana moc falownika: od 0.8 do 1.2 mocy instalacji
    return {
      min: Math.round(totalPower * 0.8 * 10) / 10,
      max: Math.round(totalPower * 1.2 * 10) / 10,
    }
  }

  const isInverterSuggested = (inverter: Inverter) => {
    if (totalPower <= 0) return false

    const { min, max } = getSuggestedInverterPower()
    return inverter.power >= min && inverter.power <= max
  }

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
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-white border-b border-neutral-100 px-6">
            <CardTitle className="text-lg font-medium text-neutral-900">1.1 Panele fotowoltaiczne</CardTitle>
            <CardDescription className="text-neutral-500">Wybierz producenta, model i ilość paneli.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="panelManufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Producent paneli</FormLabel>
                    <Select onValueChange={handlePanelManufacturerChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
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
                    <FormLabel className="text-neutral-700 font-medium">Model paneli</FormLabel>
                    <Select
                      onValueChange={handlePanelModelChange}
                      value={field.value}
                      disabled={!form.getValues("panelManufacturer")}
                    >
                      <FormControl>
                        <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="panelCount" className="text-neutral-700 font-medium">
                  Liczba paneli (min. 8 szt.)
                </Label>
                <div className="flex items-center gap-1 sm:gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePanelCountChange(panelCount - 1)}
                    disabled={panelCount <= 8}
                    className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Input
                    id="panelCount"
                    type="number"
                    value={panelCount}
                    onChange={(e) => handlePanelCountChange(Number(e.target.value))}
                    min={8}
                    className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-9 sm:h-10 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePanelCountChange(panelCount + 1)}
                    className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-neutral-700 font-medium">Moc instalacji</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={totalPower.toFixed(2)}
                    readOnly
                    className="border-neutral-200 bg-neutral-50 text-neutral-900 font-medium h-10"
                  />
                  <div className="text-sm font-medium text-neutral-700 w-12">kWp</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1.2 Falownik */}
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-white border-b border-neutral-100 px-6">
            <CardTitle className="text-lg font-medium text-neutral-900">1.2 Falownik</CardTitle>
            <CardDescription className="text-neutral-500">Wybierz typ, producenta i model falownika.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="inverterType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700 font-medium">Typ falownika</FormLabel>
                  <Select onValueChange={handleInverterTypeChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="inverterManufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Producent falownika</FormLabel>
                    <Select
                      onValueChange={handleInverterManufacturerChange}
                      value={field.value}
                      disabled={!form.getValues("inverterType")}
                    >
                      <FormControl>
                        <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
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
                    <FormLabel className="text-neutral-700 font-medium">Model falownika</FormLabel>
                    <Select
                      onValueChange={handleInverterModelChange}
                      value={field.value}
                      disabled={!form.getValues("inverterManufacturer")}
                    >
                      <FormControl>
                        <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
                          <SelectValue placeholder="Wybierz model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredInverters.map((inverter) => (
                          <SelectItem
                            key={inverter.id}
                            value={inverter.id}
                            className={isInverterSuggested(inverter) ? "bg-[#1E8A3C]/10 font-medium" : ""}
                          >
                            {inverter.model} - {inverter.power}kW
                            {isInverterSuggested(inverter) && " (Sugerowany)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {totalPower > 0 && (
                      <FormDescription className="text-[#E5B80B]">
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
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-white border-b border-neutral-100 px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-neutral-900">1.2.1 Optymalizatory mocy</CardTitle>
                  <CardDescription className="text-neutral-500">Wybierz model optymalizatorów.</CardDescription>
                </div>
                {optimizersRequired && (
                  <div className="bg-[#1E8A3C]/10 text-[#1E8A3C] px-3 py-1 rounded-full text-xs font-medium">
                    Wymagane
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="optimizerModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Model optymalizatora</FormLabel>
                    <Select onValueChange={handleOptimizerModelChange} value={field.value} disabled={!selectedInverter}>
                      <FormControl>
                        <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
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
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-white border-b border-neutral-100 px-6">
            <CardTitle className="text-lg font-medium text-neutral-900">1.3 System montażowy</CardTitle>
            <CardDescription className="text-neutral-500">Wybierz typ montażu.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="mountingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700 font-medium">Typ montażu</FormLabel>
                  <Select onValueChange={handleMountingTypeChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
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
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-white border-b border-neutral-100 px-6">
            <CardTitle className="text-lg font-medium text-neutral-900">1.4 Magazyn energii</CardTitle>
            <CardDescription className="text-neutral-500">Wybierz model magazynu energii.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="storageModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700 font-medium">Model magazynu energii</FormLabel>
                  <Select
                    onValueChange={handleStorageModelChange}
                    value={field.value}
                    disabled={!selectedInverter || storageDisabled}
                  >
                    <FormControl>
                      <SelectTrigger className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10">
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
                    <FormDescription className="text-[#E5B80B]">
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
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-neutral-100 px-6">
          <CardTitle className="text-lg font-medium text-neutral-900">2. Cena bazowa</CardTitle>
          <CardDescription className="text-neutral-500">Ustal cenę i marżę dla instalacji.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1E8A3C] mb-4" />
              <p className="text-neutral-600">Obliczanie ceny bazowej...</p>
            </div>
          ) : !calculation ? (
            <div className="flex justify-center py-8">
              <Button
                onClick={calculatePrice}
                disabled={isCalculating}
                className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90 text-white"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Oblicz cenę bazową
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-[#1E8A3C]/5 p-6 border border-[#1E8A3C]/10">
                <div className="text-center">
                  <div className="text-sm text-[#1E8A3C] mb-1 font-medium">Cena bazowa netto</div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {!isNaN(calculation.basePrice) ? calculation.basePrice.toLocaleString() : "0"} PLN
                  </div>
                  {totalPower > 0 && (
                    <div className="text-sm text-[#1E8A3C] mt-1">
                      {!isNaN(calculation.basePrice) && totalPower > 0
                        ? Math.round(calculation.basePrice / totalPower).toLocaleString()
                        : "0"}{" "}
                      PLN/kWp
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6 bg-neutral-100" />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="marginType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-neutral-700 font-medium">Typ marży</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => handleMarginTypeChange(value as "percentage" | "amount")}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="percentage" className="text-[#1E8A3C]" />
                            </FormControl>
                            <FormLabel className="font-normal text-neutral-700">Procentowa</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="amount" className="text-[#1E8A3C]" />
                            </FormControl>
                            <FormLabel className="font-normal text-neutral-700">Kwotowa</FormLabel>
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
                        <FormLabel className="text-neutral-700 font-medium">Marża (%)</FormLabel>
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
                                className="w-20 border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                              />
                              <span className="text-sm text-neutral-500">%</span>
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
                        <FormLabel className="text-neutral-700 font-medium">Marża (PLN)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={field.value}
                              onChange={(e) => handleMarginAmountChange(Number(e.target.value))}
                              className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                            />
                            <span className="text-sm text-neutral-500">PLN</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Separator className="my-6 bg-neutral-100" />

              <div className="space-y-2 bg-neutral-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Cena bazowa:</span>
                  <span className="font-medium text-neutral-900">{calculation.basePrice.toLocaleString()} PLN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Marża (
                    {form.watch("marginType") === "percentage" ? `${form.watch("marginPercentage")}%` : "kwotowa"}):
                  </span>
                  <span className="font-medium text-neutral-900">
                    {form.watch("marginAmount").toLocaleString()} PLN
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Prowizja (80% marży):</span>
                  <span className="font-medium text-neutral-900">
                    {Math.round(form.watch("marginAmount") * 0.8).toLocaleString()} PLN
                  </span>
                </div>
                <Separator className="my-3 bg-neutral-200" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-800">Cena końcowa:</span>
                  <span className="font-bold text-lg text-[#1E8A3C]">
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
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-neutral-100 px-6">
          <CardTitle className="text-lg font-medium text-neutral-900">3. Dane klienta</CardTitle>
          <CardDescription className="text-neutral-500">Wprowadź dane klienta, aby zapisać wycenę.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {saveSuccess && (
              <Alert className="bg-green-50 border-green-100 text-green-800">
                <AlertDescription>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Imię</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Imię klienta"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
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
                    <FormLabel className="text-neutral-700 font-medium">Nazwisko</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nazwisko klienta"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Numer telefonu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numer telefonu"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
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
                    <FormLabel className="text-neutral-700 font-medium">Adres email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Adres email"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Ulica</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ulica"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
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
                    <FormLabel className="text-neutral-700 font-medium">Numer budynku</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numer budynku"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 font-medium">Kod pocztowy</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kod pocztowy"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
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
                    <FormLabel className="text-neutral-700 font-medium">Miejscowość</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Miejscowość"
                        {...field}
                        className="border-neutral-200 focus:ring-[#1E8A3C] focus:border-[#1E8A3C] h-10"
                      />
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

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Kalkulator wyceny</h1>
        <p className="text-neutral-500">Wybierz komponenty, ustal cenę i zapisz wycenę dla klienta.</p>
      </div>

      <Stepper steps={steps} currentStep={currentStep} onStepClick={goToStep} />

      <Form {...form}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#1E8A3C] mb-4" />
            <p className="text-neutral-600">Pobieranie danych...</p>
          </div>
        ) : (
          <>
            {currentStep === 0 && renderComponentsStep()}
            {currentStep === 1 && renderPriceStep()}
            {currentStep === 2 && renderClientStep()}

            <Card className="border-none shadow-sm mt-8">
              <CardFooter className="flex justify-between items-center p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0}
                  className="border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Wstecz
                </Button>
                {currentStep === steps.length - 1 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild disabled={saving || !form.formState.isValid}>
                        <Button
                          type="button"
                          onClick={form.handleSubmit(saveQuote)}
                          disabled={saving || !form.formState.isValid}
                          className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90 text-white"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Zapisywanie...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Zapisz wycenę
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Wypełnij wszystkie pola formularza, aby zapisać wycenę.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!canGoToNextStep()}
                    className="bg-[#1E8A3C] hover:bg-[#1E8A3C]/90 text-white"
                  >
                    Dalej
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </>
        )}
      </Form>
    </div>
  )
}
