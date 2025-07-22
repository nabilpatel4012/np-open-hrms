// Run this script to seed default templates
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

const defaultTemplates = [
  {
    name: "Junior Software Engineer",
    department: "Engineering",
    position: "Software Engineer",
    level: "Junior",
    ctc: {
      basicSalary: 45000,
      hra: 18000,
      allowances: 12000,
      bonus: 5000,
      totalCTC: 80000,
    },
    leaves: {
      EL: 15,
      CL: 3,
      PL: 5,
      ML: 28,
      CompOff: 1,
    },
    workingDays: 22,
    probationPeriod: 6,
    noticePeriod: 30,
    benefits: ["Health Insurance", "Transportation Allowance"],
    createdBy: "System",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Senior Software Engineer",
    department: "Engineering",
    position: "Senior Software Engineer",
    level: "Senior",
    ctc: {
      basicSalary: 60000,
      hra: 24000,
      allowances: 16000,
      bonus: 10000,
      totalCTC: 110000,
    },
    leaves: {
      EL: 18,
      CL: 4,
      PL: 5,
      ML: 28,
      CompOff: 2,
    },
    workingDays: 22,
    probationPeriod: 3,
    noticePeriod: 60,
    benefits: ["Health Insurance", "Transportation Allowance", "Stock Options"],
    createdBy: "System",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Marketing Manager",
    department: "Marketing",
    position: "Marketing Manager",
    level: "Manager",
    ctc: {
      basicSalary: 70000,
      hra: 28000,
      allowances: 20000,
      bonus: 12000,
      totalCTC: 130000,
    },
    leaves: {
      EL: 20,
      CL: 5,
      PL: 5,
      ML: 28,
      CompOff: 3,
    },
    workingDays: 22,
    probationPeriod: 3,
    noticePeriod: 90,
    benefits: ["Health Insurance", "Car Allowance", "Stock Options", "Performance Bonus"],
    createdBy: "System",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedTemplates() {
  try {
    await client.connect()
    const db = client.db("hrms")
    const collection = db.collection("templates")

    // Clear existing templates (optional)
    await collection.deleteMany({})

    // Insert default templates
    const result = await collection.insertMany(defaultTemplates)
    console.log(`Inserted ${result.insertedCount} templates`)
  } catch (error) {
    console.error("Error seeding templates:", error)
  } finally {
    await client.close()
  }
}

seedTemplates()
