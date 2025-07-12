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

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const analytics = await SkillSwapDB.getAnalytics()

    return NextResponse.json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch analytics" }, { status: 500 })
  }
}
