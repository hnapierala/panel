import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

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

  // Utwórz klienta Supabase dla middleware
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Pobierz sesję
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Jeśli użytkownik nie jest zalogowany, przekieruj go do strony logowania
  if (!session && pathname !== "/") {
    const url = new URL("/logowanie", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Jeśli użytkownik nie jest zalogowany i próbuje dostać się do strony głównej, przekieruj go do logowania
  if (!session && pathname === "/") {
    return NextResponse.redirect(new URL("/logowanie", request.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
