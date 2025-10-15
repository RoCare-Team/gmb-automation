import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/auth"
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"
import { fetchGoogleAccounts, fetchLocationsByAccount } from "../../../../lib/gmb-api"

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
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

    // Fetch latest locations from Google My Business API
    const accounts = await fetchGoogleAccounts(session.accessToken)
    const projectAccount = accounts.find((acc) => acc.name.includes(project.googleAccountId))

    if (!projectAccount) {
      return Response.json({ error: "Google account not found" }, { status: 404 })
    }

    const locations = await fetchLocationsByAccount(session.accessToken, project.googleAccountId)

    // Update project with latest locations
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          locations: locations.map((loc) => ({
            id: loc.name.replace("locations/", ""),
            name: loc.title,
            address: loc.storefrontAddress,
            phone: loc.phoneNumbers?.[0]?.number,
            website: loc.websiteUri,
            categories: loc.categories,
            lastSynced: new Date(),
          })),
          lastSynced: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return Response.json({ error: "Failed to update project" }, { status: 500 })
    }

    const updatedProject = await db.collection("projects").findOne({
      _id: new ObjectId(params.id),
    })

    return Response.json({
      project: updatedProject,
      syncedLocations: locations.length,
    })
  } catch (error) {
    console.error("Error syncing project:", error)
    return Response.json({ error: "Failed to sync project" }, { status: 500 })
  }
}
