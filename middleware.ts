import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  try {
    // Utwórz odpowiedź, którą możemy modyfikować
    const res = NextResponse.next()

    // Sprawdź, czy URL zawiera token lub parametry uwierzytelniania
    const url = req.nextUrl
    const hasAuthParams =
      url.searchParams.has("token") ||
      url.searchParams.has("access_token") ||
      url.searchParams.has("refresh_token") ||
      url.searchParams.has("type") ||
      url.searchParams.has("code") ||
      url.hash.includes("access_token=") ||
      url.hash.includes("refresh_token=") ||
      url.hash.includes("type=")

    // Jeśli URL zawiera parametry uwierzytelniania, nie wykonuj żadnych przekierowań
    if (hasAuthParams) {
      console.log("Middleware: Wykryto parametry uwierzytelniania w URL, pomijam przekierowania")

      // Sprawdź, czy to zaproszenie
      const isInvite = url.searchParams.get("type") === "invite" || url.hash.includes("type=invite")

      // Jeśli to zaproszenie, przekieruj do strony zaproszenia
      if (isInvite && !url.pathname.startsWith("/zaproszenie")) {
        console.log("Middleware: Wykryto zaproszenie, przekierowuję do /zaproszenie")
        const redirectUrl = new URL("/zaproszenie", req.url)

        // Przekaż wszystkie parametry i fragment
        url.searchParams.forEach((value, key) => {
          redirectUrl.searchParams.set(key, value)
        })
        if (url.hash) {
          redirectUrl.hash = url.hash
        }

        return NextResponse.redirect(redirectUrl)
      }

      return res
    }

    // Utwórz klienta Supabase
    const supabase = createMiddlewareClient({ req, res })

    // Pobierz sesję
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Sprawdź, czy użytkownik jest zalogowany
    const isLoggedIn = !!session

    // Ścieżki, które nie wymagają uwierzytelnienia
    const publicPaths = ["/logowanie", "/resetowanie-hasla", "/kontakt", "/zaproszenie", "/aktualizacja-hasla"]
    const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))

    // Ścieżki, które wymagają uwierzytelnienia
    const protectedPaths = ["/dashboard"]
    const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))

    // Przekieruj niezalogowanych użytkowników z chronionych ścieżek do logowania
    if (isProtectedPath && !isLoggedIn) {
      console.log("Middleware: Przekierowuję niezalogowanego użytkownika do logowania")
      return NextResponse.redirect(new URL("/logowanie", req.url))
    }

    // Przekieruj zalogowanych użytkowników z publicznych ścieżek do dashboardu
    if (isPublicPath && isLoggedIn) {
      console.log("Middleware: Przekierowuję zalogowanego użytkownika do dashboardu")
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Przekieruj z głównej strony do logowania lub dashboardu
    if (req.nextUrl.pathname === "/") {
      if (isLoggedIn) {
        console.log("Middleware: Przekierowuję z głównej strony do dashboardu")
        return NextResponse.redirect(new URL("/dashboard", req.url))
      } else {
        console.log("Middleware: Przekierowuję z głównej strony do logowania")
        return NextResponse.redirect(new URL("/logowanie", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Błąd w middleware:", error)
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
