# HRMS Web Application

A modern Human Resource Management System built with Next.js 14, TypeScript, Tailwind CSS, and Supabase (PostgreSQL).

## Features

- **Employee Management**: Complete employee lifecycle management with template-based onboarding
- **Template System**: Pre-configured employee templates for consistent hiring
- **Dashboard**: Real-time analytics and insights
- **Leave Management**: Leave application and approval workflow
- **Attendance Tracking**: Employee attendance monitoring
- **Payroll Management**: Salary and compensation management
- **Performance Reviews**: Employee performance tracking and evaluation

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (ready to implement)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd hrms-webapp
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

4. Set up the database:
- Go to your Supabase project dashboard
- Navigate to the SQL Editor
- Run the SQL scripts in the following order:
  - `scripts/create-tables.sql`
  - `scripts/seed-templates.sql`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Employee Templates
- Template-based employee configuration
- Salary structures and leave policies
- Department and role definitions

### Employees
- Complete employee profiles
- Linked to templates for consistency
- Leave balances and compensation details

## Project Structure

\`\`\`
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin-only pages
│   ├── api/               # API routes
│   └── [pages]/           # Application pages
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── scripts/               # Database scripts
└── public/                # Static assets
\`\`\`

## Key Features

### Template-Based Employee Management
- Pre-configured employee templates
- Consistent onboarding process
- Standardized compensation packages

### Real-time Dashboard
- Employee statistics
- Department breakdown
- Recent activity tracking

### Modern UI/UX
- Responsive design
- Dark/light mode support
- Accessible components

## API Endpoints

- `GET /api/employees` - Fetch all employees
- `POST /api/employees` - Create new employee
- `GET /api/templates` - Fetch employee templates
- `POST /api/templates` - Create new template
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
