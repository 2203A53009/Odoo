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

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let swaps = await SkillSwapDB.getUserSwapRequests(decoded.userId)

    if (status) {
      swaps = swaps.filter((swap) => swap.status === status)
    }

    // Format response
    const formattedSwaps = swaps.map((swap) => ({
      id: swap._id,
      requesterId: swap.requesterId,
      targetId: swap.targetId,
      requesterName: swap.requesterName,
      targetName: swap.targetName,
      skillOffered: swap.skillOffered,
      skillWanted: swap.skillWanted,
      message: swap.message,
      status: swap.status,
      createdAt: swap.createdAt,
      updatedAt: swap.updatedAt,
      type: swap.requesterId.toString() === decoded.userId ? "outgoing" : "incoming",
    }))

    return NextResponse.json({
      success: true,
      swaps: formattedSwaps,
    })
  } catch (error) {
    console.error("Error fetching swaps:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch swaps" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const body = await request.json()
    const { targetId, skillOffered, skillWanted, message } = body

    // Get user details
    const requester = await SkillSwapDB.findUserById(decoded.userId)
    const target = await SkillSwapDB.findUserById(targetId)

    if (!requester || !target) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Create swap request
    const swapRequest = await SkillSwapDB.createSwapRequest({
      requesterId: new ObjectId(decoded.userId),
      targetId: new ObjectId(targetId),
      requesterName: requester.name,
      targetName: target.name,
      skillOffered,
      skillWanted,
      message,
      status: "pending",
    })

    return NextResponse.json({
      success: true,
      message: "Swap request sent successfully",
      swap: {
        id: swapRequest._id,
        requesterId: swapRequest.requesterId,
        targetId: swapRequest.targetId,
        requesterName: swapRequest.requesterName,
        targetName: swapRequest.targetName,
        skillOffered: swapRequest.skillOffered,
        skillWanted: swapRequest.skillWanted,
        message: swapRequest.message,
        status: swapRequest.status,
        createdAt: swapRequest.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating swap request:", error)
    return NextResponse.json({ success: false, message: "Failed to create swap request" }, { status: 500 })
  }
}
