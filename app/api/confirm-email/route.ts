import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Adres email jest wymagany" }, { status: 400 })
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

    console.log("Próba potwierdzenia emaila dla użytkownika:", email)

    // Pobierz listę użytkowników
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      console.error("Error listing users:", usersError)
      return NextResponse.json(
        { error: "Błąd podczas pobierania listy użytkowników: " + usersError.message },
        { status: 500 },
      )
    }

    if (!usersData || !usersData.users) {
      console.error("Brak danych użytkowników")
      return NextResponse.json({ error: "Brak danych użytkowników" }, { status: 500 })
    }

    // Znajdź użytkownika po adresie email
    const user = usersData.users.find((u) => u.email === email)

    if (!user) {
      console.error("Nie znaleziono użytkownika o adresie email:", email)
      return NextResponse.json({ error: "Nie znaleziono użytkownika o podanym adresie email" }, { status: 404 })
    }

    console.log("Znaleziono użytkownika:", user.id)

    // Wywołaj naszą nową funkcję SQL do potwierdzenia emaila
    const { error: rpcError } = await supabaseAdmin.rpc("confirm_user_email", { user_id: user.id })

    if (rpcError) {
      console.error("Error confirming email with RPC:", rpcError)

      // Spróbuj alternatywnej metody
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email_confirm: true,
        user_metadata: { email_confirmed: true },
      })

      if (updateError) {
        console.error("Error confirming email with updateUserById:", updateError)
        return NextResponse.json(
          { error: "Błąd podczas potwierdzania emaila: " + updateError.message },
          { status: 500 },
        )
      }
    }

    console.log("Email został pomyślnie potwierdzony dla użytkownika:", user.id)

    return NextResponse.json({ success: true, message: "Email został potwierdzony pomyślnie" })
  } catch (error) {
    console.error("Error in confirm-email API:", error)
    return NextResponse.json(
      {
        error:
          "Wystąpił błąd podczas potwierdzania emaila: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
