import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { SkillSwapDB } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, location, bio, skillsOffered, skillsWanted, availability, isPublic } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await SkillSwapDB.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User with this email already exists" }, { status: 400 })
    }

    // Create user (no password hashing)
    const user = await SkillSwapDB.createUser({
      name,
      email,
      password, // Store plain text password
      location: location || "",
      bio: bio || "",
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
      availability: availability || [],
      isPublic: isPublic !== false,
      rating: 0,
      swapsCompleted: 0,
      isAdmin: false,
      isBanned: false,
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        availability: user.availability,
        isPublic: user.isPublic,
        rating: user.rating,
        swapsCompleted: user.swapsCompleted,
        isAdmin: user.isAdmin,
      },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 })
  }
}
