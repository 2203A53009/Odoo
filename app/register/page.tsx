"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    bio: "",
    isPublic: true,
  })

  const [skillsOffered, setSkillsOffered] = useState<string[]>([])
  const [skillsWanted, setSkillsWanted] = useState<string[]>([])
  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [availability, setAvailability] = useState<string[]>([])

  const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Mornings", "Flexible"]

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()])
      setNewSkillOffered("")
    }
  }

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()])
      setNewSkillWanted("")
    }
  }

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s !== skill))
  }

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter((s) => s !== skill))
  }

  const toggleAvailability = (option: string) => {
    setAvailability((prev) => (prev.includes(option) ? prev.filter((a) => a !== option) : [...prev, option]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log({
      ...formData,
      skillsOffered,
      skillsWanted,
      availability,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
            <CardDescription>Join SkillSwap and start exchanging knowledge with others</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell others about yourself..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Skills Offered */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills You Can Offer</h3>
                <div className="flex gap-2">
                  <Input
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="e.g., Photoshop, Cooking, Guitar"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillOffered())}
                  />
                  <Button type="button" onClick={addSkillOffered}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsOffered.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkillOffered(skill)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills You Want to Learn</h3>
                <div className="flex gap-2">
                  <Input
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="e.g., Excel, Spanish, Web Design"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillWanted())}
                  />
                  <Button type="button" onClick={addSkillWanted}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsWanted.map((skill) => (
                    <Badge key={skill} variant="outline" className="flex items-center gap-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkillWanted(skill)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Availability</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availabilityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={option}
                        checked={availability.includes(option)}
                        onChange={() => toggleAvailability(option)}
                        className="rounded"
                      />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public">Make Profile Public</Label>
                  <p className="text-sm text-gray-500">Allow others to find and contact you</p>
                </div>
                <Switch
                  id="public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Create Profile
                </Button>
                <Link href="/login">
                  <Button type="button" variant="outline">
                    Already have an account?
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
