import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/auth"
import clientPromise from "../../lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("gmb_dashboard")

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const projects = await db.collection("projects").find({ userId: user._id }).sort({ createdAt: -1 }).toArray()

    return Response.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, googleAccountId } = await request.json()

    if (!name || !googleAccountId) {
      return Response.json({ error: "Name and Google Account ID are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("gmb_dashboard")

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const project = {
      name,
      description: description || "",
      googleAccountId,
      userId: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      locations: [],
    }

    const result = await db.collection("projects").insertOne(project)

    return Response.json({ project: { ...project, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return Response.json({ error: "Failed to create project" }, { status: 500 })
  }
}
