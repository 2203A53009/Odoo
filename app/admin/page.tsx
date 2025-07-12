"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Download,
  Ban,
  CheckCircle,
  XCircle,
  Send,
  Shield,
  ShieldOff,
  Crown,
} from "lucide-react"

// Mock data
const mockStats = {
  totalUsers: 1247,
  activeSwaps: 89,
  pendingReports: 5,
  completedSwaps: 3421,
}

const mockReports = [
  {
    id: 1,
    reporter: "John Doe",
    reported: "Jane Smith",
    reason: "Inappropriate skill description",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: 2,
    reporter: "Alice Johnson",
    reported: "Bob Wilson",
    reason: "No-show for scheduled swap",
    status: "pending",
    date: "2024-01-14",
  },
]

const mockUsers = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    status: "active",
    swaps: 15,
    rating: 4.9,
    joinDate: "2023-12-01",
    isAdmin: false,
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "banned",
    swaps: 3,
    rating: 2.1,
    joinDate: "2024-01-10",
    isAdmin: false,
  },
  {
    id: 3,
    name: "Admin User",
    email: "2203a53009@sru.edu.in",
    status: "active",
    swaps: 0,
    rating: 5.0,
    joinDate: "2023-09-01",
    isAdmin: true,
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [message, setMessage] = useState("")

  const handleBanUser = (userId: number) => {
    console.log(`Banning user ${userId}`)
  }

  const handleUnbanUser = (userId: number) => {
    console.log(`Unbanning user ${userId}`)
  }

  const handleMakeAdmin = (userId: number) => {
    console.log(`Making user ${userId} an admin`)
  }

  const handleRemoveAdmin = (userId: number) => {
    console.log(`Removing admin privileges from user ${userId}`)
  }

  const handleResolveReport = (reportId: number, action: "approve" | "reject") => {
    console.log(`${action} report ${reportId}`)
  }

  const handleSendMessage = () => {
    console.log(`Sending platform message: ${message}`)
    setMessage("")
  }

  const handleDownloadReport = (type: string) => {
    console.log(`Downloading ${type} report`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Badge variant="secondary">Administrator</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Active Swaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeSwaps}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Pending Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{mockStats.pendingReports}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.completedSwaps}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New user registration: Alice Cooper</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Swap completed: React ↔ Spanish</span>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Report filed: Inappropriate content</span>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button onClick={() => handleDownloadReport("users")}>
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
            </div>

            {mockUsers
              .filter((user) => !user.isAdmin)
              .map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs">Swaps: {user.swaps}</span>
                            <span className="text-xs">Rating: {user.rating}</span>
                            <span className="text-xs">Joined: {user.joinDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        {user.status === "active" ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleMakeAdmin(user.id)}>
                              <Crown className="h-4 w-4 mr-1" />
                              Make Admin
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleBanUser(user.id)}>
                              <Ban className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleUnbanUser(user.id)}>
                            Unban
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Admin Management</h3>
              <Badge variant="secondary">{mockUsers.filter((u) => u.isAdmin).length} admins</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Administrators</CardTitle>
                <CardDescription>Manage admin privileges and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers
                    .filter((user) => user.isAdmin)
                    .map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>
                              {admin.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold flex items-center">
                              {admin.name}
                              <Shield className="h-4 w-4 ml-2 text-blue-600" />
                            </h4>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs">Admin since: {admin.joinDate}</span>
                              <Badge variant="secondary">Administrator</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {admin.email !== "2203a53009@sru.edu.in" && (
                            <Button size="sm" variant="outline" onClick={() => handleRemoveAdmin(admin.id)}>
                              <ShieldOff className="h-4 w-4 mr-1" />
                              Remove Admin
                            </Button>
                          )}
                          {admin.email === "2203a53009@sru.edu.in" && <Badge variant="default">Super Admin</Badge>}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Promote Users to Admin</CardTitle>
                <CardDescription>Select users to grant administrator privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUsers
                    .filter((user) => !user.isAdmin && user.status === "active")
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h5 className="font-medium">{user.name}</h5>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Button size="sm" onClick={() => handleMakeAdmin(user.id)}>
                          <Crown className="h-4 w-4 mr-1" />
                          Make Admin
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Content Reports</h3>
              <Badge variant="destructive">{mockReports.length} pending</Badge>
            </div>

            {mockReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">Report #{report.id}</CardTitle>
                      <CardDescription>
                        {report.reporter} reported {report.reported}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{report.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">Reported on: {report.date}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleResolveReport(report.id, "approve")}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Take Action
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleResolveReport(report.id, "reject")}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Platform-wide Message</CardTitle>
                <CardDescription>Send announcements or updates to all users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm">Platform maintenance scheduled for this weekend</p>
                    <p className="text-xs text-gray-500">Sent 2 days ago</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm">Welcome to our new rating system!</p>
                    <p className="text-xs text-gray-500">Sent 1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Download Reports</CardTitle>
                  <CardDescription>Export platform data for analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => handleDownloadReport("user-activity")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    User Activity Report
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => handleDownloadReport("feedback-logs")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Feedback Logs
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => handleDownloadReport("swap-stats")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Swap Statistics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Users (24h)</span>
                      <span className="font-semibold">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Successful Swaps Rate</span>
                      <span className="font-semibold text-green-600">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Rating</span>
                      <span className="font-semibold">4.6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Report Resolution Time</span>
                      <span className="font-semibold">2.3 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
