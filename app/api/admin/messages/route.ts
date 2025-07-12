import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { SkillSwapDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const messages = await SkillSwapDB.getActiveAdminMessages()

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error) {
    console.error("Error fetching admin messages:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyAdminToken(request)
    const body = await request.json()
    const { title, content, messageType } = body

    const message = await SkillSwapDB.createAdminMessage({
      title,
      content,
      messageType: messageType || "announcement",
      isActive: true,
      createdBy: new ObjectId(decoded.userId),
    })

    return NextResponse.json({
      success: true,
      message: "Admin message sent successfully",
      adminMessage: message,
    })
  } catch (error) {
    console.error("Error creating admin message:", error)
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 })
  }
}
