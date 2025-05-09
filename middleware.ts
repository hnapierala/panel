import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lista ścieżek publicznych, które nie wymagają uwierzytelnienia
  const publicPaths = ["/logowanie", "/resetowanie-hasla", "/aktualizacja-hasla", "/zaproszenie", "/kontakt"]

  // Sprawdź, czy ścieżka jest publiczna
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Jeśli ścieżka jest publiczna, nie rób nic
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Sprawdź, czy użytkownik jest zalogowany
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.error("Brak zmiennych środowiskowych Supabase")
    return NextResponse.redirect(new URL("/logowanie", request.url))
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
    },
  })

  const { data } = await supabase.auth.getSession()
  const isLoggedIn = !!data.session

  // Jeśli użytkownik nie jest zalogowany, przekieruj go do strony logowania
  if (!isLoggedIn && pathname !== "/") {
    console.log("Użytkownik niezalogowany, przekierowanie do logowania")
    return NextResponse.redirect(new URL("/logowanie", request.url))
  }

  // Jeśli użytkownik nie jest zalogowany i próbuje dostać się do strony głównej, przekieruj go do logowania
  if (!isLoggedIn && pathname === "/") {
    console.log("Użytkownik niezalogowany na stronie głównej, przekierowanie do logowania")
    return NextResponse.redirect(new URL("/logowanie", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
