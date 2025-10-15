import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
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

    const project = await db.collection("projects").findOne({
      _id: new ObjectId(params.id),
      userId: user._id,
    })

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    return Response.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return Response.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, status } = await request.json()

    const client = await clientPromise
    const db = client.db("gmb_dashboard")

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const updateData = {
      updatedAt: new Date(),
    }

    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = status

    const result = await db.collection("projects").updateOne(
      {
        _id: new ObjectId(params.id),
        userId: user._id,
      },
      { $set: updateData },
    )

    if (result.matchedCount === 0) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    const updatedProject = await db.collection("projects").findOne({
      _id: new ObjectId(params.id),
      userId: user._id,
    })

    return Response.json({ project: updatedProject })
  } catch (error) {
    console.error("Error updating project:", error)
    return Response.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
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

    const result = await db.collection("projects").deleteOne({
      _id: new ObjectId(params.id),
      userId: user._id,
    })

    if (result.deletedCount === 0) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    return Response.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return Response.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
