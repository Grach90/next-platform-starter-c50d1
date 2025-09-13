import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("admin_auth")

    if (!authCookie) {
      // Redirect to login if no auth cookie
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const authData = JSON.parse(authCookie.value)
      if (!authData.isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch {
      // Invalid cookie format
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect to admin if already authenticated and trying to access login
  if (pathname === "/login") {
    const authCookie = request.cookies.get("admin_auth")

    if (authCookie) {
      try {
        const authData = JSON.parse(authCookie.value)
        if (authData.isAuthenticated) {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      } catch {
        // Invalid cookie, continue to login
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
