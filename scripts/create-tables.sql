-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create employee_templates table
CREATE TABLE IF NOT EXISTS employee_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director')),
  basic_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  hra DECIMAL(12,2) NOT NULL DEFAULT 0,
  allowances DECIMAL(12,2) NOT NULL DEFAULT 0,
  bonus DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_ctc DECIMAL(12,2) GENERATED ALWAYS AS (basic_salary + hra + allowances + bonus) STORED,
  earned_leave INTEGER NOT NULL DEFAULT 18,
  casual_leave INTEGER NOT NULL DEFAULT 4,
  paternity_leave INTEGER NOT NULL DEFAULT 5,
  maternity_leave INTEGER NOT NULL DEFAULT 28,
  comp_off INTEGER NOT NULL DEFAULT 2,
  working_days INTEGER NOT NULL DEFAULT 22,
  probation_period INTEGER NOT NULL DEFAULT 6,
  notice_period INTEGER NOT NULL DEFAULT 30,
  benefits TEXT[] DEFAULT '{}',
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  template_id UUID REFERENCES employee_templates(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relation VARCHAR(100),
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  manager VARCHAR(255),
  location VARCHAR(255),
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  employment_type VARCHAR(20) NOT NULL DEFAULT 'Full-time' CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Intern')),
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave', 'Terminated')),
  basic_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  hra DECIMAL(12,2) NOT NULL DEFAULT 0,
  allowances DECIMAL(12,2) NOT NULL DEFAULT 0,
  bonus DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_ctc DECIMAL(12,2) GENERATED ALWAYS AS (basic_salary + hra + allowances + bonus) STORED,
  el_total INTEGER NOT NULL DEFAULT 0,
  el_used INTEGER NOT NULL DEFAULT 0,
  el_remaining INTEGER GENERATED ALWAYS AS (el_total - el_used) STORED,
  cl_total INTEGER NOT NULL DEFAULT 0,
  cl_used INTEGER NOT NULL DEFAULT 0,
  cl_remaining INTEGER GENERATED ALWAYS AS (cl_total - cl_used) STORED,
  pl_total INTEGER NOT NULL DEFAULT 0,
  pl_used INTEGER NOT NULL DEFAULT 0,
  pl_remaining INTEGER GENERATED ALWAYS AS (pl_total - pl_used) STORED,
  ml_total INTEGER NOT NULL DEFAULT 0,
  ml_used INTEGER NOT NULL DEFAULT 0,
  ml_remaining INTEGER GENERATED ALWAYS AS (ml_total - ml_used) STORED,
  comp_off_total INTEGER NOT NULL DEFAULT 0,
  comp_off_used INTEGER NOT NULL DEFAULT 0,
  comp_off_remaining INTEGER GENERATED ALWAYS AS (comp_off_total - comp_off_used) STORED,
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_applications table
CREATE TABLE IF NOT EXISTS leave_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type VARCHAR(10) CHECK (leave_type IN ('EL', 'CL', 'PL', 'ML', 'CompOff')) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('Pending', 'Approved', 'Rejected')) NOT NULL DEFAULT 'Pending',
  applied_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approver VARCHAR(255),
  approved_on TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status VARCHAR(20) CHECK (status IN ('Present', 'Late', 'Absent', 'Half Day')) NOT NULL DEFAULT 'Present',
  working_hours DECIMAL(4,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_template_id ON employees(template_id);
CREATE INDEX IF NOT EXISTS idx_employee_templates_department ON employee_templates(department);
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee_id ON leave_applications(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_attendance_records_employee_id ON attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_employee_templates_updated_at BEFORE UPDATE ON employee_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_applications_updated_at BEFORE UPDATE ON leave_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
