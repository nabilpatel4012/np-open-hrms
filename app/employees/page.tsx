"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, UserPlus, Mail, Phone, MapPin, FileIcon as FileTemplate, Users, Loader2 } from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"
import type { Employee, EmployeeTemplate } from "@/lib/models"

interface EmployeeWithTemplate extends Employee {
  employee_templates?: {
    name: string
    department: string
    position: string
  }
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeWithTemplate[]>([])
  const [templates, setTemplates] = useState<EmployeeTemplate[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
    fetchTemplates()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm, departmentFilter, statusFilter])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  const filterEmployees = () => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((employee) => employee.department === departmentFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((employee) => employee.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }

  const getTemplateName = (employee: EmployeeWithTemplate) => {
    if (employee.employee_templates) {
      return employee.employee_templates.name
    }
    if (employee.template_id) {
      const template = templates.find((t) => t.id === employee.template_id)
      return template ? template.name : "Unknown Template"
    }
    return "Custom"
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

  const getLevelBadge = (level: string) => {
    const colors = {
      Junior: "bg-blue-100 text-blue-800",
      Mid: "bg-purple-100 text-purple-800",
      Senior: "bg-orange-100 text-orange-800",
      Lead: "bg-red-100 text-red-800",
      Manager: "bg-gray-100 text-gray-800",
      Director: "bg-black text-white",
    }
    return <Badge className={colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{level}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const departments = [...new Set(employees.map((emp) => emp.department))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading employees...</p>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your team members and their information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/admin/employees/create">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.position}</CardDescription>
                      <p className="text-xs text-muted-foreground">ID: {employee.employee_id}</p>
                    </div>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <Badge variant="outline">{employee.department}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Level:</span>
                  {getLevelBadge(employee.level)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Template:</span>
                  <div className="flex items-center gap-1">
                    <FileTemplate className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{getTemplateName(employee)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">CTC:</span>
                  <span className="font-medium">{formatCurrency(employee.total_ctc)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Manager:</span>
                  <span className="text-sm">{employee.manager || "Not assigned"}</span>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {employee.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {employee.phone || "Not provided"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {employee.location || "Not specified"}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm font-medium">{employee.el_remaining}</p>
                      <p className="text-xs text-muted-foreground">EL Left</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{employee.cl_remaining}</p>
                      <p className="text-xs text-muted-foreground">CL Left</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{new Date(employee.join_date).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Join Date</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No employees found</h3>
              <p className="text-muted-foreground mb-4">
                {employees.length === 0
                  ? "Get started by adding your first employee"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {employees.length === 0 && (
                <Link href="/admin/employees/create">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Employee
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
