import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("test");

    const user = await db.collection("users").findOne({ userId });
    const posts = await db
      .collection("posts")
      .find({ userId })
      .project({ aiOutput: 1, description: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      wallet: user?.wallet || 0,
      totalPosts: posts.length,
      posts,
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
