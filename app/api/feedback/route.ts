import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { SkillSwapDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const body = await request.json()
    const { swapRequestId, revieweeId, rating, feedback } = body

    const feedbackDoc = await SkillSwapDB.createFeedback({
      swapRequestId: new ObjectId(swapRequestId),
      reviewerId: new ObjectId(decoded.userId),
      revieweeId: new ObjectId(revieweeId),
      rating,
      feedback: feedback || "",
    })

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: feedbackDoc,
    })
  } catch (error) {
    console.error("Error creating feedback:", error)
    return NextResponse.json({ success: false, message: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || decoded.userId

    const feedback = await SkillSwapDB.getUserFeedback(userId)

    return NextResponse.json({
      success: true,
      feedback,
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch feedback" }, { status: 500 })
  }
}
