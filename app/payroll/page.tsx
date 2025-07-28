"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Download, Eye, FileText, TrendingUp, Calendar, Users, Calculator } from "lucide-react"
import Navigation from "@/components/navigation"

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-01")

  const ctcBreakdown = {
    basicSalary: 50000,
    hra: 20000,
    allowances: 15000,
    bonus: 10000,
    totalCTC: 95000,
  }

  const payslips = [
    {
      id: 1,
      month: "January 2024",
      period: "2024-01",
      grossSalary: 7916.67,
      deductions: 1583.33,
      netSalary: 6333.34,
      status: "Paid",
      payDate: "2024-01-31",
    },
    {
      id: 2,
      month: "December 2023",
      period: "2023-12",
      grossSalary: 7916.67,
      deductions: 1583.33,
      netSalary: 6333.34,
      status: "Paid",
      payDate: "2023-12-31",
    },
    {
      id: 3,
      month: "November 2023",
      period: "2023-11",
      grossSalary: 7916.67,
      deductions: 1583.33,
      netSalary: 6333.34,
      status: "Paid",
      payDate: "2023-11-30",
    },
  ]

  const taxDocuments = [
    {
      id: 1,
      name: "Form 16 - FY 2023-24",
      type: "Tax Certificate",
      year: "2023-24",
      status: "Available",
      downloadUrl: "#",
    },
    {
      id: 2,
      name: "Investment Declaration",
      type: "Tax Saving",
      year: "2024-25",
      status: "Pending Submission",
      downloadUrl: "#",
    },
    {
      id: 3,
      name: "Salary Certificate",
      type: "Certificate",
      year: "2024",
      status: "Available",
      downloadUrl: "#",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "Available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "Pending Submission":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Submission</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
            <h1 className="text-3xl font-bold">Payroll</h1>
            <p className="text-muted-foreground">Manage employee compensation and payroll processing</p>
          </div>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$245,000</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,900</div>
              <p className="text-xs text-muted-foreground">Per employee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees Paid</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50</div>
              <p className="text-xs text-muted-foreground">Out of 50 total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calculator className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Payroll items</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Overview</CardTitle>
            <CardDescription>Monthly payroll processing and salary management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Payroll Management System</h3>
              <p className="text-muted-foreground mb-4">
                This feature will handle salary calculations, tax deductions, and payroll processing.
              </p>
              <Button>Configure Payroll Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="ctc">CTC Details</TabsTrigger>
            <TabsTrigger value="documents">Tax Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Salary Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Annual CTC</p>
                      <p className="text-2xl font-bold">{formatCurrency(ctcBreakdown.totalCTC)}</p>
                      <p className="text-xs text-muted-foreground">Per Year</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Gross</p>
                      <p className="text-2xl font-bold">{formatCurrency(7916.67)}</p>
                      <p className="text-xs text-muted-foreground">Before Deductions</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Net Salary</p>
                      <p className="text-2xl font-bold">{formatCurrency(6333.34)}</p>
                      <p className="text-xs text-muted-foreground">Take Home</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Next Payday</p>
                      <p className="text-2xl font-bold">31</p>
                      <p className="text-xs text-muted-foreground">Jan 2024</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payslips */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payslips</CardTitle>
                <CardDescription>Your latest salary payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payslips.slice(0, 3).map((payslip) => (
                    <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{payslip.month}</p>
                          <p className="text-sm text-muted-foreground">
                            Net: {formatCurrency(payslip.netSalary)} • Paid on{" "}
                            {new Date(payslip.payDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(payslip.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payslips" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payslip History</CardTitle>
                    <CardDescription>Download and view your payslips</CardDescription>
                  </div>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-01">January 2024</SelectItem>
                      <SelectItem value="2023-12">December 2023</SelectItem>
                      <SelectItem value="2023-11">November 2023</SelectItem>
                      <SelectItem value="2023-10">October 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payslips.map((payslip) => (
                    <div key={payslip.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{payslip.month}</h3>
                          <p className="text-sm text-muted-foreground">Pay Period: {payslip.period}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(payslip.status)}
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Gross Salary</p>
                          <p className="text-xl font-bold text-blue-600">{formatCurrency(payslip.grossSalary)}</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Deductions</p>
                          <p className="text-xl font-bold text-red-600">{formatCurrency(payslip.deductions)}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Net Salary</p>
                          <p className="text-xl font-bold text-green-600">{formatCurrency(payslip.netSalary)}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Payment Date:{" "}
                          {new Date(payslip.payDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ctc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CTC Breakdown</CardTitle>
                <CardDescription>Detailed breakdown of your Cost to Company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* CTC Overview */}
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h2 className="text-3xl font-bold text-gray-900">{formatCurrency(ctcBreakdown.totalCTC)}</h2>
                    <p className="text-muted-foreground">Annual Cost to Company</p>
                  </div>

                  {/* Breakdown Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Salary Components</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span>Basic Salary</span>
                          <span className="font-medium">{formatCurrency(ctcBreakdown.basicSalary)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span>House Rent Allowance (HRA)</span>
                          <span className="font-medium">{formatCurrency(ctcBreakdown.hra)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span>Other Allowances</span>
                          <span className="font-medium">{formatCurrency(ctcBreakdown.allowances)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span>Performance Bonus</span>
                          <span className="font-medium">{formatCurrency(ctcBreakdown.bonus)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Monthly Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded">
                          <span>Monthly Gross</span>
                          <span className="font-medium">{formatCurrency(ctcBreakdown.totalCTC / 12)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span>PF Contribution</span>
                          <span className="font-medium">{formatCurrency(950)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span>Tax Deduction</span>
                          <span className="font-medium">{formatCurrency(633.33)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded">
                          <span className="font-medium">Net Take Home</span>
                          <span className="font-bold">{formatCurrency(6333.34)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This CTC breakdown is for reference only and cannot be modified by
                      employees. For any queries regarding your compensation, please contact HR.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Documents</CardTitle>
                <CardDescription>Download tax certificates and submit declarations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {document.type} • {document.year}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(document.status)}
                        {document.status === "Available" ? (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Tax Saving Reminder</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Don't forget to submit your investment declarations for tax savings under Section 80C, 80D, and
                    other applicable sections.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Submit Investment Declaration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
