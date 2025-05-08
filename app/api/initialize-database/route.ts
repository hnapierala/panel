import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    // Tworzenie tabeli panels
    const { error: panelsError } = await supabase.rpc("create_panels_table")

    if (panelsError) {
      console.error("Błąd podczas tworzenia tabeli panels:", panelsError)
      return NextResponse.json({ error: "Nie udało się utworzyć tabeli panels" }, { status: 500 })
    }

    // Tworzenie tabeli inverters
    const { error: invertersError } = await supabase.rpc("create_inverters_table")

    if (invertersError) {
      console.error("Błąd podczas tworzenia tabeli inverters:", invertersError)
      return NextResponse.json({ error: "Nie udało się utworzyć tabeli inverters" }, { status: 500 })
    }

    // Tworzenie tabeli constructions
    const { error: constructionsError } = await supabase.rpc("create_constructions_table")

    if (constructionsError) {
      console.error("Błąd podczas tworzenia tabeli constructions:", constructionsError)
      return NextResponse.json({ error: "Nie udało się utworzyć tabeli constructions" }, { status: 500 })
    }

    // Tworzenie tabeli accessories
    const { error: accessoriesError } = await supabase.rpc("create_accessories_table")

    if (accessoriesError) {
      console.error("Błąd podczas tworzenia tabeli accessories:", accessoriesError)
      return NextResponse.json({ error: "Nie udało się utworzyć tabeli accessories" }, { status: 500 })
    }

    // Tworzenie tabeli labor
    const { error: laborError } = await supabase.rpc("create_labor_table")

    if (laborError) {
      console.error("Błąd podczas tworzenia tabeli labor:", laborError)
      return NextResponse.json({ error: "Nie udało się utworzyć tabeli labor" }, { status: 500 })
    }

    // Tworzenie tabeli rates
    const { error: ratesError } = await supabase.rpc("create_rates_table")

    if (ratesError) {
      console.error("Błąd podczas tworzenia tabeli rates:", ratesError)
      return NextResponse.json({ error: "Nie udało się utworzyć tabeli rates" }, { status: 500 })
    }

    // Tworzenie tabeli prices
    const { error: pricesError } = await supabase.rpc("create_prices_table")

    if (pricesError) {
      console.error("Błąd podczas tworzenia tabeli prices:", pricesError)
      return NextResponse.json({ error: "Nie udało się utworzyć tabeli prices" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Błąd podczas inicjalizacji bazy danych:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas inicjalizacji bazy danych" }, { status: 500 })
  }
}
