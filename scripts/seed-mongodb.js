// MongoDB Seed Script for SkillSwap Platform
// Run with: node scripts/seed-mongodb.js

const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skillswap"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("skillswap")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("swapRequests").deleteMany({})
    await db.collection("feedback").deleteMany({})
    await db.collection("reports").deleteMany({})
    await db.collection("adminMessages").deleteMany({})

    console.log("Cleared existing data")

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ isPublic: 1 })
    await db.collection("users").createIndex({ isBanned: 1 })
    await db.collection("swapRequests").createIndex({ requesterId: 1 })
    await db.collection("swapRequests").createIndex({ targetId: 1 })
    await db.collection("swapRequests").createIndex({ status: 1 })
    await db.collection("feedback").createIndex({ revieweeId: 1 })
    await db.collection("reports").createIndex({ status: 1 })

    console.log("Created indexes")

    // Insert sample users (no password hashing)
    const users = [
      {
        _id: new ObjectId(),
        name: "Alice Smith",
        email: "alice@example.com",
        password: "password123",
        location: "San Francisco, CA",
        bio: "Language teacher and tech enthusiast passionate about sharing knowledge",
        skillsOffered: ["Spanish", "French", "Translation", "Teaching"],
        skillsWanted: ["React", "UI/UX Design", "Photography"],
        availability: ["Weekends", "Evenings"],
        isPublic: true,
        rating: 4.9,
        swapsCompleted: 15,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2023-12-01"),
      },
      {
        _id: new ObjectId(),
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        location: "Austin, TX",
        bio: "Musician and music producer with 10+ years of experience",
        skillsOffered: ["Guitar", "Piano", "Music Production", "Songwriting"],
        skillsWanted: ["Photography", "Video Editing", "Marketing"],
        availability: ["Flexible"],
        isPublic: true,
        rating: 4.7,
        swapsCompleted: 8,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        _id: new ObjectId(),
        name: "Carol Davis",
        email: "carol@example.com",
        password: "password123",
        location: "New York, NY",
        bio: "Professional chef and food blogger sharing culinary expertise",
        skillsOffered: ["Cooking", "Baking", "Food Photography", "Recipe Development"],
        skillsWanted: ["Web Development", "SEO", "Social Media Marketing"],
        availability: ["Weekends", "Mornings"],
        isPublic: true,
        rating: 4.8,
        swapsCompleted: 22,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date("2023-11-15"),
        updatedAt: new Date("2023-11-15"),
      },
      {
        _id: new ObjectId(),
        name: "David Wilson",
        email: "david@example.com",
        password: "password123",
        location: "Seattle, WA",
        bio: "Full-stack developer and photography enthusiast",
        skillsOffered: ["React", "Node.js", "Photography", "JavaScript"],
        skillsWanted: ["Spanish", "Guitar", "Cooking"],
        availability: ["Evenings", "Weekdays"],
        isPublic: true,
        rating: 4.6,
        swapsCompleted: 5,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
      },
      {
        _id: new ObjectId(),
        name: "Emma Brown",
        email: "emma@example.com",
        password: "password123",
        location: "Los Angeles, CA",
        bio: "Certified fitness instructor and wellness coach",
        skillsOffered: ["Personal Training", "Yoga", "Nutrition", "Public Speaking"],
        skillsWanted: ["Cooking", "Photography", "Web Design"],
        availability: ["Mornings", "Weekends"],
        isPublic: true,
        rating: 4.9,
        swapsCompleted: 18,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date("2023-10-20"),
        updatedAt: new Date("2023-10-20"),
      },
      {
        _id: new ObjectId(),
        name: "Super Admin",
        email: "2203a53009@sru.edu.in",
        password: "Sri@123",
        location: "Remote",
        bio: "Platform super administrator",
        skillsOffered: [],
        skillsWanted: [],
        availability: [],
        isPublic: false,
        rating: 5.0,
        swapsCompleted: 0,
        isAdmin: true,
        isBanned: false,
        createdAt: new Date("2023-09-01"),
        updatedAt: new Date("2023-09-01"),
      },
    ]

    const insertedUsers = await db.collection("users").insertMany(users)
    console.log(`Inserted ${insertedUsers.insertedCount} users`)

    // Insert sample swap requests
    const swapRequests = [
      {
        _id: new ObjectId(),
        requesterId: users[3]._id, // David
        targetId: users[0]._id, // Alice
        requesterName: "David Wilson",
        targetName: "Alice Smith",
        skillOffered: "React",
        skillWanted: "Spanish",
        message:
          "Hi Alice! I would love to learn Spanish from you in exchange for React lessons. I have 5+ years of experience with React and can teach you everything from basics to advanced concepts.",
        status: "pending",
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      },
      {
        _id: new ObjectId(),
        requesterId: users[0]._id, // Alice
        targetId: users[1]._id, // Bob
        requesterName: "Alice Smith",
        targetName: "Bob Johnson",
        skillOffered: "Spanish",
        skillWanted: "Guitar",
        message:
          "Hi Bob! Would you be interested in trading Spanish lessons for guitar lessons? I am a native speaker and have been teaching for over 5 years.",
        status: "accepted",
        createdAt: new Date("2024-01-14T15:30:00Z"),
        updatedAt: new Date("2024-01-16T09:00:00Z"),
      },
      {
        _id: new ObjectId(),
        requesterId: users[2]._id, // Carol
        targetId: users[3]._id, // David
        requesterName: "Carol Davis",
        targetName: "David Wilson",
        skillOffered: "Cooking",
        skillWanted: "JavaScript",
        message:
          "Hi David! I can teach you professional cooking techniques and recipe development in exchange for JavaScript tutoring. I have 15+ years of culinary experience.",
        status: "pending",
        createdAt: new Date("2024-01-13T12:00:00Z"),
        updatedAt: new Date("2024-01-13T12:00:00Z"),
      },
      {
        _id: new ObjectId(),
        requesterId: users[4]._id, // Emma
        targetId: users[2]._id, // Carol
        requesterName: "Emma Brown",
        targetName: "Carol Davis",
        skillOffered: "Personal Training",
        skillWanted: "Cooking",
        message:
          "Hi Carol! I would love to learn cooking from a professional chef. I can offer personal training sessions and nutrition guidance in return.",
        status: "completed",
        createdAt: new Date("2024-01-10T14:00:00Z"),
        updatedAt: new Date("2024-01-12T16:00:00Z"),
      },
    ]

    const insertedSwaps = await db.collection("swapRequests").insertMany(swapRequests)
    console.log(`Inserted ${insertedSwaps.insertedCount} swap requests`)

    // Insert sample feedback
    const feedback = [
      {
        _id: new ObjectId(),
        swapRequestId: swapRequests[3]._id, // Emma -> Carol completed swap
        reviewerId: users[4]._id, // Emma
        revieweeId: users[2]._id, // Carol
        rating: 5,
        feedback:
          "Carol is an amazing chef! She taught me so many professional techniques and was very patient. The recipes she shared are incredible. Highly recommend learning from her!",
        createdAt: new Date("2024-01-12T18:00:00Z"),
      },
      {
        _id: new ObjectId(),
        swapRequestId: swapRequests[3]._id, // Emma -> Carol completed swap
        reviewerId: users[2]._id, // Carol
        revieweeId: users[4]._id, // Emma
        rating: 5,
        feedback:
          "Emma is a fantastic trainer! Very knowledgeable about fitness and nutrition. She created a personalized workout plan for me and I already see great results. Great experience!",
        createdAt: new Date("2024-01-12T18:30:00Z"),
      },
    ]

    const insertedFeedback = await db.collection("feedback").insertMany(feedback)
    console.log(`Inserted ${insertedFeedback.insertedCount} feedback entries`)

    // Insert sample reports
    const reports = [
      {
        _id: new ObjectId(),
        reporterId: users[0]._id, // Alice
        reportedUserId: users[1]._id, // Bob
        reporterName: "Alice Smith",
        reportedUserName: "Bob Johnson",
        reason: "Inappropriate skill description",
        description:
          "User has listed inappropriate content in their skill descriptions that violates community guidelines.",
        status: "pending",
        createdAt: new Date("2024-01-15T11:00:00Z"),
      },
      {
        _id: new ObjectId(),
        reporterId: users[3]._id, // David
        reportedUserId: users[1]._id, // Bob
        reporterName: "David Wilson",
        reportedUserName: "Bob Johnson",
        reason: "No-show for scheduled swap",
        description:
          "User did not show up for our scheduled skill swap session and did not provide any notice or explanation.",
        status: "pending",
        createdAt: new Date("2024-01-14T16:00:00Z"),
      },
    ]

    const insertedReports = await db.collection("reports").insertMany(reports)
    console.log(`Inserted ${insertedReports.insertedCount} reports`)

    // Insert sample admin messages
    const adminMessages = [
      {
        _id: new ObjectId(),
        title: "Welcome to SkillSwap!",
        content:
          "Welcome to our skill sharing platform! Start by creating your profile, listing your skills, and connecting with other learners. Remember to be respectful and professional in all your interactions.",
        messageType: "announcement",
        isActive: true,
        createdBy: users[5]._id, // Admin
        createdAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        _id: new ObjectId(),
        title: "Platform Maintenance Scheduled",
        content:
          "We have scheduled maintenance this weekend from 2-4 AM EST. The platform may be temporarily unavailable during this time. We apologize for any inconvenience.",
        messageType: "maintenance",
        isActive: true,
        createdBy: users[5]._id, // Admin
        createdAt: new Date("2024-01-14T10:00:00Z"),
      },
    ]

    const insertedMessages = await db.collection("adminMessages").insertMany(adminMessages)
    console.log(`Inserted ${insertedMessages.insertedCount} admin messages`)

    console.log("Database seeded successfully!")
    console.log("\nTest accounts:")
    console.log(
      "Regular users: alice@example.com, bob@example.com, carol@example.com, david@example.com, emma@example.com",
    )
    console.log("Password: password123")
    console.log("\nSuper Admin account: 2203a53009@sru.edu.in")
    console.log("Password: Sri@123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
