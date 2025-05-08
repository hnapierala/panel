import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  try {
    // Utwórz odpowiedź, którą możemy modyfikować
    const res = NextResponse.next()

    // Utwórz klienta Supabase
    const supabase = createMiddlewareClient({ req, res })

    // Pobierz sesję
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Sprawdź, czy użytkownik jest zalogowany
    const isLoggedIn = !!session

    // Sprawdź, czy URL zawiera token resetowania hasła lub zaproszenia
    const url = req.nextUrl
    const hasAuthToken =
      url.searchParams.has("token") ||
      url.searchParams.has("access_token") ||
      url.searchParams.has("refresh_token") ||
      url.hash.includes("access_token=") ||
      url.hash.includes("refresh_token=")

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
    if (isPublicPath && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Przekieruj z głównej strony do logowania lub dashboardu
    if (req.nextUrl.pathname === "/") {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      } else {
        return NextResponse.redirect(new URL("/logowanie", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Błąd w middleware:", error)

    // W przypadku błędu, przekieruj do strony logowania
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/logowanie", req.url))
    }

    return NextResponse.next()
  }
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
