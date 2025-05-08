import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const { email, password, token, type } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email i hasło są wymagane" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Hasło musi mieć co najmniej 8 znaków" }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // First, get the user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()

    if (userError) {
      console.error("Error getting users:", userError)
      return NextResponse.json({ error: "Błąd pobierania użytkowników" }, { status: 500 })
    }

    // Find the user with the matching email
    const user = userData.users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika o podanym adresie email" }, { status: 404 })
    }

    // Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password })

    if (updateError) {
      console.error("Error updating user password:", updateError)
      return NextResponse.json({ error: "Błąd aktualizacji hasła" }, { status: 500 })
    }

    // Create a new session for the user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    })

    if (sessionError) {
      console.error("Error generating session:", sessionError)
      // We don't return an error here because the password was successfully updated
      // The user can still log in manually
    }

    return NextResponse.json({
      success: true,
      message: "Hasło zostało ustawione pomyślnie",
      session: sessionData,
    })
  } catch (error) {
    console.error("Error in set-password API:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas ustawiania hasła" }, { status: 500 })
  }
}
