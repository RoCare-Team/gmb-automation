// import { getServerSession } from "next-auth/next"
// import { authOptions } from "../../../lib/auth"
// import { fetchGoogleAccounts, fetchAllLocations } from "../../../lib/gmb-api"

// export async function GET(request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || !session.accessToken) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(request.url)
//     const accountId = searchParams.get("accountId")

//     const accessToken = session.accessToken

//     // Fetch Google My Business accounts
//     const accounts = await fetchGoogleAccounts(accessToken)

//     let locations = []

//     if (accountId) {
//       // Fetch locations for specific account
//       const account = accounts.find((acc) => acc.name.includes(accountId))
//       if (account) {
//         locations = await fetchAllLocations(accessToken, [account])
//       }
//     } else {
//       // Fetch all locations across all accounts
//       locations = await fetchAllLocations(accessToken, accounts)
//     }

//     return Response.json({
//       accounts,
//       locations,
//       total: locations.length,
//     })
//   } catch (error) {
//     console.error("Error fetching Google locations:", error)
//     return Response.json({ error: "Failed to fetch locations" }, { status: 500 })
//   }
// }
