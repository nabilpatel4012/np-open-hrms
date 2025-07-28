export interface EmployeeTemplate {
  id?: string
  name: string
  department: string
  position: string
  level: "Junior" | "Mid" | "Senior" | "Lead" | "Manager" | "Director"
  basic_salary: number
  hra: number
  allowances: number
  bonus: number
  total_ctc: number
  earned_leave: number
  casual_leave: number
  paternity_leave: number
  maternity_leave: number
  comp_off: number
  working_days: number
  probation_period: number
  notice_period: number
  benefits: string[]
  created_by: string
  created_at?: string
  updated_at?: string
}

export interface Employee {
  id?: string
  employee_id: string
  template_id?: string
  name: string
  email: string
  phone?: string
  date_of_birth?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relation?: string
  department: string
  position: string
  level: string
  manager?: string
  location?: string
  join_date: string
  employment_type: "Full-time" | "Part-time" | "Contract" | "Intern"
  status: "Active" | "Inactive" | "On Leave" | "Terminated"
  basic_salary: number
  hra: number
  allowances: number
  bonus: number
  total_ctc: number
  el_total: number
  el_used: number
  el_remaining: number
  cl_total: number
  cl_used: number
  cl_remaining: number
  pl_total: number
  pl_used: number
  pl_remaining: number
  ml_total: number
  ml_used: number
  ml_remaining: number
  comp_off_total: number
  comp_off_used: number
  comp_off_remaining: number
  created_by: string
  created_at?: string
  updated_at?: string
}
