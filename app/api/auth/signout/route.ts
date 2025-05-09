import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: true,
        },
      },
    )

    await supabase.auth.signOut()

    return NextResponse.redirect(
      new URL("/logowanie", process.env.NEXT_PUBLIC_SITE_URL || "https://panel-ozesystem.vercel.app"),
    )
  } catch (error) {
    console.error("Error signing out:", error)
    return NextResponse.redirect(
      new URL("/logowanie", process.env.NEXT_PUBLIC_SITE_URL || "https://panel-ozesystem.vercel.app"),
    )
  }
}
