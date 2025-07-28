import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { EmployeeTemplate } from "@/lib/models"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: templates, error } = await supabase
      .from("employee_templates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData: Omit<EmployeeTemplate, "id" | "created_at" | "updated_at" | "total_ctc"> = await request.json()
    const supabase = createServerSupabaseClient()

    const { data: template, error } = await supabase
      .from("employee_templates")
      .insert([
        {
          ...templateData,
          created_by: templateData.created_by || "Admin",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
