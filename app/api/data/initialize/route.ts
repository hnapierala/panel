import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { DEFAULT_DATA } from "@/lib/file-storage"

// Ścieżka do katalogu z danymi
const DATA_DIR = path.join(process.cwd(), "data")

// Upewnij się, że katalog istnieje
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
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

// POST /api/data/initialize - inicjalizacja danych
export async function POST() {
  try {
    // Inicjalizacja danych dla wszystkich typów
    const initResults = [
      writeJsonFile(path.join(DATA_DIR, "panels.json"), DEFAULT_DATA.PANELS),
      writeJsonFile(path.join(DATA_DIR, "inverters.json"), DEFAULT_DATA.INVERTERS),
      writeJsonFile(path.join(DATA_DIR, "constructions.json"), DEFAULT_DATA.CONSTRUCTIONS),
      writeJsonFile(path.join(DATA_DIR, "accessories.json"), DEFAULT_DATA.ACCESSORIES),
      writeJsonFile(path.join(DATA_DIR, "labor.json"), DEFAULT_DATA.LABOR),
      writeJsonFile(path.join(DATA_DIR, "rates.json"), DEFAULT_DATA.RATES),
      writeJsonFile(path.join(DATA_DIR, "prices.json"), DEFAULT_DATA.PRICES),
    ]

    // Sprawdź, czy wszystkie operacje się powiodły
    const allSuccessful = initResults.every((result) => result === true)

    if (!allSuccessful) {
      return NextResponse.json({ error: "Nie udało się zainicjalizować wszystkich danych" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Dane zostały pomyślnie zainicjalizowane" })
  } catch (error) {
    console.error("Błąd podczas inicjalizacji danych:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas inicjalizacji danych" }, { status: 500 })
  }
}
