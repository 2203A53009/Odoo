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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdminToken(request)
    const body = await request.json()
    const { status, adminNotes } = body
    const reportId = params.id

    const updatedReport = await SkillSwapDB.updateReport(reportId, {
      status,
      adminNotes,
    })

    if (!updatedReport) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Report ${status} successfully`,
      report: updatedReport,
    })
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ success: false, message: "Failed to update report" }, { status: 500 })
  }
}
