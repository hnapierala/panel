// Importy typów
import type {
  Panel,
  Inverter,
  Optimizer,
  MountingSystem,
  EnergyStorage,
  AccessoriesConfig,
  PriceCalculation,
  QuoteData,
} from "@/types/calculator.types"

// Funkcje pomocnicze
function getPanels() {
  // Symulacja pobierania danych z API
  return Promise.resolve([
    { id: "1", manufacturer: "JA Solar", model: "JAM60S20", power: 380, price: 650 },
    { id: "2", manufacturer: "JA Solar", model: "JAM72S30", power: 535, price: 850 },
    { id: "3", manufacturer: "Longi Solar", model: "LR4-60HPB", power: 360, price: 620 },
    { id: "4", manufacturer: "Longi Solar", model: "LR4-72HPH", power: 540, price: 870 },
    { id: "5", manufacturer: "Jinko Solar", model: "JKM395M", power: 395, price: 680 },
    { id: "6", manufacturer: "Jinko Solar", model: "JKM530M", power: 530, price: 840 },
  ])
}

function getInverters() {
  // Symulacja pobierania danych z API
  return Promise.resolve([
    { id: "1", manufacturer: "SolarEdge", model: "SE5K", power: 5, type: ["grid"], price: 7500 },
    { id: "2", manufacturer: "SolarEdge", model: "SE8K", power: 8, type: ["grid"], price: 9000 },
    { id: "3", manufacturer: "SolarEdge", model: "SE10K", power: 10, type: ["grid"], price: 11000 },
    { id: "4", manufacturer: "Fronius", model: "Primo 5.0", power: 5, type: ["grid"], price: 7200 },
    { id: "5", manufacturer: "Fronius", model: "Primo 8.2", power: 8.2, type: ["grid"], price: 8800 },
    { id: "6", manufacturer: "Huawei", model: "SUN2000-5KTL", power: 5, type: ["grid"], price: 6800 },
    { id: "7", manufacturer: "Huawei", model: "SUN2000-10KTL", power: 10, type: ["grid"], price: 10500 },
    { id: "8", manufacturer: "Sungrow", model: "SH5.0RT", power: 5, type: ["hybrid"], price: 9500 },
    { id: "9", manufacturer: "Sungrow", model: "SH10RT", power: 10, type: ["hybrid"], price: 13000 },
  ])
}

function getOptimizers(inverterId?: string) {
  // Symulacja pobierania danych z API
  const optimizers = [
    {
      id: "1",
      manufacturer: "SolarEdge",
      model: "P370",
      ratio: "1:1",
      price: 250,
      compatibleInverters: ["1", "2", "3"],
    },
    {
      id: "2",
      manufacturer: "SolarEdge",
      model: "P401",
      ratio: "1:1",
      price: 280,
      compatibleInverters: ["1", "2", "3"],
    },
    { id: "3", manufacturer: "SolarEdge", model: "P500", ratio: "1:2", price: 350, compatibleInverters: ["2", "3"] },
    {
      id: "4",
      manufacturer: "Huawei",
      model: "SUN2000-450W",
      ratio: "1:1",
      price: 220,
      compatibleInverters: ["6", "7"],
    },
  ]

  if (inverterId) {
    return Promise.resolve(optimizers.filter((o) => o.compatibleInverters.includes(inverterId)))
  }

  return Promise.resolve(optimizers)
}

function getMountingSystems() {
  // Symulacja pobierania danych z API
  return Promise.resolve([
    { id: "1", type: "roof_tile", name: "Dach skośny - dachówka", pricePerKw: 1200 },
    { id: "2", type: "roof_sheet", name: "Dach skośny - blacha", pricePerKw: 1100 },
    { id: "3", type: "roof_flat", name: "Dach płaski", pricePerKw: 1300 },
    { id: "4", type: "ground", name: "Grunt", pricePerKw: 1500 },
  ])
}

function getEnergyStorages(inverterId?: string) {
  // Symulacja pobierania danych z API
  const storages = [
    { id: "1", manufacturer: "Sungrow", model: "SBR096", capacity: 9.6, price: 25000, compatibleInverters: ["8", "9"] },
    {
      id: "2",
      manufacturer: "Sungrow",
      model: "SBR128",
      capacity: 12.8,
      price: 32000,
      compatibleInverters: ["8", "9"],
    },
    {
      id: "3",
      manufacturer: "Huawei",
      model: "LUNA2000-10",
      capacity: 10,
      price: 28000,
      compatibleInverters: ["6", "7"],
    },
    {
      id: "4",
      manufacturer: "Huawei",
      model: "LUNA2000-15",
      capacity: 15,
      price: 38000,
      compatibleInverters: ["6", "7"],
    },
  ]

  if (inverterId) {
    return Promise.resolve(storages.filter((s) => s.compatibleInverters.includes(inverterId)))
  }

  return Promise.resolve(storages)
}

function getAccessoriesConfig() {
  // Symulacja pobierania danych z API
  return Promise.resolve({
    ranges: [
      { minPower: 0, maxPower: 5, price: 2500 },
      { minPower: 5.01, maxPower: 10, price: 3500 },
      { minPower: 10.01, maxPower: 20, price: 5000 },
      { minPower: 20.01, maxPower: 50, price: 8000 },
    ],
  })
}

function calculatePrice(
  panel: Panel,
  panelCount: number,
  inverter: Inverter,
  optimizer: Optimizer | null,
  mountingSystem: MountingSystem,
  storage: EnergyStorage | null,
  accessoriesConfig: AccessoriesConfig,
  marginPercentage: number,
): PriceCalculation {
  // Obliczanie ceny paneli
  const panelsPrice = panel.price * panelCount

  // Obliczanie ceny falownika
  const inverterPrice = inverter.price

  // Obliczanie ceny optymalizatorów
  const optimizersPrice = optimizer ? optimizer.price * panelCount : 0

  // Obliczanie ceny systemu montażowego
  const totalPower = (panel.power * panelCount) / 1000 // kWp
  const mountingPrice = mountingSystem.pricePerKw * totalPower

  // Obliczanie ceny magazynu energii
  const storagePrice = storage ? storage.price : 0

  // Obliczanie ceny akcesoriów
  let accessoriesPrice = 0
  for (const range of accessoriesConfig.ranges) {
    if (totalPower >= range.minPower && totalPower <= range.maxPower) {
      accessoriesPrice = range.price
      break
    }
  }

  // Obliczanie ceny bazowej
  const basePrice = panelsPrice + inverterPrice + optimizersPrice + mountingPrice + storagePrice + accessoriesPrice

  // Obliczanie marży
  const marginAmount = (basePrice * marginPercentage) / 100

  // Obliczanie ceny końcowej
  const finalPrice = basePrice + marginAmount

  // Obliczanie prowizji (80% marży)
  const commission = marginAmount * 0.8

  return {
    panelsPrice,
    inverterPrice,
    optimizersPrice,
    mountingPrice,
    storagePrice,
    accessoriesPrice,
    basePrice,
    margin: marginPercentage,
    marginAmount,
    finalPrice,
    commission,
  }
}

function saveQuote(quoteData: QuoteData) {
  // Symulacja zapisywania danych w API
  console.log("Zapisywanie wyceny:", quoteData)
  return Promise.resolve({ success: true })
}

// Eksport nazwanego obiektu CalculatorService
export const CalculatorService = {
  getPanels,
  getInverters,
  getOptimizers,
  getMountingSystems,
  getEnergyStorages,
  getAccessoriesConfig,
  calculatePrice,
  saveQuote,
}

// Eksport domyślny dla kompatybilności
export default CalculatorService
