import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { EmployeeTemplate } from "@/lib/models"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("hrms")
    const templates = await db.collection<EmployeeTemplate>("templates").find({}).toArray()

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const template: EmployeeTemplate = await request.json()
    const client = await clientPromise
    const db = client.db("hrms")

    const newTemplate = {
      ...template,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<EmployeeTemplate>("templates").insertOne(newTemplate)

    return NextResponse.json({ _id: result.insertedId, ...newTemplate })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
