import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Employee } from "@/lib/models"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: employees, error } = await supabase
      .from("employees")
      .select(`
        *,
        employee_templates (
          name,
          department,
          position
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
    }

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeData: Omit<
      Employee,
      | "id"
      | "employee_id"
      | "created_at"
      | "updated_at"
      | "total_ctc"
      | "el_remaining"
      | "cl_remaining"
      | "pl_remaining"
      | "ml_remaining"
      | "comp_off_remaining"
    > = await request.json()
    const supabase = createServerSupabaseClient()

    // Generate employee ID
    const { count } = await supabase.from("employees").select("*", { count: "exact", head: true })

    const employeeId = `EMP${String((count || 0) + 1).padStart(3, "0")}`

    const { data: employee, error } = await supabase
      .from("employees")
      .insert([
        {
          ...employeeData,
          employee_id: employeeId,
          created_by: employeeData.created_by || "Admin",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
