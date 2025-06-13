// Simplified middleware to avoid blocking the build process
export function middleware() {
  // Return immediately to prevent any blocking operations
  return Response.next()
}

// Limit middleware execution to prevent issues
export const config = {
  matcher: [],
}
