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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    const body = await request.json()
    const { status, rating, feedback } = body
    const swapId = params.id

    // Get the swap request
    const swap = await SkillSwapDB.getSwapRequestById(swapId)
    if (!swap) {
      return NextResponse.json({ success: false, message: "Swap request not found" }, { status: 404 })
    }

    // Verify user has permission to update this swap
    const userId = decoded.userId
    if (swap.requesterId.toString() !== userId && swap.targetId.toString() !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Update swap status
    const updatedSwap = await SkillSwapDB.updateSwapRequest(swapId, { status })

    // If completing the swap, handle rating and feedback
    if (status === "completed" && rating && updatedSwap) {
      // Determine who is being rated
      const revieweeId = swap.requesterId.toString() === userId ? swap.targetId : swap.requesterId

      // Create feedback
      await SkillSwapDB.createFeedback({
        swapRequestId: new ObjectId(swapId),
        reviewerId: new ObjectId(userId),
        revieweeId: new ObjectId(revieweeId),
        rating,
        feedback: feedback || "",
      })

      // Update user's completed swaps count
      const user = await SkillSwapDB.findUserById(userId)
      if (user) {
        await SkillSwapDB.updateUser(userId, {
          swapsCompleted: user.swapsCompleted + 1,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Swap ${status} successfully`,
      swap: updatedSwap,
    })
  } catch (error) {
    console.error("Error updating swap:", error)
    return NextResponse.json({ success: false, message: "Failed to update swap" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)
    const swapId = params.id

    // Get the swap request
    const swap = await SkillSwapDB.getSwapRequestById(swapId)
    if (!swap) {
      return NextResponse.json({ success: false, message: "Swap request not found" }, { status: 404 })
    }

    // Verify user has permission to delete this swap (only requester can delete)
    if (swap.requesterId.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Only the requester can delete a swap request" },
        { status: 403 },
      )
    }

    // Only allow deletion of pending requests
    if (swap.status !== "pending") {
      return NextResponse.json({ success: false, message: "Can only delete pending requests" }, { status: 400 })
    }

    const deleted = await SkillSwapDB.deleteSwapRequest(swapId)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Failed to delete swap request" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Swap request deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting swap request:", error)
    return NextResponse.json({ success: false, message: "Failed to delete swap request" }, { status: 500 })
  }
}
