import { NextResponse } from "next/server"
import { getAccessToken } from "@/lib/googleAuth"

const accountId = "116862092928692422428"
const locationId = "1940115651408221204"

export async function GET() {
  try {
    const token = await getAccessToken()

    const res = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { reviewId } = await req.json()
    const token = await getAccessToken()

    const res = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: "Thank you for visiting our business!",
        }),
      }
    )

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
