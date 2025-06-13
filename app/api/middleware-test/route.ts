import { NextResponse } from "next/server"

// Simple API route to test if middleware is working correctly
export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Middleware is functioning correctly",
    timestamp: new Date().toISOString(),
  })
}
