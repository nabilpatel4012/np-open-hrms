export interface EmployeeTemplate {
  _id?: string
  name: string // e.g., "Junior Engineer", "Senior Manager"
  department: string
  position: string
  level: "Junior" | "Mid" | "Senior" | "Lead" | "Manager" | "Director"
  ctc: {
    basicSalary: number
    hra: number
    allowances: number
    bonus: number
    totalCTC: number
  }
  leaves: {
    EL: number // Earned Leave
    CL: number // Casual Leave
    PL: number // Paternity Leave
    ML: number // Maternity Leave
    CompOff: number // Comp Off
  }
  workingDays: number
  probationPeriod: number // in months
  noticePeriod: number // in days
  benefits: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  _id?: string
  templateId?: string
  employeeId: string
  personalInfo: {
    name: string
    email: string
    phone: string
    dateOfBirth: Date
    address: string
    emergencyContact: {
      name: string
      phone: string
      relation: string
    }
  }
  workInfo: {
    department: string
    position: string
    level: string
    manager: string
    location: string
    joinDate: Date
    employmentType: "Full-time" | "Part-time" | "Contract" | "Intern"
    status: "Active" | "Inactive" | "On Leave" | "Terminated"
  }
  compensation: {
    basicSalary: number
    hra: number
    allowances: number
    bonus: number
    totalCTC: number
  }
  leaves: {
    EL: { total: number; used: number; remaining: number }
    CL: { total: number; used: number; remaining: number }
    PL: { total: number; used: number; remaining: number }
    ML: { total: number; used: number; remaining: number }
    CompOff: { total: number; used: number; remaining: number }
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface LeaveApplication {
  _id?: string
  employeeId: string
  leaveType: "EL" | "CL" | "PL" | "ML" | "CompOff"
  startDate: Date
  endDate: Date
  days: number
  reason: string
  status: "Pending" | "Approved" | "Rejected"
  appliedOn: Date
  approver?: string
  approvedOn?: Date
  comments?: string
}

export interface AttendanceRecord {
  _id?: string
  employeeId: string
  date: Date
  checkIn?: Date
  checkOut?: Date
  location: {
    latitude: number
    longitude: number
  }
  status: "Present" | "Late" | "Absent" | "Half Day"
  workingHours: number
  createdAt: Date
}
