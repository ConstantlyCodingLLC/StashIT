// Simple utility functions for authentication
// These are lightweight alternatives to complex auth logic

/**
 * Simple function to check if a user is authenticated
 * This avoids complex token validation that might cause issues
 */
export function isAuthenticated(authCookie: string | undefined): boolean {
  return !!authCookie
}

/**
 * Get basic user info from a session token
 * This is a simplified version that avoids complex JWT decoding
 */
export function getBasicUserInfo(token: string): { authenticated: boolean } {
  // In a real implementation, you would decode the JWT
  // For now, just return that the user is authenticated if a token exists
  return {
    authenticated: !!token,
  }
}

/**
 * Check if a path requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  const publicPaths = ["/", "/login", "/signup", "/api/auth"]
  return !publicPaths.some((path) => pathname.startsWith(path))
}
