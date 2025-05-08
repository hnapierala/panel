import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Lista ścieżek publicznych, które nie wymagają uwierzytelnienia
  const publicPaths = ["/logowanie", "/resetowanie-hasla", "/aktualizacja-hasla", "/zaproszenie", "/kontakt"]

  // Sprawdź, czy ścieżka jest publiczna
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Jeśli ścieżka jest publiczna, nie rób nic
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Sprawdź, czy użytkownik jest zalogowany
  const token = request.cookies.get("sb-access-token")
  const isLoggedIn = !!token

  // Jeśli użytkownik nie jest zalogowany, przekieruj go do strony logowania
  if (!isLoggedIn) {
    const url = new URL("/logowanie", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
