"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Settings, Users } from "lucide-react"
import Navigation from "@/components/navigation"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false)
  const [holidayName, setHolidayName] = useState("")
  const [holidayType, setHolidayType] = useState("")
  const [holidayDescription, setHolidayDescription] = useState("")

  // Mock user role - in real app this would come from auth context
  const userRole = "admin" // "admin", "manager", "employee"

  const holidays = [
    { date: "2024-01-01", name: "New Year's Day", type: "National", description: "Public holiday" },
    { date: "2024-01-26", name: "Republic Day", type: "National", description: "National holiday" },
    { date: "2024-03-08", name: "Holi", type: "Festival", description: "Festival of colors" },
    { date: "2024-08-15", name: "Independence Day", type: "National", description: "National holiday" },
    { date: "2024-10-02", name: "Gandhi Jayanti", type: "National", description: "National holiday" },
    { date: "2024-10-24", name: "Dussehra", type: "Festival", description: "Hindu festival" },
    { date: "2024-11-12", name: "Diwali", type: "Festival", description: "Festival of lights" },
    { date: "2024-12-25", name: "Christmas Day", type: "National", description: "Christian holiday" },
  ]

  const teamLeaves = [
    { date: "2024-01-15", employee: "John Doe", type: "EL", status: "Approved" },
    { date: "2024-01-16", employee: "Jane Smith", type: "CL", status: "Approved" },
    { date: "2024-01-20", employee: "Mike Johnson", type: "EL", status: "Pending" },
  ]

  const getHolidayForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return holidays.find((holiday) => holiday.date === dateStr)
  }

  const getLeaveForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return teamLeaves.filter((leave) => leave.date === dateStr)
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  const getHolidayTypeBadge = (type: string) => {
    switch (type) {
      case "National":
        return <Badge className="bg-red-100 text-red-800">National</Badge>
      case "Festival":
        return <Badge className="bg-purple-100 text-purple-800">Festival</Badge>
      case "Regional":
        return <Badge className="bg-blue-100 text-blue-800">Regional</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleAddHoliday = () => {
    if (!selectedDate || !holidayName || !holidayType) {
      alert("Please fill all required fields")
      return
    }

    // Here you would add the holiday to your backend
    console.log({
      date: selectedDate,
      name: holidayName,
      type: holidayType,
      description: holidayDescription,
    })

    setIsHolidayDialogOpen(false)
    // Reset form
    setHolidayName("")
    setHolidayType("")
    setHolidayDescription("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Holiday Calendar</h1>
            <p className="text-muted-foreground">View company holidays and team schedules</p>
          </div>
          {userRole === "admin" && (
            <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Holiday</DialogTitle>
                  <DialogDescription>Add a new holiday to the company calendar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="holiday-name">Holiday Name</Label>
                    <Input
                      id="holiday-name"
                      placeholder="e.g., Christmas Day"
                      value={holidayName}
                      onChange={(e) => setHolidayName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holiday-type">Holiday Type</Label>
                    <Select value={holidayType} onValueChange={setHolidayType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select holiday type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="National">National Holiday</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="Regional">Regional Holiday</SelectItem>
                        <SelectItem value="Company">Company Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holiday-description">Description (Optional)</Label>
                    <Textarea
                      id="holiday-description"
                      placeholder="Brief description of the holiday..."
                      value={holidayDescription}
                      onChange={(e) => setHolidayDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsHolidayDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHoliday}>Add Holiday</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar View
                </CardTitle>
                <CardDescription>
                  {selectedDate &&
                    `Selected: ${selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    holiday: (date) => !!getHolidayForDate(date),
                    weekend: isWeekend,
                    hasLeave: (date) => getLeaveForDate(date).length > 0,
                  }}
                  modifiersStyles={{
                    holiday: { backgroundColor: "#fef2f2", color: "#dc2626", fontWeight: "bold" },
                    weekend: { backgroundColor: "#f3f4f6", color: "#6b7280" },
                    hasLeave: { backgroundColor: "#eff6ff", color: "#2563eb" },
                  }}
                />

                {/* Selected Date Details */}
                {selectedDate && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>

                    {/* Holiday Info */}
                    {getHolidayForDate(selectedDate) && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-800">Holiday</span>
                          {getHolidayTypeBadge(getHolidayForDate(selectedDate)!.type)}
                        </div>
                        <p className="font-semibold text-red-900">{getHolidayForDate(selectedDate)!.name}</p>
                        <p className="text-sm text-red-700">{getHolidayForDate(selectedDate)!.description}</p>
                      </div>
                    )}

                    {/* Weekend Info */}
                    {isWeekend(selectedDate) && !getHolidayForDate(selectedDate) && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-800">Weekend</span>
                        </div>
                      </div>
                    )}

                    {/* Team Leaves */}
                    {getLeaveForDate(selectedDate).length > 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Team Leaves</span>
                        </div>
                        <div className="space-y-1">
                          {getLeaveForDate(selectedDate).map((leave, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-blue-900">{leave.employee}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {leave.type}
                                </Badge>
                                <Badge
                                  variant={leave.status === "Approved" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {leave.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular Working Day */}
                    {!getHolidayForDate(selectedDate) &&
                      !isWeekend(selectedDate) &&
                      getLeaveForDate(selectedDate).length === 0 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800">Working Day</span>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Holiday List & Legend */}
          <div className="space-y-6">
            {/* Upcoming Holidays */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Holidays</CardTitle>
                <CardDescription>Next holidays in the calendar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {holidays
                  .filter((holiday) => new Date(holiday.date) >= new Date())
                  .slice(0, 5)
                  .map((holiday, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{holiday.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(holiday.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {getHolidayTypeBadge(holiday.type)}
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Calendar Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-sm">Holidays</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                  <span className="text-sm">Weekends</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="text-sm">Team Leaves</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-sm">Working Days</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Days</span>
                  <span className="font-bold">31</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Working Days</span>
                  <span className="font-bold">22</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Holidays</span>
                  <span className="font-bold text-red-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Weekends</span>
                  <span className="font-bold text-gray-600">8</span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {userRole === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Manage Holiday Templates
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Import Holidays
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Export Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Regional Settings
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
