"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SwapRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SwapRequestData) => void
  targetUser: {
    name: string
    skillsOffered: string[]
  }
  currentUserSkills: string[]
}

interface SwapRequestData {
  skillWanted: string
  skillOffered: string
  message: string
}

export function SwapRequestModal({ isOpen, onClose, onSubmit, targetUser, currentUserSkills }: SwapRequestModalProps) {
  const [skillWanted, setSkillWanted] = useState("")
  const [skillOffered, setSkillOffered] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (skillWanted && skillOffered && message.trim()) {
      onSubmit({
        skillWanted,
        skillOffered,
        message,
      })
      setSkillWanted("")
      setSkillOffered("")
      setMessage("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Skill Swap</DialogTitle>
          <DialogDescription>Send a swap request to {targetUser.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="skill-wanted">Skill you want to learn</Label>
            <Select value={skillWanted} onValueChange={setSkillWanted}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {targetUser.skillsOffered.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="skill-offered">Skill you can offer</Label>
            <Select value={skillOffered} onValueChange={setSkillOffered}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {currentUserSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain what you're looking for..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!skillWanted || !skillOffered || !message.trim()}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
