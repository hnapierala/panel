import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const path = requestUrl.pathname

  // Check if the path is for authentication
  const isAuthPath =
    path === "/logowanie" || path === "/resetowanie-hasla" || path === "/aktualizacja-hasla" || path === "/zaproszenie"

  // Check if the URL has authentication parameters
  const hasAuthParams =
    requestUrl.searchParams.has("token") ||
    requestUrl.searchParams.has("type") ||
    requestUrl.searchParams.has("access_token") ||
    requestUrl.searchParams.has("refresh_token") ||
    requestUrl.hash.includes("access_token=") ||
    requestUrl.hash.includes("refresh_token=")

  // If the URL has authentication parameters, don't interfere with it
  if (hasAuthParams) {
    console.log("URL has auth params, not redirecting:", requestUrl.toString())
    return NextResponse.next()
  }

  // Create Supabase client
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  // Redirect logic
  if (isAuthenticated && isAuthPath) {
    // If authenticated and trying to access auth pages, redirect to dashboard
    console.log("Authenticated user trying to access auth page, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isAuthenticated && !isAuthPath && path !== "/") {
    // If not authenticated and trying to access protected pages, redirect to login
    console.log("Unauthenticated user trying to access protected page, redirecting to login")
    return NextResponse.redirect(new URL("/logowanie", request.url))
  }

  if (!isAuthenticated && path === "/") {
    // If not authenticated and accessing root, redirect to login
    console.log("Unauthenticated user accessing root, redirecting to login")
    return NextResponse.redirect(new URL("/logowanie", request.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
