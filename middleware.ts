import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/onboarding"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
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

  return NextResponse.next()
}

// Match all paths except for static files, api routes, and _next
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /images (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|images|[\\w-]+\\.\\w+).*)",
  ],
}
