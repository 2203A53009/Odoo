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

    const db = await SkillSwapDB.getDatabase()
    const users = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray()

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      rating: user.rating,
      swapsCompleted: user.swapsCompleted,
      isBanned: user.isBanned,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    }))

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    })
  } catch (error) {
    console.error("Error fetching users for admin:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const { userId, isAdmin } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing user ID" }, { status: 400 })
    }

    const db = await SkillSwapDB.getDatabase()
    const result = await db.collection("users").updateOne({ _id: userId }, { $set: { isAdmin } })

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found or admin status not updated" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, message: "User admin status updated successfully" })
  } catch (error) {
    console.error("Error updating user admin status:", error)
    return NextResponse.json({ success: false, message: "Failed to update user admin status" }, { status: 500 })
  }
}
