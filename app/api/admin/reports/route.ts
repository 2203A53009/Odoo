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

    const reports = await SkillSwapDB.getPendingReports()

    const formattedReports = reports.map((report) => ({
      id: report._id,
      reporterId: report.reporterId,
      reportedUserId: report.reportedUserId,
      reporterName: report.reporterName,
      reportedUserName: report.reportedUserName,
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: report.createdAt,
    }))

    return NextResponse.json({
      success: true,
      reports: formattedReports,
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyAdminToken(request)
    const body = await request.json()
    const { reportedUserId, reason, description } = body

    // Get user details
    const reportedUser = await SkillSwapDB.findUserById(reportedUserId)
    const reporter = await SkillSwapDB.findUserById(decoded.userId)

    if (!reportedUser || !reporter) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const report = await SkillSwapDB.createReport({
      reporterId: new ObjectId(decoded.userId),
      reportedUserId: new ObjectId(reportedUserId),
      reporterName: reporter.name,
      reportedUserName: reportedUser.name,
      reason,
      description,
      status: "pending",
    })

    return NextResponse.json({
      success: true,
      message: "Report created successfully",
      report: {
        id: report._id,
        reason: report.reason,
        description: report.description,
        status: report.status,
        createdAt: report.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ success: false, message: "Failed to create report" }, { status: 500 })
  }
}
