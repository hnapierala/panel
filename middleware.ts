import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lista ścieżek publicznych, które nie wymagają uwierzytelnienia
const publicPaths = ["/logowanie", "/resetowanie-hasla", "/aktualizacja-hasla", "/zaproszenie", "/kontakt"]

export async function middleware(request: NextRequest) {
  const { pathname, search, hash } = request.nextUrl

  console.log("Middleware: Przetwarzanie URL:", request.url)

  // Sprawdź, czy to link zaproszenia
  const isInviteLink =
    pathname.includes("/auth/invite") ||
    pathname.includes("/invite") ||
    search.includes("type=invite") ||
    hash.includes("type=invite") ||
    search.includes("token=") ||
    hash.includes("token=") ||
    search.includes("access_token=") ||
    hash.includes("access_token=")

  // Jeśli to link zaproszenia, przekieruj do strony zaproszenia
  if (isInviteLink && !pathname.startsWith("/zaproszenie")) {
    console.log("Middleware: Wykryto link zaproszenia, przekierowuję do /zaproszenie")
    const url = new URL("/zaproszenie", request.url)

    // Przekaż wszystkie parametry i fragment
    url.search = search
    url.hash = hash

    console.log("Middleware: Przekierowuję do:", url.toString())
    return NextResponse.redirect(url)
  }

  // Sprawdź, czy to link resetowania hasła
  const isResetLink =
    pathname.includes("/auth/recovery") || search.includes("type=recovery") || hash.includes("type=recovery")

  // Jeśli to link resetowania hasła, przekieruj do strony aktualizacji hasła
  if (isResetLink && !pathname.startsWith("/aktualizacja-hasla")) {
    console.log("Middleware: Wykryto link resetowania hasła, przekierowuję do /aktualizacja-hasla")
    const url = new URL("/aktualizacja-hasla", request.url)

    // Przekaż wszystkie parametry i fragment
    url.search = search
    url.hash = hash

    console.log("Middleware: Przekierowuję do:", url.toString())
    return NextResponse.redirect(url)
  }

  // Dla wszystkich innych ścieżek, kontynuuj normalne przetwarzanie
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
