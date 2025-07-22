import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Employee } from "@/lib/models"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("hrms")
    const employees = await db.collection<Employee>("employees").find({}).toArray()

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeData: Employee = await request.json()
    const client = await clientPromise
    const db = client.db("hrms")

    // Generate employee ID
    const count = await db.collection("employees").countDocuments()
    const employeeId = `EMP${String(count + 1).padStart(3, "0")}`

    const newEmployee = {
      ...employeeData,
      employeeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Employee>("employees").insertOne(newEmployee)

    return NextResponse.json({ _id: result.insertedId, ...newEmployee })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
