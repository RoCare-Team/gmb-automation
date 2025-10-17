import { NextResponse } from "next/server";

const accountId = "116862092928692422428";
const locationId = "1940115651408221204";

export async function GET() {
  try {
    const res = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // server-only token
        },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const { reviewId, comment } = await req.json();

    if (!reviewId || !comment) {
      return NextResponse.json(
        { error: "Both reviewId and comment are required" },
        { status: 400 }
      );
    }

    const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("GMB API Error:", data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to post reply" },
      { status: 500 }
    );
  }
}