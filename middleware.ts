import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Sprawdź, czy użytkownik jest zalogowany
  const isLoggedIn = !!session

  // Ścieżki, które nie wymagają uwierzytelnienia
  const publicPaths = ["/logowanie", "/resetowanie-hasla", "/kontakt", "/zaproszenie"]
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // Ścieżki, które wymagają uwierzytelnienia
  const protectedPaths = ["/dashboard", "/aktualizacja-hasla"]
  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // Przekieruj niezalogowanych użytkowników z chronionych ścieżek do logowania
  if (isProtectedPath && !isLoggedIn) {
    return NextResponse.redirect(new URL("/logowanie", req.url))
  }

  // Przekieruj zalogowanych użytkowników z publicznych ścieżek do dashboardu
  // Wyjątek: nie przekierowuj z /zaproszenie, nawet jeśli użytkownik jest zalogowany
  if (isPublicPath && isLoggedIn && !req.nextUrl.pathname.startsWith("/zaproszenie")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/logowanie",
    "/resetowanie-hasla",
    "/aktualizacja-hasla",
    "/kontakt",
    "/zaproszenie",
  ],
}
