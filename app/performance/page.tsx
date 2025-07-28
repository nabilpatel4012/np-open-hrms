"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Plus, Eye, Star, Target, TrendingUp, Calendar, Award } from "lucide-react"
import Navigation from "@/components/navigation"

export default function PerformancePage() {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [reviewType, setReviewType] = useState("")

  // Mock user role - in real app this would come from auth context
  const userRole = "employee" // "admin", "manager", "employee"

  const performanceReviews = [
    {
      id: 1,
      period: "H2 2023",
      type: "Half-Yearly",
      status: "Completed",
      selfRating: 4.2,
      managerRating: 4.0,
      hrRating: 4.1,
      finalRating: 4.1,
      reviewer: "Sarah Johnson",
      completedDate: "2024-01-15",
      goals: [
        { title: "Complete React Migration", status: "Achieved", rating: 5 },
        { title: "Mentor 2 Junior Developers", status: "Achieved", rating: 4 },
        { title: "Improve Code Coverage to 85%", status: "Partially Achieved", rating: 3 },
      ],
    },
    {
      id: 2,
      period: "H1 2024",
      type: "Half-Yearly",
      status: "In Progress",
      selfRating: null,
      managerRating: null,
      hrRating: null,
      finalRating: null,
      reviewer: "Sarah Johnson",
      completedDate: null,
      goals: [
        { title: "Lead API Redesign Project", status: "In Progress", rating: null },
        { title: "Complete AWS Certification", status: "In Progress", rating: null },
        { title: "Improve Team Collaboration", status: "Not Started", rating: null },
      ],
    },
  ]

  const reviewTemplates = [
    {
      id: 1,
      name: "Technical Skills Assessment",
      sections: ["Technical Expertise", "Problem Solving", "Code Quality", "Innovation"],
    },
    {
      id: 2,
      name: "Leadership Evaluation",
      sections: ["Team Management", "Communication", "Decision Making", "Strategic Thinking"],
    },
    {
      id: 3,
      name: "General Performance Review",
      sections: ["Job Knowledge", "Quality of Work", "Productivity", "Communication", "Teamwork"],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "In Progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "Pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getGoalStatusBadge = (status: string) => {
    switch (status) {
      case "Achieved":
        return <Badge className="bg-green-100 text-green-800">Achieved</Badge>
      case "Partially Achieved":
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Achieved</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "Not Started":
        return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Performance Management</h1>
            <p className="text-muted-foreground">Track and manage performance reviews</p>
          </div>
          {(userRole === "admin" || userRole === "manager") && (
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Performance Review</DialogTitle>
                  <DialogDescription>Set up a new performance review cycle</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="review-period">Review Period</Label>
                    <Input id="review-period" placeholder="e.g., H1 2024" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-type">Review Type</Label>
                    <Select value={reviewType} onValueChange={setReviewType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select review type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly Review</SelectItem>
                        <SelectItem value="half-yearly">Half-Yearly Review</SelectItem>
                        <SelectItem value="annual">Annual Review</SelectItem>
                        <SelectItem value="probation">Probation Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">Review Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {reviewTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsReviewDialogOpen(false)}>Create Review</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Due</CardTitle>
              <Target className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Above 4.5 rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Met</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Rating</p>
                      <p className="text-2xl font-bold">4.1</p>
                      <div className="flex items-center gap-1 mt-1">{renderStars(4.1)}</div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Reviews Completed</p>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-xs text-muted-foreground">This Year</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Goals Achieved</p>
                      <p className="text-2xl font-bold">67%</p>
                      <p className="text-xs text-muted-foreground">2 of 3 goals</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Next Review</p>
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-xs text-muted-foreground">Days remaining</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Review History */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Reviews</CardTitle>
                <CardDescription>Your performance review history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {review.period} - {review.type}
                        </h3>
                        <p className="text-sm text-muted-foreground">Reviewer: {review.reviewer}</p>
                        {review.completedDate && (
                          <p className="text-sm text-muted-foreground">
                            Completed: {new Date(review.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(review.status)}
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {review.status === "Completed" && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground">Self Rating</p>
                          <p className="font-bold text-lg">{review.selfRating}</p>
                          <div className="flex justify-center gap-1 mt-1">{renderStars(review.selfRating!)}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground">Manager Rating</p>
                          <p className="font-bold text-lg">{review.managerRating}</p>
                          <div className="flex justify-center gap-1 mt-1">{renderStars(review.managerRating!)}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground">HR Rating</p>
                          <p className="font-bold text-lg">{review.hrRating}</p>
                          <div className="flex justify-center gap-1 mt-1">{renderStars(review.hrRating!)}</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <p className="text-sm text-muted-foreground">Final Rating</p>
                          <p className="font-bold text-lg text-blue-600">{review.finalRating}</p>
                          <div className="flex justify-center gap-1 mt-1">{renderStars(review.finalRating!)}</div>
                        </div>
                      </div>
                    )}

                    {review.status === "In Progress" && (
                      <div className="flex gap-2">
                        <Button size="sm">Complete Self Assessment</Button>
                        <Button variant="outline" size="sm">
                          Save Draft
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Goals & Objectives</CardTitle>
                <CardDescription>Track your performance goals and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {performanceReviews.map((review) => (
                  <div key={review.id} className="space-y-4">
                    <h3 className="font-semibold text-lg">{review.period}</h3>
                    <div className="space-y-3">
                      {review.goals.map((goal, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{goal.title}</h4>
                            {getGoalStatusBadge(goal.status)}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Progress
                                value={
                                  goal.status === "Achieved"
                                    ? 100
                                    : goal.status === "Partially Achieved"
                                      ? 60
                                      : goal.status === "In Progress"
                                        ? 40
                                        : 0
                                }
                                className="h-2"
                              />
                            </div>
                            {goal.rating && (
                              <div className="flex items-center gap-1">
                                {renderStars(goal.rating)}
                                <span className="text-sm font-medium ml-1">{goal.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Templates</CardTitle>
                <CardDescription>Available performance review templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{template.name}</h3>
                      {userRole === "admin" && (
                        <Button variant="outline" size="sm">
                          Edit Template
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Sections:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.sections.map((section, index) => (
                          <Badge key={index} variant="outline">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {userRole === "admin" && (
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Template
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
