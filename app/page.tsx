"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Award, MessageSquare, Plus, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/navigation"

export default function Dashboard() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<"not-marked" | "checked-in" | "checked-out">("not-marked")
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "recognition",
      content: "Great job on the Q4 presentation, John! Your attention to detail was outstanding.",
      badge: "Excellence",
      timestamp: "2 hours ago",
      likes: 12,
    },
    {
      id: 2,
      author: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "thanks",
      content: "Thanks to the entire dev team for staying late to fix the production issue. Team work at its best!",
      badge: "Team Player",
      timestamp: "4 hours ago",
      likes: 8,
    },
    {
      id: 3,
      author: "Lisa Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "mentor",
      content:
        "Remember: Code reviews are not about finding faults, but about learning and improving together. Always be constructive in your feedback.",
      badge: "Mentor",
      timestamp: "1 day ago",
      likes: 15,
    },
  ])
  const [newPost, setNewPost] = useState("")
  const [selectedBadge, setSelectedBadge] = useState("")

  useEffect(() => {
    // Get user location for attendance
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const markAttendance = (type: "check-in" | "check-out") => {
    if (!location) {
      alert("Location access is required for attendance marking")
      return
    }

    // Here you would send the location data to your backend
    console.log(`${type} at location:`, location)
    setAttendanceStatus(type === "check-in" ? "checked-in" : "checked-out")
  }

  const handlePostSubmit = () => {
    if (!newPost.trim() || !selectedBadge) return

    const post = {
      id: feedPosts.length + 1,
      author: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      type: selectedBadge.toLowerCase(),
      content: newPost,
      badge: selectedBadge,
      timestamp: "Just now",
      likes: 0,
    }

    setFeedPosts([post, ...feedPosts])
    setNewPost("")
    setSelectedBadge("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overview Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Welcome back, John Doe
                </CardTitle>
                <CardDescription>
                  Today is{" "}
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">22</p>
                      <p className="text-xs text-muted-foreground">Working Days</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Leave Balance</p>
                      <p className="text-2xl font-bold">8.5</p>
                      <p className="text-xs text-muted-foreground">Days Available</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Recognition</p>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-xs text-muted-foreground">This Quarter</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feed Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Company Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="feed" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="feed">Feed</TabsTrigger>
                    <TabsTrigger value="post">Create Post</TabsTrigger>
                  </TabsList>

                  <TabsContent value="feed" className="space-y-4 mt-4">
                    {feedPosts.map((post) => (
                      <div key={post.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={post.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {post.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{post.author}</span>
                              <Badge variant="secondary">{post.badge}</Badge>
                              <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                            </div>
                            <p className="text-sm">{post.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                👍 {post.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="post" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Share recognition, thanks, or mentoring advice..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex items-center gap-4">
                        <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select badge type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Recognition">Recognition</SelectItem>
                            <SelectItem value="Thanks">Thanks</SelectItem>
                            <SelectItem value="Mentor">Mentor</SelectItem>
                            <SelectItem value="Team Player">Team Player</SelectItem>
                            <SelectItem value="Excellence">Excellence</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handlePostSubmit} disabled={!newPost.trim() || !selectedBadge}>
                          <Plus className="h-4 w-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Attendance & Quick Actions */}
          <div className="space-y-6">
            {/* Attendance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Attendance
                </CardTitle>
                <CardDescription>
                  {location
                    ? `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                    : "Getting location..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge
                    variant={
                      attendanceStatus === "checked-in"
                        ? "default"
                        : attendanceStatus === "checked-out"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {attendanceStatus === "checked-in"
                      ? "Checked In"
                      : attendanceStatus === "checked-out"
                        ? "Checked Out"
                        : "Not Marked"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => markAttendance("check-in")}
                    disabled={attendanceStatus === "checked-in"}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                  <Button
                    onClick={() => markAttendance("check-out")}
                    disabled={attendanceStatus !== "checked-in"}
                    variant="outline"
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                </div>

                {attendanceStatus === "checked-in" && (
                  <div className="text-center text-sm text-muted-foreground">Checked in at 9:15 AM</div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 border rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Christmas Day</p>
                    <p className="text-xs text-muted-foreground">Dec 25, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team Meeting</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Performance Review</p>
                    <p className="text-xs text-muted-foreground">Next Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Apply for Leave
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View Payslip
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Employee Directory
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Performance Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
