import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    await supabase.auth.signOut()

    return NextResponse.redirect(
      new URL("/logowanie", process.env.NEXT_PUBLIC_SITE_URL || "https://panel-ozesystem.vercel.app"),
      {
        status: 302,
      },
    )
  } catch (error) {
    console.error("Error signing out:", error)
    return NextResponse.redirect(
      new URL("/logowanie", process.env.NEXT_PUBLIC_SITE_URL || "https://panel-ozesystem.vercel.app"),
      {
        status: 302,
      },
    )
  }
}
