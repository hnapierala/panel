import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Adres email jest wymagany" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Hasło jest wymagane" }, { status: 400 })
    }

    // Utwórz klienta Supabase z kluczem serwisowym
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    console.log("Próba ustawienia hasła dla użytkownika:", email)

    // Pobierz listę użytkowników
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      console.error("Error listing users:", usersError)
      return NextResponse.json(
        { error: "Błąd podczas pobierania listy użytkowników: " + usersError.message },
        { status: 500 },
      )
    }

    console.log("Liczba użytkowników:", users.users.length)

    // Znajdź użytkownika po adresie email
    const user = users.users.find((u) => u.email === email)

    if (!user) {
      console.error("Nie znaleziono użytkownika o adresie email:", email)
      return NextResponse.json({ error: "Nie znaleziono użytkownika o podanym adresie email" }, { status: 404 })
    }

    console.log("Znaleziono użytkownika:", user.id)

    // Zaktualizuj hasło użytkownika bezpośrednio przez API Supabase
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password })

    if (updateError) {
      console.error("Error updating user password:", updateError)
      return NextResponse.json({ error: "Błąd podczas aktualizacji hasła: " + updateError.message }, { status: 500 })
    }

    console.log("Hasło zostało pomyślnie zaktualizowane dla użytkownika:", user.id)

    return NextResponse.json({ success: true, message: "Hasło zostało ustawione pomyślnie" })
  } catch (error) {
    console.error("Error in direct-set-password API:", error)
    return NextResponse.json(
      { error: "Wystąpił błąd podczas ustawiania hasła: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
