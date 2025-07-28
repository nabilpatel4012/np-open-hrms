"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, UserPlus, FileIcon as FileTemplate, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import Navigation from "@/components/navigation"
import type { EmployeeTemplate } from "@/lib/models"

export default function CreateEmployeePage() {
  const [templates, setTemplates] = useState<EmployeeTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmployeeTemplate | null>(null)
  const [joinDate, setJoinDate] = useState<Date>()
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    department: "",
    position: "",
    level: "",
    manager: "",
    location: "",
    employment_type: "Full-time" as const,
    status: "Active" as const,
    basic_salary: 0,
    hra: 0,
    allowances: 0,
    bonus: 0,
    el_total: 0,
    el_used: 0,
    cl_total: 0,
    cl_used: 0,
    pl_total: 0,
    pl_used: 0,
    ml_total: 0,
    ml_used: 0,
    comp_off_total: 0,
    comp_off_used: 0,
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch templates",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)

      // Pre-fill form with template data
      setEmployeeData((prev) => ({
        ...prev,
        department: template.department,
        position: template.position,
        level: template.level,
        basic_salary: template.basic_salary,
        hra: template.hra,
        allowances: template.allowances,
        bonus: template.bonus,
        el_total: template.earned_leave,
        el_used: 0,
        cl_total: template.casual_leave,
        cl_used: 0,
        pl_total: template.paternity_leave,
        pl_used: 0,
        ml_total: template.maternity_leave,
        ml_used: 0,
        comp_off_total: template.comp_off,
        comp_off_used: 0,
      }))
    }
  }

  const handleCreateEmployee = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a template",
        variant: "destructive",
      })
      return
    }

    if (!employeeData.name || !employeeData.email) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const finalData = {
        ...employeeData,
        template_id: selectedTemplate.id,
        date_of_birth: dateOfBirth?.toISOString().split("T")[0] || null,
        join_date: joinDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        created_by: "Admin", // In real app, get from auth context
      }

      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Employee created successfully",
        })
        // Redirect to employees page
        window.location.href = "/employees"
      } else {
        toast({
          title: "Error",
          description: "Failed to create employee",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating employee:", error)
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateTotalCTC = () => {
    return employeeData.basic_salary + employeeData.hra + employeeData.allowances + employeeData.bonus
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading templates...</p>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Employee</h1>
          <p className="text-muted-foreground">Add a new employee using templates for consistent onboarding</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTemplate className="h-5 w-5" />
                  Select Template
                </CardTitle>
                <CardDescription>Choose a template to pre-fill employee details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTemplateSelect(template.id!)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{template.department}</p>
                    <p className="text-xs font-medium">{formatCurrency(template.total_ctc)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedTemplate && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Template Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="font-medium">{selectedTemplate.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CTC:</span>
                    <span className="font-medium">{formatCurrency(selectedTemplate.total_ctc)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Leaves:</span>
                    <span className="font-medium">
                      {selectedTemplate.earned_leave + selectedTemplate.casual_leave} days
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Employee Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Employee Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="work">Work Info</TabsTrigger>
                    <TabsTrigger value="compensation">Compensation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Enter full name"
                          value={employeeData.name}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={employeeData.email}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          placeholder="Enter phone number"
                          value={employeeData.phone}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        placeholder="Enter full address"
                        value={employeeData.address}
                        onChange={(e) =>
                          setEmployeeData({
                            ...employeeData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Emergency Contact</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Contact Name</Label>
                          <Input
                            placeholder="Enter name"
                            value={employeeData.emergency_contact_name}
                            onChange={(e) =>
                              setEmployeeData({
                                ...employeeData,
                                emergency_contact_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Phone</Label>
                          <Input
                            placeholder="Enter phone"
                            value={employeeData.emergency_contact_phone}
                            onChange={(e) =>
                              setEmployeeData({
                                ...employeeData,
                                emergency_contact_phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Relationship</Label>
                          <Input
                            placeholder="e.g., Spouse, Parent"
                            value={employeeData.emergency_contact_relation}
                            onChange={(e) =>
                              setEmployeeData({
                                ...employeeData,
                                emergency_contact_relation: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="work" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          disabled={!!selectedTemplate}
                          value={employeeData.department}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              department: e.target.value,
                            })
                          }
                        />
                        {selectedTemplate && <p className="text-xs text-muted-foreground">Pre-filled from template</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          disabled={!!selectedTemplate}
                          value={employeeData.position}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              position: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Level</Label>
                        <Select
                          disabled={!!selectedTemplate}
                          value={employeeData.level}
                          onValueChange={(value) =>
                            setEmployeeData({
                              ...employeeData,
                              level: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Mid">Mid</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Lead">Lead</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Director">Director</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Manager</Label>
                        <Input
                          placeholder="Enter manager name"
                          value={employeeData.manager}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              manager: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="Enter work location"
                          value={employeeData.location}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Join Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {joinDate ? format(joinDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={joinDate} onSelect={setJoinDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Employment Type</Label>
                      <Select
                        value={employeeData.employment_type}
                        onValueChange={(value: any) =>
                          setEmployeeData({
                            ...employeeData,
                            employment_type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="compensation" className="space-y-4">
                    {selectedTemplate && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Template: {selectedTemplate.name}</h4>
                        <p className="text-sm text-blue-800">
                          Compensation details are pre-filled from the selected template
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Basic Salary</Label>
                        <Input
                          type="number"
                          disabled={!!selectedTemplate}
                          value={employeeData.basic_salary}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              basic_salary: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>HRA</Label>
                        <Input
                          type="number"
                          disabled={!!selectedTemplate}
                          value={employeeData.hra}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              hra: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Other Allowances</Label>
                        <Input
                          type="number"
                          disabled={!!selectedTemplate}
                          value={employeeData.allowances}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              allowances: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Performance Bonus</Label>
                        <Input
                          type="number"
                          disabled={!!selectedTemplate}
                          value={employeeData.bonus}
                          onChange={(e) =>
                            setEmployeeData({
                              ...employeeData,
                              bonus: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-900">Total CTC:</span>
                        <span className="text-xl font-bold text-green-900">{formatCurrency(calculateTotalCTC())}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Leave Entitlements</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground">Earned Leave</p>
                          <p className="font-bold">{employeeData.el_total} days</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground">Casual Leave</p>
                          <p className="font-bold">{employeeData.cl_total} days</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-muted-foreground">Total Leave</p>
                          <p className="font-bold">{employeeData.el_total + employeeData.cl_total} days</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-6 border-t">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEmployee} disabled={!selectedTemplate || isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Employee
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
