import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const { email, password, token } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Adres email jest wymagany" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Hasło jest wymagane" }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: "Token jest wymagany" }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Ustaw hasło użytkownika
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      email, // Użyj adresu email jako ID użytkownika
      { password: password },
    )

    if (error) {
      console.error("Error setting password:", error)
      return NextResponse.json({ error: "Wystąpił błąd podczas ustawiania hasła" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Hasło zostało ustawione pomyślnie" })
  } catch (error) {
    console.error("Error in set-password API:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas ustawiania hasła" }, { status: 500 })
  }
}
