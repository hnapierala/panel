import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId && !email) {
      return NextResponse.json({ error: "Wymagane jest podanie userId lub email" }, { status: 400 })
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

    let userIdToConfirm = userId

    // Jeśli podano email, znajdź userId
    if (!userIdToConfirm && email) {
      const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

      if (usersError) {
        console.error("Error listing users:", usersError)
        return NextResponse.json(
          { error: "Błąd podczas pobierania listy użytkowników: " + usersError.message },
          { status: 500 },
        )
      }

      const user = usersData.users.find((u) => u.email === email)

      if (!user) {
        return NextResponse.json({ error: "Nie znaleziono użytkownika o podanym adresie email" }, { status: 404 })
      }

      userIdToConfirm = user.id
    }

    console.log("Potwierdzanie emaila dla użytkownika:", userIdToConfirm)

    // Wywołaj funkcję SQL do potwierdzenia emaila
    const { error: rpcError } = await supabaseAdmin.rpc("confirm_user_email", { user_id: userIdToConfirm })

    if (rpcError) {
      console.error("Error confirming email with RPC:", rpcError)
      return NextResponse.json({ error: "Błąd podczas potwierdzania emaila: " + rpcError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email został potwierdzony pomyślnie" })
  } catch (error) {
    console.error("Error in admin/confirm-user API:", error)
    return NextResponse.json(
      {
        error:
          "Wystąpił błąd podczas potwierdzania emaila: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
