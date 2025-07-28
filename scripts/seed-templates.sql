-- Insert default employee templates
INSERT INTO employee_templates (
  name, department, position, level, 
  basic_salary, hra, allowances, bonus, total_ctc,
  earned_leave, casual_leave, paternity_leave, maternity_leave, comp_off,
  working_days, probation_period, notice_period, benefits, created_by
) VALUES 
(
  'Junior Software Engineer',
  'Engineering',
  'Software Engineer',
  'Junior',
  60000, 18000, 5000, 10000, 80000,
  18, 4, 5, 28, 2,
  22, 6, 30,
  ARRAY['Health Insurance', 'Flexible Hours'],
  'System'
),
(
  'Senior Software Engineer',
  'Engineering',
  'Software Engineer',
  'Senior',
  100000, 30000, 8000, 20000, 110000,
  21, 6, 5, 28, 4,
  22, 3, 60,
  ARRAY['Health Insurance', 'Flexible Hours', 'Stock Options'],
  'System'
),
(
  'Engineering Manager',
  'Engineering',
  'Engineering Manager',
  'Manager',
  80000, 32000, 20000, 15000, 147000,
  20, 5, 5, 28, 3,
  22, 3, 90,
  ARRAY['Health Insurance', 'Car Allowance', 'Stock Options', 'Performance Bonus'],
  'System'
),
(
  'Marketing Manager',
  'Marketing',
  'Marketing Manager',
  'Manager',
  70000, 28000, 20000, 12000, 130000,
  20, 5, 5, 28, 3,
  22, 3, 90,
  ARRAY['Health Insurance', 'Car Allowance', 'Stock Options', 'Performance Bonus'],
  'System'
),
(
  'HR Manager',
  'Human Resources',
  'HR Manager',
  'Manager',
  90000, 27000, 7000, 18000, 120000,
  21, 6, 5, 28, 4,
  22, 3, 60,
  ARRAY['Health Insurance', 'Flexible Hours', 'Professional Development'],
  'System'
),
(
  'Sales Executive',
  'Sales',
  'Sales Executive',
  'Mid',
  50000, 20000, 15000, 8000, 93000,
  16, 4, 5, 28, 2,
  22, 6, 45,
  ARRAY['Health Insurance', 'Transportation Allowance', 'Commission'],
  'System'
),
(
  'Product Manager',
  'Product',
  'Product Manager',
  'Manager',
  120000, 36000, 10000, 25000, 147000,
  24, 8, 5, 28, 6,
  22, 3, 90,
  ARRAY['Health Insurance', 'Flexible Hours', 'Stock Options', 'Travel Allowance'],
  'System'
),
(
  'UI/UX Designer',
  'Design',
  'Designer',
  'Mid',
  75000, 22500, 6000, 15000, 93000,
  18, 4, 5, 28, 2,
  22, 6, 30,
  ARRAY['Health Insurance', 'Flexible Hours', 'Design Tools'],
  'System'
),
(
  'Marketing Specialist',
  'Marketing',
  'Marketing Specialist',
  'Mid',
  65000, 19500, 5500, 12000, 93000,
  18, 4, 5, 28, 2,
  22, 6, 30,
  ARRAY['Health Insurance', 'Flexible Hours', 'Marketing Budget'],
  'System'
);
