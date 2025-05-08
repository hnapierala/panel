/**
 * Moduł do zarządzania przechowywaniem danych w plikach JSON na serwerze
 */

// Typy danych
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
  PANELS: [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
  ],
  INVERTERS: [
    {
      id: "1",
      name: "Falownik Fronius Symo 8.2-3-M",
      power: 8.2,
      price: 9500,
      efficiency: 98.1,
      warranty: 5,
      phases: 3,
      manufacturer: "Fronius",
    },
    {
      id: "2",
      name: "Falownik SolarEdge SE5K-RWS",
      power: 5,
      price: 7200,
      efficiency: 97.6,
      warranty: 12,
      phases: 3,
      manufacturer: "SolarEdge",
    },
    {
      id: "3",
      name: "Falownik Huawei SUN2000-10KTL-M1",
      power: 10,
      price: 8900,
      efficiency: 98.6,
      warranty: 10,
      phases: 3,
      manufacturer: "Huawei",
    },
  ],
  CONSTRUCTIONS: [
    {
      id: "1",
      name: "Konstrukcja dachowa skośna",
      price: 250,
      type: "Dach skośny",
    },
    {
      id: "2",
      name: "Konstrukcja dachowa płaska",
      price: 300,
      type: "Dach płaski",
    },
    {
      id: "3",
      name: "Konstrukcja gruntowa",
      price: 350,
      type: "Grunt",
    },
  ],
  ACCESSORIES: [
    {
      id: "1",
      name: "Optymalizator mocy SolarEdge P370",
      price: 350,
      category: "Optymalizatory",
    },
    {
      id: "2",
      name: "Zabezpieczenie AC",
      price: 250,
      category: "Zabezpieczenia",
    },
    {
      id: "3",
      name: "Zabezpieczenie DC",
      price: 200,
      category: "Zabezpieczenia",
    },
    {
      id: "4",
      name: "Kabel solarny 4mm2 (1m)",
      price: 5,
      category: "Okablowanie",
    },
  ],
  LABOR: [
    {
      id: "1",
      name: "Montaż instalacji do 10kW",
      price: 1500,
      category: "Montaż",
    },
    {
      id: "2",
      name: "Montaż instalacji powyżej 10kW",
      price: 2500,
      category: "Montaż",
    },
    {
      id: "3",
      name: "Projekt instalacji",
      price: 1000,
      category: "Dokumentacja",
    },
    {
      id: "4",
      name: "Zgłoszenie do zakładu energetycznego",
      price: 500,
      category: "Dokumentacja",
    },
  ],
  RATES: [
    {
      id: "1",
      name: "Stawka VAT dla osób fizycznych",
      value: 8,
      type: "percentage",
    },
    {
      id: "2",
      name: "Stawka VAT dla firm",
      value: 23,
      type: "percentage",
    },
    {
      id: "3",
      name: "Marża standardowa",
      value: 15,
      type: "percentage",
    },
  ],
  PRICES: [
    {
      id: "1",
      name: "Cena energii",
      value: 0.75,
      unit: "zł/kWh",
    },
    {
      id: "2",
      name: "Opłata dystrybucyjna",
      value: 0.25,
      unit: "zł/kWh",
    },
  ],
}

// Funkcje pomocnicze do generowania ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// Funkcje pomocnicze do formatowania daty
export const formatDate = () => {
  return new Date().toISOString()
}
