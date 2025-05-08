import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { supabaseUrl, supabaseKey } = await request.json()

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Brak wymaganych parametrów" }, { status: 400 })
    }

    // Tworzenie tymczasowego klienta Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Testowanie połączenia
    const { data, error } = await supabase.from("_test_connection").select("*").limit(1)

    if (error && !error.message.includes('relation "_test_connection" does not exist')) {
      // Jeśli wystąpił błąd inny niż brak tabeli testowej
      return NextResponse.json({ error: `Błąd połączenia: ${error.message}` }, { status: 500 })
    }

    // Połączenie udane
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Błąd podczas testowania połączenia z bazą danych:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas testowania połączenia" }, { status: 500 })
  }
}
