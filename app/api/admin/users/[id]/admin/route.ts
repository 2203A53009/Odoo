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

    const success = await SkillSwapDB.makeAdmin(userId)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to make user admin" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User promoted to admin successfully",
    })
  } catch (error) {
    console.error("Error making user admin:", error)
    return NextResponse.json({ success: false, message: "Failed to make user admin" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminToken(request)
    const userId = params.id

    const success = await SkillSwapDB.removeAdmin(userId)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to remove admin privileges" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Admin privileges removed successfully",
    })
  } catch (error) {
    console.error("Error removing admin privileges:", error)
    return NextResponse.json({ success: false, message: "Failed to remove admin privileges" }, { status: 500 })
  }
}
