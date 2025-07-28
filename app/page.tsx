"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, UserPlus, Calendar, FileText, Building, Loader2 } from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"
import type { Employee, EmployeeTemplate } from "@/lib/models"

interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  totalTemplates: number
  departmentBreakdown: { [key: string]: number }
  recentEmployees: Employee[]
  leaveStats: {
    totalLeaves: number
    pendingLeaves: number
    approvedLeaves: number
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    totalTemplates: 0,
    departmentBreakdown: {},
    recentEmployees: [],
    leaveStats: {
      totalLeaves: 0,
      pendingLeaves: 0,
      approvedLeaves: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch employees and templates
      const [employeesResponse, templatesResponse] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/templates"),
      ])

      if (employeesResponse.ok && templatesResponse.ok) {
        const employees: Employee[] = await employeesResponse.json()
        const templates: EmployeeTemplate[] = await templatesResponse.json()

        // Calculate department breakdown
        const departmentBreakdown = employees.reduce(
          (acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1
            return acc
          },
          {} as { [key: string]: number },
        )

        // Get recent employees (last 5)
        const recentEmployees = employees.slice(0, 5)

        setStats({
          totalEmployees: employees.length,
          activeEmployees: employees.filter((emp) => emp.status === "Active").length,
          totalTemplates: templates.length,
          departmentBreakdown,
          recentEmployees,
          leaveStats: {
            totalLeaves: 0, // Would be calculated from leave applications
            pendingLeaves: 0,
            approvedLeaves: 0,
          },
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      "On Leave": "bg-yellow-100 text-yellow-800",
      Terminated: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{status}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your HRMS dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">{stats.activeEmployees} active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employee Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTemplates}</div>
              <p className="text-xs text-muted-foreground">Ready for onboarding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.departmentBreakdown).length}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leaveStats.pendingLeaves}</div>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>Employee distribution across departments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(stats.departmentBreakdown).map(([department, count]) => (
                <div key={department} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={(count / stats.totalEmployees) * 100} className="w-20" />
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(stats.departmentBreakdown).length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No departments found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Employees */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Employees</CardTitle>
              <CardDescription>Latest additions to the team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{employee.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{employee.position}</p>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>
              ))}
              {stats.recentEmployees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No employees found</p>
                  <Link href="/admin/employees/create">
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Employee
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/employees/create">
                <Button className="w-full bg-transparent" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </Link>
              <Link href="/admin/templates">
                <Button className="w-full bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Templates
                </Button>
              </Link>
              <Link href="/employees">
                <Button className="w-full bg-transparent" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Employees
                </Button>
              </Link>
              <Link href="/leaves">
                <Button className="w-full bg-transparent" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Leave Management
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
