import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Sprawdzenie połączenia z bazą danych
    const { data, error } = await supabase.from("panels").select("count", { count: "exact" })

    if (error) {
      // Jeśli wystąpił błąd, sprawdź, czy to błąd braku tabeli
      if (error.message.includes('relation "panels" does not exist')) {
        // Baza danych jest skonfigurowana, ale tabele nie istnieją
        return NextResponse.json({ isConfigured: true, tablesExist: false })
      }

      // Inny błąd - baza danych może nie być skonfigurowana
      return NextResponse.json({ isConfigured: false, error: error.message })
    }

    // Baza danych jest skonfigurowana i tabele istnieją
    return NextResponse.json({ isConfigured: true, tablesExist: true })
  } catch (error) {
    console.error("Błąd podczas sprawdzania konfiguracji bazy danych:", error)
    return NextResponse.json({ isConfigured: false, error: "Nie można połączyć się z bazą danych" })
  }
}
