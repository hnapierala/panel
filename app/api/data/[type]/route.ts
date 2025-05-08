import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { DEFAULT_DATA, generateId, formatDate } from "@/lib/file-storage"

// Ścieżka do katalogu z danymi
const DATA_DIR = path.join(process.cwd(), "data")

// Upewnij się, że katalog istnieje
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Funkcja do odczytu pliku JSON
const readJsonFile = (filePath: string, defaultData: any) => {
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8")
      return JSON.parse(fileData)
    }
    return defaultData
  } catch (error) {
    console.error(`Błąd odczytu pliku ${filePath}:`, error)
    return defaultData
  }
}

// Funkcja do zapisu pliku JSON
const writeJsonFile = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error(`Błąd zapisu pliku ${filePath}:`, error)
    return false
  }
}

// Mapowanie typów na nazwy plików
const typeToFileName: Record<string, string> = {
  panels: "panels.json",
  inverters: "inverters.json",
  constructions: "constructions.json",
  accessories: "accessories.json",
  labor: "labor.json",
  rates: "rates.json",
  prices: "prices.json",
}

// Mapowanie typów na domyślne dane
const typeToDefaultData: Record<string, any> = {
  panels: DEFAULT_DATA.PANELS,
  inverters: DEFAULT_DATA.INVERTERS,
  constructions: DEFAULT_DATA.CONSTRUCTIONS,
  accessories: DEFAULT_DATA.ACCESSORIES,
  labor: DEFAULT_DATA.LABOR,
  rates: DEFAULT_DATA.RATES,
  prices: DEFAULT_DATA.PRICES,
}

// GET /api/data/[type] - pobieranie danych
export async function GET(request: Request, { params }: { params: { type: string } }) {
  try {
    const type = params.type.toLowerCase()

    if (!typeToFileName[type]) {
      return NextResponse.json({ error: "Nieprawidłowy typ danych" }, { status: 400 })
    }

    const filePath = path.join(DATA_DIR, typeToFileName[type])
    const data = readJsonFile(filePath, typeToDefaultData[type])

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Błąd podczas pobierania danych typu ${params.type}:`, error)
    return NextResponse.json({ error: "Wystąpił błąd podczas pobierania danych" }, { status: 500 })
  }
}

// POST /api/data/[type] - dodawanie nowych danych
export async function POST(request: Request, { params }: { params: { type: string } }) {
  try {
    const type = params.type.toLowerCase()

    if (!typeToFileName[type]) {
      return NextResponse.json({ error: "Nieprawidłowy typ danych" }, { status: 400 })
    }

    const filePath = path.join(DATA_DIR, typeToFileName[type])
    const data = readJsonFile(filePath, typeToDefaultData[type])

    const newItem = await request.json()

    // Dodaj ID i daty, jeśli nie istnieją
    const itemToAdd = {
      ...newItem,
      id: newItem.id || generateId(),
      created_at: formatDate(),
      updated_at: formatDate(),
    }

    // Dodaj nowy element do danych
    data.push(itemToAdd)

    // Zapisz dane do pliku
    const success = writeJsonFile(filePath, data)

    if (!success) {
      return NextResponse.json({ error: "Nie udało się zapisać danych" }, { status: 500 })
    }

    return NextResponse.json(itemToAdd, { status: 201 })
  } catch (error) {
    console.error(`Błąd podczas dodawania danych typu ${params.type}:`, error)
    return NextResponse.json({ error: "Wystąpił błąd podczas dodawania danych" }, { status: 500 })
  }
}

// PUT /api/data/[type] - aktualizacja wszystkich danych
export async function PUT(request: Request, { params }: { params: { type: string } }) {
  try {
    const type = params.type.toLowerCase()

    if (!typeToFileName[type]) {
      return NextResponse.json({ error: "Nieprawidłowy typ danych" }, { status: 400 })
    }

    const filePath = path.join(DATA_DIR, typeToFileName[type])
    const newData = await request.json()

    // Zapisz dane do pliku
    const success = writeJsonFile(filePath, newData)

    if (!success) {
      return NextResponse.json({ error: "Nie udało się zapisać danych" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Błąd podczas aktualizacji danych typu ${params.type}:`, error)
    return NextResponse.json({ error: "Wystąpił błąd podczas aktualizacji danych" }, { status: 500 })
  }
}
