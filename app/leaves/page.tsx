"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, Plus, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import Navigation from "@/components/navigation"

export default function LeavesPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [leaveType, setLeaveType] = useState("")
  const [reason, setReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const leaveBalance = {
    EL: { total: 18, used: 9.5, remaining: 8.5 }, // 1.5 per month
    CL: { total: 4, used: 1, remaining: 3 }, // 1 per 3 months
    PL: { total: 5, used: 0, remaining: 5 }, // Paternity Leave
    ML: { total: 28, used: 0, remaining: 28 }, // Maternity Leave (4 weeks)
    CompOff: { total: 2, used: 0, remaining: 2 }, // Comp off given by admin
  }

  const leaveHistory = [
    {
      id: 1,
      type: "EL",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      days: 3,
      reason: "Family vacation",
      status: "Approved",
      appliedOn: "2024-01-05",
      approver: "Sarah Johnson",
    },
    {
      id: 2,
      type: "CL",
      startDate: "2024-01-08",
      endDate: "2024-01-08",
      days: 1,
      reason: "Medical appointment",
      status: "Approved",
      appliedOn: "2024-01-07",
      approver: "Sarah Johnson",
    },
    {
      id: 3,
      type: "EL",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      days: 2.5,
      reason: "Personal work",
      status: "Pending",
      appliedOn: "2024-01-15",
      approver: "Sarah Johnson",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLeaveTypeName = (type: string) => {
    const types = {
      EL: "Earned Leave",
      CL: "Casual Leave",
      PL: "Paternity Leave",
      ML: "Maternity Leave",
      CompOff: "Comp Off",
    }
    return types[type as keyof typeof types] || type
  }

  const handleLeaveSubmit = () => {
    if (!startDate || !endDate || !leaveType || !reason) {
      alert("Please fill all required fields")
      return
    }

    // Here you would submit the leave application
    console.log({
      startDate,
      endDate,
      leaveType,
      reason,
    })

    setIsDialogOpen(false)
    // Reset form
    setStartDate(undefined)
    setEndDate(undefined)
    setLeaveType("")
    setReason("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Manage your leave applications and view balance</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Fill in the details to submit your leave application</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leave-type">Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EL">Earned Leave (EL) - {leaveBalance.EL.remaining} days remaining</SelectItem>
                      <SelectItem value="CL">Casual Leave (CL) - {leaveBalance.CL.remaining} days remaining</SelectItem>
                      <SelectItem value="PL">
                        Paternity Leave (PL) - {leaveBalance.PL.remaining} days remaining
                      </SelectItem>
                      <SelectItem value="ML">
                        Maternity Leave (ML) - {leaveBalance.ML.remaining} days remaining
                      </SelectItem>
                      <SelectItem value="CompOff">
                        Comp Off - {leaveBalance.CompOff.remaining} days remaining
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLeaveSubmit}>Submit Application</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Leave Balance */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Leave Balance
                </CardTitle>
                <CardDescription>Your current leave entitlements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(leaveBalance).map(([type, balance]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{getLeaveTypeName(type)}</span>
                      <span className="text-sm text-muted-foreground">
                        {balance.remaining}/{balance.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(balance.remaining / balance.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Used: {balance.used}</span>
                      <span>Remaining: {balance.remaining}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Leave Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Earned Leave (EL)</p>
                  <p className="text-muted-foreground">1.5 days per month, can be carried forward</p>
                </div>
                <div>
                  <p className="font-medium">Casual Leave (CL)</p>
                  <p className="text-muted-foreground">1 day per 3 months, cannot be carried forward</p>
                </div>
                <div>
                  <p className="font-medium">Paternity Leave</p>
                  <p className="text-muted-foreground">5 days per year</p>
                </div>
                <div>
                  <p className="font-medium">Maternity Leave</p>
                  <p className="text-muted-foreground">4 weeks (28 days)</p>
                </div>
                <div>
                  <p className="font-medium">Comp Off</p>
                  <p className="text-muted-foreground">Given by admin for extra work</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Leave History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Leave Applications</CardTitle>
                <CardDescription>Your leave application history and status</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4 mt-4">
                    {leaveHistory.map((leave) => (
                      <div key={leave.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{getLeaveTypeName(leave.type)}</Badge>
                              {getStatusBadge(leave.status)}
                            </div>
                            <p className="font-medium">
                              {format(new Date(leave.startDate), "MMM dd")} -{" "}
                              {format(new Date(leave.endDate), "MMM dd, yyyy")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {leave.days} day{leave.days !== 1 ? "s" : ""} • Applied on{" "}
                              {format(new Date(leave.appliedOn), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Reason:</strong> {leave.reason}
                          </p>
                          <p className="text-sm">
                            <strong>Approver:</strong> {leave.approver}
                          </p>
                        </div>

                        {leave.status === "Pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4 mt-4">
                    {leaveHistory
                      .filter((leave) => leave.status === "Pending")
                      .map((leave) => (
                        <div key={leave.id} className="border rounded-lg p-4 space-y-3">
                          {/* Same structure as above */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{getLeaveTypeName(leave.type)}</Badge>
                                {getStatusBadge(leave.status)}
                              </div>
                              <p className="font-medium">
                                {format(new Date(leave.startDate), "MMM dd")} -{" "}
                                {format(new Date(leave.endDate), "MMM dd, yyyy")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {leave.days} day{leave.days !== 1 ? "s" : ""} • Applied on{" "}
                                {format(new Date(leave.appliedOn), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <strong>Reason:</strong> {leave.reason}
                            </p>
                            <p className="text-sm">
                              <strong>Approver:</strong> {leave.approver}
                            </p>
                          </div>
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="approved" className="space-y-4 mt-4">
                    {leaveHistory
                      .filter((leave) => leave.status === "Approved")
                      .map((leave) => (
                        <div key={leave.id} className="border rounded-lg p-4 space-y-3">
                          {/* Same structure as above */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{getLeaveTypeName(leave.type)}</Badge>
                                {getStatusBadge(leave.status)}
                              </div>
                              <p className="font-medium">
                                {format(new Date(leave.startDate), "MMM dd")} -{" "}
                                {format(new Date(leave.endDate), "MMM dd, yyyy")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {leave.days} day{leave.days !== 1 ? "s" : ""} • Applied on{" "}
                                {format(new Date(leave.appliedOn), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <strong>Reason:</strong> {leave.reason}
                            </p>
                            <p className="text-sm">
                              <strong>Approver:</strong> {leave.approver}
                            </p>
                          </div>
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="rejected" className="space-y-4 mt-4">
                    <div className="text-center py-8 text-muted-foreground">No rejected leave applications</div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
