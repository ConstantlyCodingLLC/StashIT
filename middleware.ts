import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to the root path and static assets
  if (pathname === "/" || pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/onboarding", "/debug"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  try {
    // Check if the user is authenticated
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
    })
    const isAuthenticated = !!token

    // Redirect logic
    if (!isAuthenticated && !isPublicPath) {
      // Redirect to login if trying to access protected route without authentication
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    if (isAuthenticated && isPublicPath) {
      // Redirect to dashboard if trying to access public route while authenticated
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to proceed to avoid blocking the user
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Match all paths except for static files, api routes, and _next
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
