"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Copy, FileIcon as FileTemplate } from "lucide-react"
import Navigation from "@/components/navigation"
import type { EmployeeTemplate } from "@/lib/models"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmployeeTemplate[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmployeeTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<EmployeeTemplate>>({
    name: "",
    department: "",
    position: "",
    level: "Junior",
    ctc: {
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      bonus: 0,
      totalCTC: 0,
    },
    leaves: {
      EL: 18,
      CL: 4,
      PL: 5,
      ML: 28,
      CompOff: 2,
    },
    workingDays: 22,
    probationPeriod: 6,
    noticePeriod: 30,
    benefits: [],
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

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

  const handleCreateTemplate = async () => {
    try {
      const templateData = {
        ...formData,
        ctc: {
          ...formData.ctc,
          totalCTC:
            (formData.ctc?.basicSalary || 0) +
            (formData.ctc?.hra || 0) +
            (formData.ctc?.allowances || 0) +
            (formData.ctc?.bonus || 0),
        },
        createdBy: "Admin", // In real app, get from auth context
      }

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      })

      if (response.ok) {
        await fetchTemplates()
        setIsCreateDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error creating template:", error)
    }
  }

  const handleCopyTemplate = (template: EmployeeTemplate) => {
    setFormData({
      name: `${template.name} (Copy)`,
      department: template.department,
      position: template.position,
      level: template.level,
      ctc: { ...template.ctc },
      leaves: { ...template.leaves },
      workingDays: template.workingDays,
      probationPeriod: template.probationPeriod,
      noticePeriod: template.noticePeriod,
      benefits: [...template.benefits],
    })
    setIsCreateDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      position: "",
      level: "Junior",
      ctc: {
        basicSalary: 0,
        hra: 0,
        allowances: 0,
        bonus: 0,
        totalCTC: 0,
      },
      leaves: {
        EL: 18,
        CL: 4,
        PL: 5,
        ML: 28,
        CompOff: 2,
      },
      workingDays: 22,
      probationPeriod: 6,
      noticePeriod: 30,
      benefits: [],
    })
  }

  const getLevelBadge = (level: string) => {
    const colors = {
      Junior: "bg-green-100 text-green-800",
      Mid: "bg-blue-100 text-blue-800",
      Senior: "bg-purple-100 text-purple-800",
      Lead: "bg-orange-100 text-orange-800",
      Manager: "bg-red-100 text-red-800",
      Director: "bg-gray-100 text-gray-800",
    }
    return <Badge className={colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{level}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Employee Templates</h1>
            <p className="text-muted-foreground">Manage employee templates for streamlined onboarding</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Employee Template</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="compensation">Compensation</TabsTrigger>
                  <TabsTrigger value="leaves">Leaves</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input
                        placeholder="e.g., Junior Software Engineer"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select
                        value={formData.department || ""}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Position Title</Label>
                      <Input
                        placeholder="e.g., Software Engineer"
                        value={formData.position || ""}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Level</Label>
                      <Select
                        value={formData.level || "Junior"}
                        onValueChange={(value: any) => setFormData({ ...formData, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                  </div>
                </TabsContent>

                <TabsContent value="compensation" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Basic Salary</Label>
                      <Input
                        type="number"
                        value={formData.ctc?.basicSalary || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ctc: { ...formData.ctc!, basicSalary: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>HRA</Label>
                      <Input
                        type="number"
                        value={formData.ctc?.hra || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ctc: { ...formData.ctc!, hra: Number(e.target.value) },
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
                        value={formData.ctc?.allowances || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ctc: { ...formData.ctc!, allowances: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Performance Bonus</Label>
                      <Input
                        type="number"
                        value={formData.ctc?.bonus || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ctc: { ...formData.ctc!, bonus: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium">
                      Total CTC:{" "}
                      {formatCurrency(
                        (formData.ctc?.basicSalary || 0) +
                          (formData.ctc?.hra || 0) +
                          (formData.ctc?.allowances || 0) +
                          (formData.ctc?.bonus || 0),
                      )}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="leaves" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Earned Leave (EL)</Label>
                      <Input
                        type="number"
                        value={formData.leaves?.EL || 18}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaves: { ...formData.leaves!, EL: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Casual Leave (CL)</Label>
                      <Input
                        type="number"
                        value={formData.leaves?.CL || 4}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaves: { ...formData.leaves!, CL: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Paternity Leave (PL)</Label>
                      <Input
                        type="number"
                        value={formData.leaves?.PL || 5}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaves: { ...formData.leaves!, PL: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maternity Leave (ML)</Label>
                      <Input
                        type="number"
                        value={formData.leaves?.ML || 28}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaves: { ...formData.leaves!, ML: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Comp Off</Label>
                      <Input
                        type="number"
                        value={formData.leaves?.CompOff || 2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaves: { ...formData.leaves!, CompOff: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="policies" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Working Days/Month</Label>
                      <Input
                        type="number"
                        value={formData.workingDays || 22}
                        onChange={(e) => setFormData({ ...formData, workingDays: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Probation Period (Months)</Label>
                      <Input
                        type="number"
                        value={formData.probationPeriod || 6}
                        onChange={(e) => setFormData({ ...formData, probationPeriod: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notice Period (Days)</Label>
                      <Input
                        type="number"
                        value={formData.noticePeriod || 30}
                        onChange={(e) => setFormData({ ...formData, noticePeriod: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>
                      {template.department} • {template.position}
                    </CardDescription>
                  </div>
                  {getLevelBadge(template.level)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total CTC:</span>
                    <span className="font-medium">{formatCurrency(template.ctc.totalCTC)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Leaves:</span>
                    <span className="font-medium">{template.leaves.EL + template.leaves.CL} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Notice Period:</span>
                    <span className="font-medium">{template.noticePeriod} days</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopyTemplate(template)}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {templates.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <FileTemplate className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-4">Create your first employee template to get started</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
