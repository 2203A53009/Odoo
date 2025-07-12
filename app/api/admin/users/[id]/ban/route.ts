import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { SkillSwapDB } from "@/lib/mongodb"

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

  if (!decoded.isAdmin) {
    throw new Error("Admin access required")
  }

  return decoded
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminToken(request)
    const userId = params.id

    const success = await SkillSwapDB.banUser(userId)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to ban user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User banned successfully",
    })
  } catch (error) {
    console.error("Error banning user:", error)
    return NextResponse.json({ success: false, message: "Failed to ban user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminToken(request)
    const userId = params.id

    const success = await SkillSwapDB.unbanUser(userId)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to unban user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User unbanned successfully",
    })
  } catch (error) {
    console.error("Error unbanning user:", error)
    return NextResponse.json({ success: false, message: "Failed to unban user" }, { status: 500 })
  }
}
