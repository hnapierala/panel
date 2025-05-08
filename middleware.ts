import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Lista ścieżek publicznych, które nie wymagają uwierzytelnienia
const publicPaths = ["/logowanie", "/resetowanie-hasla", "/aktualizacja-hasla", "/zaproszenie", "/kontakt"]

export async function middleware(request: NextRequest) {
  const { pathname, search, hash } = request.nextUrl

  // Sprawdź, czy ścieżka zawiera token uwierzytelniania
  const hasAuthParam =
    search.includes("token=") ||
    search.includes("access_token=") ||
    search.includes("refresh_token=") ||
    search.includes("type=recovery") ||
    search.includes("type=invite") ||
    hash.includes("access_token=") ||
    hash.includes("refresh_token=")

  // Jeśli URL zawiera token uwierzytelniania, przekieruj do odpowiedniej strony
  if (hasAuthParam) {
    // Jeśli URL zawiera token zaproszenia lub resetowania hasła, przekieruj do odpowiedniej strony
    if (search.includes("type=invite") || hash.includes("type=invite")) {
      const url = new URL("/zaproszenie", request.url)
      url.search = search
      url.hash = hash
      return NextResponse.redirect(url)
    }

    if (search.includes("type=recovery") || hash.includes("type=recovery")) {
      const url = new URL("/aktualizacja-hasla", request.url)
      url.search = search
      url.hash = hash
      return NextResponse.redirect(url)
    }

    // Jeśli URL zawiera token, ale nie jest to zaproszenie ani resetowanie hasła,
    // przekieruj do strony aktualizacji hasła
    if (pathname !== "/aktualizacja-hasla" && pathname !== "/zaproszenie") {
      const url = new URL("/aktualizacja-hasla", request.url)
      url.search = search
      url.hash = hash
      return NextResponse.redirect(url)
    }

    // Jeśli jesteśmy już na odpowiedniej stronie, kontynuuj
    return NextResponse.next()
  }

  // Sprawdź, czy użytkownik jest zalogowany
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Brak wymaganych zmiennych środowiskowych Supabase")
    return NextResponse.next()
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Jeśli użytkownik nie jest zalogowany i próbuje uzyskać dostęp do chronionej ścieżki,
  // przekieruj go do strony logowania
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  if (!session && !isPublicPath) {
    const url = new URL("/logowanie", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Jeśli użytkownik jest zalogowany i próbuje uzyskać dostęp do strony logowania,
  // przekieruj go do dashboardu
  if (session && isPublicPath && pathname !== "/zaproszenie" && pathname !== "/aktualizacja-hasla") {
    const url = new URL("/dashboard", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
