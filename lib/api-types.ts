// Typy danych dla API
export interface SolarPanel {
  id: string
  name: string
  power: number
  price: number
  efficiency: number
  warranty: number
  dimensions: string
  weight: number
  manufacturer: string
  type: string
  created_at?: string
  updated_at?: string
}

export interface Inverter {
  id: string
  name: string
  power: number
  price: number
  efficiency: number
  warranty: number
  phases: number
  manufacturer: string
  created_at?: string
  updated_at?: string
}

export interface Construction {
  id: string
  name: string
  price: number
  type: string
  created_at?: string
  updated_at?: string
}

export interface Accessory {
  id: string
  name: string
  price: number
  category: string
  created_at?: string
  updated_at?: string
}

export interface Labor {
  id: string
  name: string
  price: number
  category: string
  created_at?: string
  updated_at?: string
}

export interface Rate {
  id: string
  name: string
  value: number
  type: string
  created_at?: string
  updated_at?: string
}

export interface Price {
  id: string
  name: string
  value: number
  unit: string
  created_at?: string
  updated_at?: string
}

// Domyślne dane
export const DEFAULT_DATA = {
  panels: [
    {
      name: "Panel Longi LR4-72HPH-455M",
      power: 455,
      price: 650,
      efficiency: 20.9,
      warranty: 25,
      dimensions: "2094x1038x35",
      weight: 24.5,
      manufacturer: "Longi Solar",
      type: "Monokrystaliczny",
    },
    {
      name: "Panel JA Solar JAM60S20-380/MR",
      power: 380,
      price: 550,
      efficiency: 20.2,
      warranty: 25,
      dimensions: "1776x1052x35",
      weight: 20.2,
      manufacturer: "JA Solar",
      type: "Monokrystaliczny",
    },
    {
      name: "Panel Jinko Solar JKM410M-54HL4-V",
      power: 410,
      price: 600,
      efficiency: 20.4,
      warranty: 25,
      dimensions: "1724x1134x30",
      weight: 22.5,
      manufacturer: "Jinko Solar",
      type: "Monokrystaliczny",
    },
    {
      name: "Skichała Trina",
      power: 400,
      price: 580,
      efficiency: 20.1,
      warranty: 25,
      dimensions: "1700x1000x35",
      weight: 21.0,
      manufacturer: "Trina Solar",
      type: "Monokrystaliczny",
    },
  ],
  inverters: [
    {
      name: "Falownik Fronius Symo 8.2-3-M",
      power: 8.2,
      price: 9500,
      efficiency: 98.1,
      warranty: 5,
      phases: 3,
      manufacturer: "Fronius",
    },
    {
      name: "Falownik SolarEdge SE5K-RWS",
      power: 5,
      price: 7200,
      efficiency: 97.6,
      warranty: 12,
      phases: 3,
      manufacturer: "SolarEdge",
    },
    {
      name: "Falownik Huawei SUN2000-10KTL-M1",
      power: 10,
      price: 8900,
      efficiency: 98.6,
      warranty: 10,
      phases: 3,
      manufacturer: "Huawei",
    },
  ],
  constructions: [
    {
      name: "Konstrukcja dachowa skośna",
      price: 250,
      type: "Dach skośny",
    },
    {
      name: "Konstrukcja dachowa płaska",
      price: 300,
      type: "Dach płaski",
    },
    {
      name: "Konstrukcja gruntowa",
      price: 350,
      type: "Grunt",
    },
  ],
  accessories: [
    {
      name: "Optymalizator mocy SolarEdge P370",
      price: 350,
      category: "Optymalizatory",
    },
    {
      name: "Zabezpieczenie AC",
      price: 250,
      category: "Zabezpieczenia",
    },
    {
      name: "Zabezpieczenie DC",
      price: 200,
      category: "Zabezpieczenia",
    },
    {
      name: "Kabel solarny 4mm2 (1m)",
      price: 5,
      category: "Okablowanie",
    },
  ],
  labor: [
    {
      name: "Montaż instalacji do 10kW",
      price: 1500,
      category: "Montaż",
    },
    {
      name: "Montaż instalacji powyżej 10kW",
      price: 2500,
      category: "Montaż",
    },
    {
      name: "Projekt instalacji",
      price: 1000,
      category: "Dokumentacja",
    },
    {
      name: "Zgłoszenie do zakładu energetycznego",
      price: 500,
      category: "Dokumentacja",
    },
  ],
  rates: [
    {
      name: "Stawka VAT dla osób fizycznych",
      value: 8,
      type: "percentage",
    },
    {
      name: "Stawka VAT dla firm",
      value: 23,
      type: "percentage",
    },
    {
      name: "Marża standardowa",
      value: 15,
      type: "percentage",
    },
  ],
  prices: [
    {
      name: "Cena energii",
      value: 0.75,
      unit: "zł/kWh",
    },
    {
      name: "Opłata dystrybucyjna",
      value: 0.25,
      unit: "zł/kWh",
    },
  ],
}
