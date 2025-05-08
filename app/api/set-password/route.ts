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

    // Znajdź użytkownika po adresie email
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      console.error("Error listing users:", usersError)
      return NextResponse.json({ error: "Błąd podczas pobierania listy użytkowników" }, { status: 500 })
    }

    const user = users.users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika o podanym adresie email" }, { status: 404 })
    }

    // Zaktualizuj hasło użytkownika
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password })

    if (updateError) {
      console.error("Error updating user password:", updateError)
      return NextResponse.json({ error: "Błąd podczas aktualizacji hasła: " + updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Hasło zostało ustawione pomyślnie" })
  } catch (error) {
    console.error("Error in set-password API:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas ustawiania hasła" }, { status: 500 })
  }
}
