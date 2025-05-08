import { type NextRequest, NextResponse } from "next/server"
import { DEFAULT_DATA } from "@/lib/api-client"

// Dane w pamięci dla trybu podglądu
let inMemoryData = {
  panels: [...DEFAULT_DATA.PANELS],
  inverters: [...DEFAULT_DATA.INVERTERS],
  constructions: [...DEFAULT_DATA.CONSTRUCTIONS],
  accessories: [...DEFAULT_DATA.ACCESSORIES],
  labor: [...DEFAULT_DATA.LABOR],
  rates: [...DEFAULT_DATA.RATES],
  prices: [...DEFAULT_DATA.PRICES],
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path || []

  // Obsługa inicjalizacji
  if (path[0] === "initialize") {
    return NextResponse.json({ success: true, message: "Dane zostały pomyślnie zainicjalizowane" })
  }

  // Pobieranie wszystkich elementów danego typu
  if (path.length === 1 && inMemoryData[path[0]]) {
    return NextResponse.json(inMemoryData[path[0]])
  }

  // Pobieranie pojedynczego elementu
  if (path.length === 2 && inMemoryData[path[0]]) {
    const id = path[1]
    const item = inMemoryData[path[0]].find((item: any) => item.id === id)

    if (!item) {
      return NextResponse.json({ error: "Element nie został znaleziony" }, { status: 404 })
    }

    return NextResponse.json(item)
  }

  return NextResponse.json({ error: "Nie znaleziono zasobu" }, { status: 404 })
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path || []

  // Obsługa inicjalizacji
  if (path[0] === "initialize") {
    inMemoryData = {
      panels: [...DEFAULT_DATA.PANELS],
      inverters: [...DEFAULT_DATA.INVERTERS],
      constructions: [...DEFAULT_DATA.CONSTRUCTIONS],
      accessories: [...DEFAULT_DATA.ACCESSORIES],
      labor: [...DEFAULT_DATA.LABOR],
      rates: [...DEFAULT_DATA.RATES],
      prices: [...DEFAULT_DATA.PRICES],
    }
    return NextResponse.json({ success: true, message: "Dane zostały pomyślnie zainicjalizowane" })
  }

  // Dodawanie nowego elementu
  if (path.length === 1 && inMemoryData[path[0]]) {
    const data = await request.json()

    // Dodaj ID i daty, jeśli nie istnieją
    const now = new Date().toISOString()
    const newItem = {
      ...data,
      id: data.id || `temp_${Date.now()}`,
      created_at: now,
      updated_at: now,
    }

    inMemoryData[path[0]].push(newItem)

    return NextResponse.json(newItem, { status: 201 })
  }

  return NextResponse.json({ error: "Nieprawidłowe żądanie" }, { status: 400 })
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path || []

  // Aktualizacja wszystkich elementów
  if (path.length === 1 && inMemoryData[path[0]]) {
    const data = await request.json()
    inMemoryData[path[0]] = data
    return NextResponse.json({ success: true })
  }

  // Aktualizacja pojedynczego elementu
  if (path.length === 2 && inMemoryData[path[0]]) {
    const id = path[1]
    const data = await request.json()
    const index = inMemoryData[path[0]].findIndex((item: any) => item.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Element nie został znaleziony" }, { status: 404 })
    }

    // Aktualizuj element, zachowując ID i datę utworzenia
    inMemoryData[path[0]][index] = {
      ...inMemoryData[path[0]][index],
      ...data,
      id,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Nieprawidłowe żądanie" }, { status: 400 })
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path || []

  // Usuwanie pojedynczego elementu
  if (path.length === 2 && inMemoryData[path[0]]) {
    const id = path[1]
    const index = inMemoryData[path[0]].findIndex((item: any) => item.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Element nie został znaleziony" }, { status: 404 })
    }

    inMemoryData[path[0]].splice(index, 1)

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Nieprawidłowe żądanie" }, { status: 400 })
}
