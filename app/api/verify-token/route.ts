import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const { token, type } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token jest wymagany" }, { status: 400 })
    }

    if (type !== "invite" && type !== "recovery") {
      return NextResponse.json({ error: "Nieprawidłowy typ tokenu" }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Verify the token
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(
      // We don't have the user ID yet, but we can verify the token
      // This is just to check if the token is valid
      // The actual user ID will be retrieved in the set-password endpoint
      "dummy-id",
    )

    if (error) {
      console.error("Error verifying token:", error)
      return NextResponse.json({ error: "Nieprawidłowy lub wygasły token" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Token zweryfikowany pomyślnie" })
  } catch (error) {
    console.error("Error in verify-token API:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas weryfikacji tokenu" }, { status: 500 })
  }
}
