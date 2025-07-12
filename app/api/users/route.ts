import { type NextRequest, NextResponse } from "next/server"
import { SkillSwapDB } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const skill = searchParams.get("skill")

    const users = await SkillSwapDB.findPublicUsers(search || undefined, skill || undefined)

    // Remove sensitive information
    const publicUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      location: user.location,
      bio: user.bio,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      availability: user.availability,
      rating: user.rating,
      swapsCompleted: user.swapsCompleted,
      createdAt: user.createdAt,
    }))

    return NextResponse.json({
      success: true,
      users: publicUsers,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 })
  }
}
