"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Building, Mail, MapPin, Eye, Filter } from "lucide-react"
import Navigation from "@/components/navigation"

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const employees = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
      department: "Engineering",
      position: "Senior Software Engineer",
      manager: "Sarah Johnson",
      location: "New York, NY",
      avatar: "/placeholder.svg?height=40&width=40",
      employeeId: "EMP001",
      joinDate: "2022-01-15",
      status: "Active",
      ctc: "$95,000",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 234-5678",
      department: "Engineering",
      position: "Engineering Manager",
      manager: "Mike Chen",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg?height=40&width=40",
      employeeId: "EMP002",
      joinDate: "2021-03-10",
      status: "Active",
      ctc: "$120,000",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@company.com",
      phone: "+1 (555) 345-6789",
      department: "Engineering",
      position: "VP Engineering",
      manager: "Lisa Rodriguez",
      location: "Austin, TX",
      avatar: "/placeholder.svg?height=40&width=40",
      employeeId: "EMP003",
      joinDate: "2020-06-01",
      status: "Active",
      ctc: "$150,000",
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      department: "Human Resources",
      position: "HR Director",
      manager: "CEO",
      location: "Chicago, IL",
      avatar: "/placeholder.svg?height=40&width=40",
      employeeId: "EMP004",
      joinDate: "2019-09-15",
      status: "Active",
      ctc: "$110,000",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@company.com",
      phone: "+1 (555) 567-8901",
      department: "Marketing",
      position: "Marketing Manager",
      manager: "Jennifer Lee",
      location: "Los Angeles, CA",
      avatar: "/placeholder.svg?height=40&width=40",
      employeeId: "EMP005",
      joinDate: "2022-08-20",
      status: "Active",
      ctc: "$85,000",
    },
    {
      id: 6,
      name: "Jennifer Lee",
      email: "jennifer.lee@company.com",
      phone: "+1 (555) 678-9012",
      department: "Marketing",
      position: "VP Marketing",
      manager: "CEO",
      location: "Seattle, WA",
      avatar: "/placeholder.svg?height=40&width=40",
      employeeId: "EMP006",
      joinDate: "2021-11-05",
      status: "Active",
      ctc: "$130,000",
    },
  ]

  const departments = ["Engineering", "Human Resources", "Marketing", "Sales", "Finance", "Operations"]

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "Inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "On Leave":
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const buildHierarchy = () => {
    const hierarchy: any = {}
    const roots: any[] = []

    employees.forEach((employee) => {
      hierarchy[employee.name] = { ...employee, children: [] }
    })

    employees.forEach((employee) => {
      if (employee.manager && employee.manager !== "CEO" && hierarchy[employee.manager]) {
        hierarchy[employee.manager].children.push(hierarchy[employee.name])
      } else {
        roots.push(hierarchy[employee.name])
      }
    })

    return roots
  }

  const renderHierarchyNode = (node: any, level = 0) => (
    <div key={node.id} className={`ml-${level * 4}`}>
      <div className="flex items-center gap-3 p-3 border rounded-lg mb-2">
        <Avatar>
          <AvatarImage src={node.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            {node.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{node.name}</p>
          <p className="text-sm text-muted-foreground">{node.position}</p>
        </div>
        <Badge variant="outline">{node.department}</Badge>
      </div>
      {node.children.map((child: any) => renderHierarchyNode(child, level + 1))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground">Search and view employee information</p>
        </div>

        <Tabs defaultValue="directory" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="directory">Employee Directory</TabsTrigger>
            <TabsTrigger value="hierarchy">Organization Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, ID, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by department" />
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
                </div>
              </CardContent>
            </Card>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                        </div>
                      </div>
                      {getStatusBadge(employee.status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.position}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.location}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No employees found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hierarchy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Hierarchy
                </CardTitle>
                <CardDescription>Visual representation of the company structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">{buildHierarchy().map((node) => renderHierarchyNode(node))}</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Employee Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedEmployee && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedEmployee.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedEmployee.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{selectedEmployee.name}</div>
                      <div className="text-sm font-normal text-muted-foreground">{selectedEmployee.employeeId}</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Position</Label>
                      <p className="font-medium">{selectedEmployee.position}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                      <p className="font-medium">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Manager</Label>
                      <p className="font-medium">{selectedEmployee.manager}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                      <p className="font-medium">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="font-medium">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p className="font-medium">{selectedEmployee.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">CTC</Label>
                      <p className="font-medium">{selectedEmployee.ctc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
