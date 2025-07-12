import { MongoClient, type Db, ObjectId } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

// Database schemas and interfaces
export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  location?: string
  bio?: string
  profilePhotoUrl?: string
  skillsOffered: string[]
  skillsWanted: string[]
  availability: string[]
  isPublic: boolean
  rating: number
  swapsCompleted: number
  isAdmin: boolean
  isBanned: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SwapRequest {
  _id?: ObjectId
  requesterId: ObjectId
  targetId: ObjectId
  requesterName: string
  targetName: string
  skillOffered: string
  skillWanted: string
  message: string
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface Feedback {
  _id?: ObjectId
  swapRequestId: ObjectId
  reviewerId: ObjectId
  revieweeId: ObjectId
  rating: number
  feedback: string
  createdAt: Date
}

export interface Report {
  _id?: ObjectId
  reporterId: ObjectId
  reportedUserId: ObjectId
  reportedUserName: string
  reporterName: string
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  adminNotes?: string
  createdAt: Date
  resolvedAt?: Date
}

export interface AdminMessage {
  _id?: ObjectId
  title: string
  content: string
  messageType: "announcement" | "maintenance" | "update"
  isActive: boolean
  createdBy: ObjectId
  createdAt: Date
}

// Database operations
export class SkillSwapDB {
  private static db: Db

  static async getDatabase(): Promise<Db> {
    if (!this.db) {
      const client = await clientPromise
      this.db = client.db("skillswap")
    }
    return this.db
  }

  // User operations
  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")

    const user: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")
    return await users.findOne({ email })
  }

  static async findUserById(id: string | ObjectId): Promise<User | null> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")
    return await users.findOne({ _id: new ObjectId(id) })
  }

  static async findPublicUsers(searchTerm?: string, skill?: string): Promise<User[]> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")

    const query: any = { isPublic: true, isBanned: false }

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { skillsOffered: { $in: [new RegExp(searchTerm, "i")] } },
        { skillsWanted: { $in: [new RegExp(searchTerm, "i")] } },
      ]
    }

    if (skill) {
      query.skillsOffered = { $in: [new RegExp(skill, "i")] }
    }

    return await users.find(query).toArray()
  }

  static async updateUser(id: string | ObjectId, updates: Partial<User>): Promise<User | null> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    return result.value
  }

  static async banUser(id: string | ObjectId): Promise<boolean> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")

    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: { isBanned: true, updatedAt: new Date() } })

    return result.modifiedCount > 0
  }

  static async unbanUser(id: string | ObjectId): Promise<boolean> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")

    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isBanned: false, updatedAt: new Date() } },
    )

    return result.modifiedCount > 0
  }

  static async makeAdmin(id: string | ObjectId): Promise<boolean> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")

    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: { isAdmin: true, updatedAt: new Date() } })

    return result.modifiedCount > 0
  }

  static async removeAdmin(id: string | ObjectId): Promise<boolean> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")

    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: { isAdmin: false, updatedAt: new Date() } })

    return result.modifiedCount > 0
  }

  static async getAllUsers(): Promise<User[]> {
    const db = await this.getDatabase()
    const users = db.collection<User>("users")
    return await users.find({}).sort({ createdAt: -1 }).toArray()
  }

  // Swap request operations
  static async createSwapRequest(
    requestData: Omit<SwapRequest, "_id" | "createdAt" | "updatedAt">,
  ): Promise<SwapRequest> {
    const db = await this.getDatabase()
    const swapRequests = db.collection<SwapRequest>("swapRequests")

    const swapRequest: SwapRequest = {
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await swapRequests.insertOne(swapRequest)
    return { ...swapRequest, _id: result.insertedId }
  }

  static async getUserSwapRequests(userId: string | ObjectId): Promise<SwapRequest[]> {
    const db = await this.getDatabase()
    const swapRequests = db.collection<SwapRequest>("swapRequests")

    return await swapRequests
      .find({
        $or: [{ requesterId: new ObjectId(userId) }, { targetId: new ObjectId(userId) }],
      })
      .sort({ createdAt: -1 })
      .toArray()
  }

  static async updateSwapRequest(
    swapId: string | ObjectId,
    updates: Partial<SwapRequest>,
  ): Promise<SwapRequest | null> {
    const db = await this.getDatabase()
    const swapRequests = db.collection<SwapRequest>("swapRequests")

    const result = await swapRequests.findOneAndUpdate(
      { _id: new ObjectId(swapId) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    return result.value
  }

  static async deleteSwapRequest(swapId: string | ObjectId): Promise<boolean> {
    const db = await this.getDatabase()
    const swapRequests = db.collection<SwapRequest>("swapRequests")

    const result = await swapRequests.deleteOne({ _id: new ObjectId(swapId) })
    return result.deletedCount > 0
  }

  static async getSwapRequestById(swapId: string | ObjectId): Promise<SwapRequest | null> {
    const db = await this.getDatabase()
    const swapRequests = db.collection<SwapRequest>("swapRequests")

    return await swapRequests.findOne({ _id: new ObjectId(swapId) })
  }

  // Feedback operations
  static async createFeedback(feedbackData: Omit<Feedback, "_id" | "createdAt">): Promise<Feedback> {
    const db = await this.getDatabase()
    const feedback = db.collection<Feedback>("feedback")

    const feedbackDoc: Feedback = {
      ...feedbackData,
      createdAt: new Date(),
    }

    const result = await feedback.insertOne(feedbackDoc)

    // Update user rating
    await this.updateUserRating(feedbackData.revieweeId)

    return { ...feedbackDoc, _id: result.insertedId }
  }

  static async getUserFeedback(userId: string | ObjectId): Promise<Feedback[]> {
    const db = await this.getDatabase()
    const feedback = db.collection<Feedback>("feedback")

    return await feedback
      .find({ revieweeId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
  }

  private static async updateUserRating(userId: ObjectId): Promise<void> {
    const db = await this.getDatabase()
    const feedback = db.collection<Feedback>("feedback")
    const users = db.collection<User>("users")

    const userFeedback = await feedback.find({ revieweeId: userId }).toArray()

    if (userFeedback.length > 0) {
      const averageRating = userFeedback.reduce((sum, f) => sum + f.rating, 0) / userFeedback.length
      await users.updateOne(
        { _id: userId },
        { $set: { rating: Math.round(averageRating * 10) / 10, updatedAt: new Date() } },
      )
    }
  }

  // Report operations
  static async createReport(reportData: Omit<Report, "_id" | "createdAt">): Promise<Report> {
    const db = await this.getDatabase()
    const reports = db.collection<Report>("reports")

    const report: Report = {
      ...reportData,
      createdAt: new Date(),
    }

    const result = await reports.insertOne(report)
    return { ...report, _id: result.insertedId }
  }

  static async getPendingReports(): Promise<Report[]> {
    const db = await this.getDatabase()
    const reports = db.collection<Report>("reports")

    return await reports.find({ status: "pending" }).sort({ createdAt: -1 }).toArray()
  }

  static async updateReport(reportId: string | ObjectId, updates: Partial<Report>): Promise<Report | null> {
    const db = await this.getDatabase()
    const reports = db.collection<Report>("reports")

    const updateData = { ...updates }
    if (updates.status === "resolved" || updates.status === "dismissed") {
      updateData.resolvedAt = new Date()
    }

    const result = await reports.findOneAndUpdate(
      { _id: new ObjectId(reportId) },
      { $set: updateData },
      { returnDocument: "after" },
    )

    return result.value
  }

  // Admin message operations
  static async createAdminMessage(messageData: Omit<AdminMessage, "_id" | "createdAt">): Promise<AdminMessage> {
    const db = await this.getDatabase()
    const adminMessages = db.collection<AdminMessage>("adminMessages")

    const message: AdminMessage = {
      ...messageData,
      createdAt: new Date(),
    }

    const result = await adminMessages.insertOne(message)
    return { ...message, _id: result.insertedId }
  }

  static async getActiveAdminMessages(): Promise<AdminMessage[]> {
    const db = await this.getDatabase()
    const adminMessages = db.collection<AdminMessage>("adminMessages")

    return await adminMessages.find({ isActive: true }).sort({ createdAt: -1 }).toArray()
  }

  // Analytics operations
  static async getAnalytics() {
    const db = await this.getDatabase()

    const totalUsers = await db.collection("users").countDocuments({ isBanned: false })
    const activeSwaps = await db.collection("swapRequests").countDocuments({
      status: { $in: ["pending", "accepted"] },
    })
    const completedSwaps = await db.collection("swapRequests").countDocuments({ status: "completed" })
    const pendingReports = await db.collection("reports").countDocuments({ status: "pending" })

    // Get active users in last 24 hours (mock for now)
    const activeUsers24h = Math.floor(totalUsers * 0.3)

    // Calculate success rate
    const totalSwapRequests = await db.collection("swapRequests").countDocuments()
    const successRate = totalSwapRequests > 0 ? Math.round((completedSwaps / totalSwapRequests) * 100) : 0

    // Get average rating
    const avgRatingResult = await db
      .collection("users")
      .aggregate([
        { $match: { isBanned: false, rating: { $gt: 0 } } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ])
      .toArray()

    const averageRating = avgRatingResult.length > 0 ? Math.round(avgRatingResult[0].avgRating * 10) / 10 : 0

    return {
      totalUsers,
      activeSwaps,
      completedSwaps,
      pendingReports,
      activeUsers24h,
      successRate,
      averageRating,
    }
  }
}
