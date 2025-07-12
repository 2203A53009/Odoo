"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageSquare, Star, Settings, Search } from "lucide-react"
import Link from "next/link"

// Mock data
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  location: "New York, USA",
  bio: "Passionate about technology and learning new skills",
  skillsOffered: ["React", "Node.js", "Photography"],
  skillsWanted: ["Spanish", "Guitar", "Cooking"],
  availability: ["Weekends", "Evenings"],
  rating: 4.8,
  swapsCompleted: 12,
}

const mockRequests = [
  {
    id: 1,
    type: "incoming",
    from: "Alice Smith",
    skill: "Spanish",
    forSkill: "React",
    status: "pending",
    message: "Hi! I'd love to learn React from you in exchange for Spanish lessons.",
  },
  {
    id: 2,
    type: "outgoing",
    to: "Bob Johnson",
    skill: "Guitar",
    forSkill: "Photography",
    status: "pending",
    message: "Would you be interested in trading guitar lessons for photography tips?",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              SkillSwap
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{mockUser.name}</h3>
                    <p className="text-sm text-gray-500">{mockUser.location}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{mockUser.rating}</span>
                      <span className="text-sm text-gray-500 ml-2">({mockUser.swapsCompleted} swaps)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/browse">
                    <Button className="w-full bg-transparent" variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Skills
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button className="w-full bg-transparent" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockUser.swapsCompleted}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockUser.rating}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Skills */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills I Offer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {mockUser.skillsOffered.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills I Want</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {mockUser.skillsWanted.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Swap Requests</h3>
                  <Badge variant="secondary">{mockRequests.length} pending</Badge>
                </div>

                {mockRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {request.type === "incoming" ? `From ${request.from}` : `To ${request.to}`}
                          </CardTitle>
                          <CardDescription>
                            {request.skill} ↔ {request.forSkill}
                          </CardDescription>
                        </div>
                        <Badge variant={request.type === "incoming" ? "default" : "secondary"}>{request.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{request.message}</p>
                      <div className="flex gap-2">
                        {request.type === "incoming" ? (
                          <>
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="outline">
                              Decline
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline">
                            Cancel Request
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Swap History</CardTitle>
                    <CardDescription>Your completed skill exchanges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      No completed swaps yet. Start browsing skills to make your first exchange!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
