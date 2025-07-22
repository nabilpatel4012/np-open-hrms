"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Clock, CheckCircle, XCircle, CalendarIcon } from "lucide-react"
import Navigation from "@/components/navigation"

export default function AttendancePage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<"not-marked" | "checked-in" | "checked-out">("not-marked")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [attendanceHistory, setAttendanceHistory] = useState([
    { date: "2024-01-15", checkIn: "09:15 AM", checkOut: "06:30 PM", hours: "9h 15m", status: "Present" },
    { date: "2024-01-14", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "9h 00m", status: "Present" },
    { date: "2024-01-13", checkIn: "09:30 AM", checkOut: "06:15 PM", hours: "8h 45m", status: "Present" },
    { date: "2024-01-12", checkIn: "10:00 AM", checkOut: "06:45 PM", hours: "8h 45m", status: "Late" },
    { date: "2024-01-11", checkIn: "-", checkOut: "-", hours: "-", status: "Absent" },
  ])

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>
      case "Late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>
      case "Absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track your daily attendance and view history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Attendance Marking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Attendance
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location Status */}
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Location Status</p>
                    <p className="text-sm text-muted-foreground">
                      {location ? `GPS: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Getting location..."}
                    </p>
                  </div>
                  <Badge variant={location ? "default" : "outline"}>{location ? "Located" : "Locating..."}</Badge>
                </div>

                {/* Attendance Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Current Status</p>
                    <p className="text-sm text-muted-foreground">
                      {attendanceStatus === "checked-in"
                        ? "You are checked in"
                        : attendanceStatus === "checked-out"
                          ? "You have checked out"
                          : "Attendance not marked today"}
                    </p>
                  </div>
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

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => markAttendance("check-in")}
                    disabled={attendanceStatus === "checked-in" || !location}
                    size="lg"
                    className="h-16"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div>Check In</div>
                      <div className="text-xs opacity-80">Start your day</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => markAttendance("check-out")}
                    disabled={attendanceStatus !== "checked-in"}
                    variant="outline"
                    size="lg"
                    className="h-16"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div>Check Out</div>
                      <div className="text-xs opacity-80">End your day</div>
                    </div>
                  </Button>
                </div>

                {attendanceStatus === "checked-in" && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-medium">Checked in at 9:15 AM</p>
                    <p className="text-sm text-green-600">Working time: 2h 45m</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance History */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Your recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-medium">{new Date(record.date).getDate()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.date).toLocaleDateString("en-US", { month: "short" })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">
                            {new Date(record.date).toLocaleDateString("en-US", { weekday: "long" })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.checkIn} - {record.checkOut}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{record.hours}</p>
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calendar & Stats */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Monthly Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Working Days</span>
                  <span className="font-bold">22</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Present</span>
                  <span className="font-bold text-green-600">20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Late</span>
                  <span className="font-bold text-yellow-600">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Absent</span>
                  <span className="font-bold text-red-600">1</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Attendance Rate</span>
                    <span className="font-bold text-green-600">95.5%</span>
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
                  Request Attendance Correction
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Download Attendance Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View Team Attendance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
