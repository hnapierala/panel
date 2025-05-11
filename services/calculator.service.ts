import { getSupabaseClient } from "@/lib/supabase"
import type {
  Panel,
  Inverter,
  Optimizer,
  MountingSystem,
  EnergyStorage,
  AccessoriesConfig,
  QuoteData,
  PriceCalculation,
  InverterType,
} from "@/types/calculator.types"

// Najprostszy możliwy sposób eksportu - funkcje jako stałe
export const CalculatorService = {
  // Pobieranie paneli
  getPanels: async (): Promise<Panel[]> => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("panels").select("*")

    if (error) {
      console.error("Błąd podczas pobierania paneli:", error)
      return []
    }

    return data as unknown as Panel[]
  },

  // Pobieranie falowników
  getInverters: async (type?: InverterType): Promise<Inverter[]> => {
    const supabase = getSupabaseClient()
    let query = supabase.from("inverters").select("*")

    if (type && type !== "all") {
      query = query.contains("type", [type])
    }

    const { data, error } = await query

    if (error) {
      console.error("Błąd podczas pobierania falowników:", error)
      return []
    }

    return data as unknown as Inverter[]
  },

  // Pobieranie optymalizatorów
  getOptimizers: async (inverterId?: string): Promise<Optimizer[]> => {
    const supabase = getSupabaseClient()
    let query = supabase.from("optimizers").select("*")

    if (inverterId) {
      query = query.contains("compatible_inverters", [inverterId])
    }

    const { data, error } = await query

    if (error) {
      console.error("Błąd podczas pobierania optymalizatorów:", error)
      return []
    }

    return data.map((optimizer) => ({
      id: optimizer.id,
      manufacturer: optimizer.manufacturer,
      model: optimizer.model,
      price: optimizer.price,
      compatibleInverters: optimizer.compatible_inverters,
      ratio: optimizer.ratio,
    })) as unknown as Optimizer[]
  },

  // Pobieranie systemów montażowych
  getMountingSystems: async (): Promise<MountingSystem[]> => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("mounting_systems").select("*")

    if (error) {
      console.error("Błąd podczas pobierania systemów montażowych:", error)
      return []
    }

    return data as unknown as MountingSystem[]
  },

  // Pobieranie magazynów energii
  getEnergyStorages: async (inverterId?: string): Promise<EnergyStorage[]> => {
    const supabase = getSupabaseClient()
    let query = supabase.from("energy_storages").select("*")

    if (inverterId) {
      query = query.contains("compatible_inverters", [inverterId])
    }

    const { data, error } = await query

    if (error) {
      console.error("Błąd podczas pobierania magazynów energii:", error)
      return []
    }

    return data.map((storage) => ({
      id: storage.id,
      manufacturer: storage.manufacturer,
      model: storage.model,
      capacity: storage.capacity,
      price: storage.price,
      compatibleInverters: storage.compatible_inverters,
    })) as unknown as EnergyStorage[]
  },

  // Pobieranie konfiguracji akcesoriów
  getAccessoriesConfig: async (): Promise<AccessoriesConfig> => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("accessories_config").select("*").single()

    if (error) {
      console.error("Błąd podczas pobierania konfiguracji akcesoriów:", error)
      return { ranges: [] }
    }

    return data as unknown as AccessoriesConfig
  },

  // Zapisywanie wyceny
  saveQuote: async (quoteData: QuoteData): Promise<{ success: boolean; id?: string; error?: string }> => {
    const supabase = getSupabaseClient()

    // Obliczanie daty wygaśnięcia (7 dni roboczych)
    const expiresAt = new Date()
    let businessDays = 7
    while (businessDays > 0) {
      expiresAt.setDate(expiresAt.getDate() + 1)
      if (expiresAt.getDay() !== 0 && expiresAt.getDay() !== 6) {
        businessDays--
      }
    }

    const quoteToSave = {
      ...quoteData,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      status: "active",
    }

    const { data, error } = await supabase.from("quotes").insert(quoteToSave).select("id").single()

    if (error) {
      console.error("Błąd podczas zapisywania wyceny:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  },

  // Obliczanie ceny akcesoriów na podstawie mocy instalacji
  calculateAccessoriesPrice: (power: number, config: AccessoriesConfig): number => {
    for (const range of config.ranges) {
      if (power >= range.minPower && power <= range.maxPower) {
        return range.price
      }
    }
    // Jeśli nie znaleziono zakresu, zwracamy cenę dla ostatniego zakresu
    if (config.ranges.length > 0) {
      return config.ranges[config.ranges.length - 1].price
    }
    return 0
  },

  // Obliczanie ceny całkowitej
  calculatePrice: function (
    panel: Panel,
    panelCount: number,
    inverter: Inverter,
    optimizer: Optimizer | null,
    mountingSystem: MountingSystem,
    storage: EnergyStorage | null,
    accessoriesConfig: AccessoriesConfig,
    margin = 0,
    commissionRate = 0.8, // 80% z marży
  ): PriceCalculation {
    // Upewnij się, że wszystkie wartości są liczbami
    const power = (panel.power * panelCount) / 1000 // kW

    // Zabezpieczenie przed NaN i undefined
    const panelsPrice = panel.price ? panel.price * panelCount : 0
    const inverterPrice = inverter.price || 0
    const optimizersPrice = optimizer && optimizer.price ? optimizer.price * panelCount : 0
    const mountingPrice = mountingSystem.pricePerKw ? mountingSystem.pricePerKw * power : 0
    const storagePrice = storage && storage.price ? storage.price : 0

    // Zabezpieczenie przed undefined w konfiguracji akcesoriów
    let accessoriesPrice = 0
    if (accessoriesConfig && accessoriesConfig.ranges && accessoriesConfig.ranges.length > 0) {
      accessoriesPrice = this.calculateAccessoriesPrice(power, accessoriesConfig)
    }

    const basePrice = panelsPrice + inverterPrice + optimizersPrice + mountingPrice + storagePrice + accessoriesPrice

    // Zabezpieczenie przed NaN w obliczeniach marży
    const safeMargin = isNaN(margin) ? 0 : margin
    const marginAmount = basePrice * (safeMargin / 100)
    const finalPrice = basePrice + marginAmount
    const commission = marginAmount * commissionRate

    // Zwróć obiekt z zaokrąglonymi wartościami, aby uniknąć problemów z wyświetlaniem
    return {
      panelsPrice: Math.round(panelsPrice),
      inverterPrice: Math.round(inverterPrice),
      optimizersPrice: Math.round(optimizersPrice),
      mountingPrice: Math.round(mountingPrice),
      storagePrice: Math.round(storagePrice),
      accessoriesPrice: Math.round(accessoriesPrice),
      basePrice: Math.round(basePrice),
      margin: safeMargin,
      marginAmount: Math.round(marginAmount),
      finalPrice: Math.round(finalPrice),
      commission: Math.round(commission),
    }
  },
}

// Importujemy CalculatorService z istniejącego pliku calculator-service.ts
// import { CalculatorService as CalculatorServiceImpl } from "./calculator-service";

// Eksportujemy CalculatorService jako nazwany eksport
// export const CalculatorService = CalculatorServiceImpl;

// Eksport domyślny dla kompatybilności
export default CalculatorService
