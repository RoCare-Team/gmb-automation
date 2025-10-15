import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/auth"
import { updateLocationInfo } from "../../../../lib/gmb-api"

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updateData = await request.json()
    const locationName = `locations/${params.locationId}`

    const updatedLocation = await updateLocationInfo(session.accessToken, locationName, updateData)

    return Response.json({ location: updatedLocation })
  } catch (error) {
    console.error("Error updating location:", error)
    return Response.json({ error: "Failed to update location" }, { status: 500 })
  }
}
