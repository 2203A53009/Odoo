"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, MessageSquare } from "lucide-react"
import Link from "next/link"

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "Alice Smith",
    location: "San Francisco, CA",
    bio: "Language teacher and tech enthusiast",
    skillsOffered: ["Spanish", "French", "Translation"],
    skillsWanted: ["React", "UI/UX Design"],
    rating: 4.9,
    swapsCompleted: 15,
    availability: ["Weekends", "Evenings"],
  },
  {
    id: 2,
    name: "Bob Johnson",
    location: "Austin, TX",
    bio: "Musician and music producer",
    skillsOffered: ["Guitar", "Music Production", "Songwriting"],
    skillsWanted: ["Photography", "Video Editing"],
    rating: 4.7,
    swapsCompleted: 8,
    availability: ["Flexible"],
  },
  {
    id: 3,
    name: "Carol Davis",
    location: "New York, NY",
    bio: "Professional chef and food blogger",
    skillsOffered: ["Cooking", "Baking", "Food Photography"],
    skillsWanted: ["Web Development", "SEO"],
    rating: 4.8,
    swapsCompleted: 22,
    availability: ["Weekends"],
  },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              SkillSwap
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Skills</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search skills or people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="language">Languages</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="swaps">Most Swaps</SelectItem>
                <SelectItem value="recent">Recently Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {user.location}
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{user.rating}</span>
                      <span className="text-sm text-gray-500 ml-2">({user.swapsCompleted} swaps)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{user.bio}</p>

                <div>
                  <h4 className="text-sm font-medium mb-2">Offers:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Wants:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Available:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.availability.map((time) => (
                      <Badge key={time} variant="default" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Request Swap
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
