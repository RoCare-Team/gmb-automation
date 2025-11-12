// import { getServerSession } from "next-auth/next"
// import { authOptions } from "../../lib/auth"

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || !session.accessToken) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const accessToken = session.accessToken

//     console.log("accessToken",accessToken);
    

//     // Fetch Google My Business accounts
//     const accountsRes = await fetch("https://mybusinessbusinessinformation.googleapis.com/v1/accounts", {
//       headers: { Authorization: `Bearer ${accessToken}` },
//       cache: "no-store",
//     })

//     if (!accountsRes.ok) {
//       throw new Error("Failed to fetch Google accounts")
//     }

//     const accountsData = await accountsRes.json()
//     const pickedAccounts = accountsData.accounts || []

//     // Fetch locations for each account
//     let allLocations = []

//     for (const account of pickedAccounts) {
//       const accountId = account.name.replace("accounts/", "")
//       const locationsRes = await fetch(
//         `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         },
//       )

//       if (locationsRes.ok) {
//         const locData = await locationsRes.json()
//         if (locData.locations) {
//           allLocations = [
//             ...allLocations,
//             ...locData.locations.map((loc) => ({
//               ...loc,
//               accountId,
//               accountName: account.accountName || account.name,
//             })),
//           ]
//         }
//       }
//     }

//     return Response.json({
//       accounts: pickedAccounts,
//       locations: allLocations,
//     })
//   } catch (error) {
//     console.error("Error fetching Google accounts:", error)
//     return Response.json({ error: "Failed to fetch accounts" }, { status: 500 })
//   }
// }
