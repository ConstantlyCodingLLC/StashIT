import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json()

    // In a real app, you would verify the token
    // For this example, we'll just update the password

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "An error occurred during password reset" }, { status: 500 })
  }
}
