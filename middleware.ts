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

  // Ścieżki, które nie wymagają autoryzacji
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/reset-password"]
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname === path)

  // Ścieżki autoryzacyjne
  const isAuthPath = req.nextUrl.pathname.startsWith("/auth/")

  // Przekieruj niezalogowanych użytkowników do strony logowania
  if (!isLoggedIn && !isPublicPath && !isAuthPath) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // Przekieruj zalogowanych użytkowników z publicznych ścieżek do dashboardu
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

// Określ, dla których ścieżek middleware ma być uruchamiany
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
