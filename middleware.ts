import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  try {
    // Pobierz pełny URL i parametry
    const url = req.nextUrl
    const fullUrl = url.toString()

    console.log("Middleware: Przetwarzanie URL:", fullUrl)

    // Sprawdź, czy URL zawiera parametry zaproszenia
    const isInviteLink =
      fullUrl.includes("type=invite") ||
      fullUrl.includes("t=invite") ||
      fullUrl.includes("token=") ||
      fullUrl.includes("access_token=") ||
      fullUrl.includes("refresh_token=") ||
      fullUrl.includes("code=")

    // Jeśli to link z zaproszeniem i nie jesteśmy już na stronie zaproszenia,
    // przekieruj do strony zaproszenia z zachowaniem wszystkich parametrów
    if (isInviteLink && !url.pathname.startsWith("/zaproszenie")) {
      console.log("Middleware: Wykryto link z zaproszeniem, przekierowuję do /zaproszenie")

      // Utwórz nowy URL do strony zaproszenia
      const redirectUrl = new URL("/zaproszenie", req.url)

      // Przekaż wszystkie parametry zapytania
      url.searchParams.forEach((value, key) => {
        redirectUrl.searchParams.set(key, value)
      })

      // Przekaż fragment URL (część po #)
      if (url.hash) {
        redirectUrl.hash = url.hash
      }

      console.log("Middleware: Przekierowuję do:", redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // Dla wszystkich innych ścieżek, kontynuuj normalne przetwarzanie
    return NextResponse.next()
  } catch (error) {
    console.error("Błąd w middleware:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/(.*)", "/api/:path*"],
}
