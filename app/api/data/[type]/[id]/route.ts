import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { formatDate } from "@/lib/file-storage"

// Ścieżka do katalogu z danymi
const DATA_DIR = path.join(process.cwd(), "data")

// Funkcja do odczytu pliku JSON
const readJsonFile = (filePath: string, defaultData: any = []) => {
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

// GET /api/data/[type]/[id] - pobieranie pojedynczego elementu
export async function GET(request: Request, { params }: { params: { type: string; id: string } }) {
  try {
    const { type, id } = params

    if (!typeToFileName[type]) {
      return NextResponse.json({ error: "Nieprawidłowy typ danych" }, { status: 400 })
    }

    const filePath = path.join(DATA_DIR, typeToFileName[type])
    const data = readJsonFile(filePath, [])

    const item = data.find((item: any) => item.id === id)

    if (!item) {
      return NextResponse.json({ error: "Element nie został znaleziony" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error(`Błąd podczas pobierania elementu typu ${params.type} o ID ${params.id}:`, error)
    return NextResponse.json({ error: "Wystąpił błąd podczas pobierania elementu" }, { status: 500 })
  }
}

// PUT /api/data/[type]/[id] - aktualizacja pojedynczego elementu
export async function PUT(request: Request, { params }: { params: { type: string; id: string } }) {
  try {
    const { type, id } = params

    if (!typeToFileName[type]) {
      return NextResponse.json({ error: "Nieprawidłowy typ danych" }, { status: 400 })
    }

    const filePath = path.join(DATA_DIR, typeToFileName[type])
    const data = readJsonFile(filePath, [])

    const itemIndex = data.findIndex((item: any) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Element nie został znaleziony" }, { status: 404 })
    }

    const updatedItem = await request.json()

    // Aktualizuj element, zachowując ID i datę utworzenia
    data[itemIndex] = {
      ...data[itemIndex],
      ...updatedItem,
      id, // Zachowaj oryginalne ID
      updated_at: formatDate(),
    }

    // Zapisz dane do pliku
    const success = writeJsonFile(filePath, data)

    if (!success) {
      return NextResponse.json({ error: "Nie udało się zapisać danych" }, { status: 500 })
    }

    return NextResponse.json(data[itemIndex])
  } catch (error) {
    console.error(`Błąd podczas aktualizacji elementu typu ${params.type} o ID ${params.id}:`, error)
    return NextResponse.json({ error: "Wystąpił błąd podczas aktualizacji elementu" }, { status: 500 })
  }
}

// DELETE /api/data/[type]/[id] - usuwanie pojedynczego elementu
export async function DELETE(request: Request, { params }: { params: { type: string; id: string } }) {
  try {
    const { type, id } = params

    if (!typeToFileName[type]) {
      return NextResponse.json({ error: "Nieprawidłowy typ danych" }, { status: 400 })
    }

    const filePath = path.join(DATA_DIR, typeToFileName[type])
    const data = readJsonFile(filePath, [])

    const itemIndex = data.findIndex((item: any) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Element nie został znaleziony" }, { status: 404 })
    }

    // Usuń element z danych
    data.splice(itemIndex, 1)

    // Zapisz dane do pliku
    const success = writeJsonFile(filePath, data)

    if (!success) {
      return NextResponse.json({ error: "Nie udało się zapisać danych" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Błąd podczas usuwania elementu typu ${params.type} o ID ${params.id}:`, error)
    return NextResponse.json({ error: "Wystąpił błąd podczas usuwania elementu" }, { status: 500 })
  }
}
