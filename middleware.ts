import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a minimal middleware that simply passes through all requests
// without any authentication or redirection logic
export function middleware(request: NextRequest) {
  // Simply pass through all requests
  return NextResponse.next()
}

// Limit middleware execution to specific paths to reduce chances of errors
export const config = {
  matcher: [
    // Only match specific paths that need middleware
    "/dashboard/:path*",
    "/inventory/:path*",
    "/settings/:path*",
  ],
}
