import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Nie rób nic dla ścieżek z tokenami uwierzytelniania
  // Pozwól im przejść bezpośrednio do odpowiednich stron
  const url = request.nextUrl
  const hasAuthParams =
    url.searchParams.has("token") ||
    url.searchParams.has("access_token") ||
    url.searchParams.has("refresh_token") ||
    url.searchParams.has("type") ||
    url.hash.includes("access_token=") ||
    url.hash.includes("refresh_token=") ||
    url.hash.includes("type=")

  if (hasAuthParams) {
    return NextResponse.next()
  }

  // Dla pozostałych ścieżek, kontynuuj normalne przetwarzanie
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
