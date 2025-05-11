export type InverterType = "all" | "hybrid" | "grid"
export type MountingType = "metal_tile" | "trapezoidal" | "tile" | "ground" | "flat_roof"

export interface Panel {
  id: string
  manufacturer: string
  model: string
  power: number // W
  price: number // PLN
}

export interface Inverter {
  id: string
  manufacturer: string
  model: string
  power: number // kW
  price: number // PLN
  type: InverterType | InverterType[]
  requiresOptimizers: boolean
  compatibleStorages?: string[] // IDs of compatible energy storage systems
}

export interface Optimizer {
  id: string
  manufacturer: string
  model: string
  price: number // PLN
  compatibleInverters: string[] // IDs of compatible inverters
  ratio?: "1:1" | "1:2" // 1:1 is standard, 1:2 for high power
}

export interface MountingSystem {
  id: string
  type: MountingType
  name: string
  pricePerKw: number // PLN per kW
}

export interface EnergyStorage {
  id: string
  manufacturer: string
  model: string
  capacity: number // kWh
  price: number // PLN
  compatibleInverters: string[] // IDs of compatible inverters
}

export interface AccessoriesConfig {
  ranges: {
    minPower: number // kW
    maxPower: number // kW
    price: number // PLN
  }[]
}

export interface PriceCalculation {
  panelsPrice: number
  inverterPrice: number
  optimizersPrice: number
  mountingPrice: number
  storagePrice: number
  accessoriesPrice: number
  basePrice: number
  margin: number
  marginAmount: number
  finalPrice: number
  commission: number
}

export interface ClientData {
  firstName: string
  lastName: string
  phone: string
  email: string
  street?: string
  buildingNumber?: string
  postalCode?: string
  city?: string
}

export interface QuoteData {
  id?: string
  clientData: ClientData
  selectedPanelId: string
  panelCount: number
  selectedInverterId: string
  selectedOptimizerId?: string
  selectedMountingType: MountingType
  selectedStorageId?: string
  calculation: PriceCalculation
  createdAt?: string
  expiresAt?: string // 7 business days from creation
  status: "draft" | "active" | "expired" | "converted"
}
