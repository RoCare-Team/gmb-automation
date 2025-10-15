import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../../lib/auth"
import { fetchLocationInsights } from "../../../../../../lib/gmb-api"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    const locationName = `locations/${params.locationId}`
    const insights = await fetchLocationInsights(session.accessToken, locationName, startDate, endDate)

    return Response.json({ insights })
  } catch (error) {
    console.error("Error fetching location insights:", error)
    return Response.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}
