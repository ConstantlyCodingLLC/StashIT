import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Step 1: Re-enable basic middleware with minimal functionality
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Step 1: Basic public path checking
  // Define paths that don't require authentication
  const publicPaths = ["/", "/login", "/signup", "/api/auth"]

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Step 2: Simple session check using cookies
  // Check for authentication cookie without complex token validation
  const authCookie = request.cookies.get("next-auth.session-token")

  // If no auth cookie and not a public path, redirect to login
  if (!authCookie && !pathname.startsWith("/api")) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // For all other cases, proceed normally
  return NextResponse.next()
}

// Step 3: Limited matcher configuration to reduce overhead
// Only apply middleware to specific paths
export const config = {
  matcher: [
    // Only match specific paths that need middleware
    "/dashboard/:path*",
    "/inventory/:path*",
    "/suppliers/:path*",
    "/orders/:path*",
    "/reports/:path*",
    "/settings/:path*",
    // Exclude static files and images
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
