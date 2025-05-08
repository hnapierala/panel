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

  // Sprawdź, czy URL zawiera token resetowania hasła lub zaproszenia
  const url = req.nextUrl
  const hasAuthToken =
    url.searchParams.has("token") ||
    url.searchParams.has("t") ||
    url.searchParams.has("access_token") ||
    url.searchParams.has("refresh_token")

  // Ścieżki, które nie wymagają uwierzytelnienia
  const publicPaths = ["/logowanie", "/resetowanie-hasla", "/kontakt", "/zaproszenie", "/aktualizacja-hasla"]
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // Ścieżki, które wymagają uwierzytelnienia
  const protectedPaths = ["/dashboard"]
  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // Jeśli URL zawiera token, zawsze pozwól na dostęp (nie przekierowuj)
  if (hasAuthToken) {
    return res
  }

  // Przekieruj niezalogowanych użytkowników z chronionych ścieżek do logowania
  if (isProtectedPath && !isLoggedIn) {
    return NextResponse.redirect(new URL("/logowanie", req.url))
  }

  // Przekieruj zalogowanych użytkowników z publicznych ścieżek do dashboardu
  // Ale tylko jeśli nie ma tokenu w URL
  if (isPublicPath && isLoggedIn && !hasAuthToken) {
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
