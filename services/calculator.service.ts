import type {
  Panel,
  Inverter,
  Optimizer,
  MountingSystem,
  EnergyStorage,
  AccessoriesConfig,
  PriceCalculation,
  QuoteData,
  InverterType,
} from "@/types/calculator.types"

// Definicja i eksport CalculatorService jako nazwany eksport
export const CalculatorService = {
  getPanels: async (): Promise<Panel[]> => {
    // Prosta implementacja
    return []
  },

  getInverters: async (type?: InverterType): Promise<Inverter[]> => {
    // Prosta implementacja
    return []
  },

  getOptimizers: async (inverterId?: string): Promise<Optimizer[]> => {
    // Prosta implementacja
    return []
  },

  getMountingSystems: async (): Promise<MountingSystem[]> => {
    // Prosta implementacja
    return []
  },

  getEnergyStorages: async (inverterId?: string): Promise<EnergyStorage[]> => {
    // Prosta implementacja
    return []
  },

  getAccessoriesConfig: async (): Promise<AccessoriesConfig> => {
    // Prosta implementacja
    return { ranges: [] }
  },

  saveQuote: async (quoteData: QuoteData): Promise<{ success: boolean; id?: string; error?: string }> => {
    // Prosta implementacja
    return { success: true }
  },

  calculateAccessoriesPrice: (power: number, config: AccessoriesConfig): number => {
    // Prosta implementacja
    return 0
  },

  calculatePrice: (
    panel: Panel,
    panelCount: number,
    inverter: Inverter,
    optimizer: Optimizer | null,
    mountingSystem: MountingSystem,
    storage: EnergyStorage | null,
    accessoriesConfig: AccessoriesConfig,
    margin = 0,
  ): PriceCalculation => {
    // Prosta implementacja
    return {
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
    }
  },
}

// Eksport domyślny dla kompatybilności
export default CalculatorService
