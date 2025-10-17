import { NextResponse } from "next/server";
import OpenAI from "openai";

// ✅ Server-side OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Keep this key server-side only
});

export async function POST(req) {
  try {
    const { reviewText } = await req.json();

    if (!reviewText) {
      return NextResponse.json({ error: "Missing review text" }, { status: 400 });
    }

    // 🧠 Generate AI reply using GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a polite business owner. Reply to Google reviews in a professional and friendly way. Keep it short and natural.",
        },
        { role: "user", content: reviewText },
      ],
    });

    const aiReply = completion.choices[0].message.content;

    return NextResponse.json({ reply: aiReply });
  } catch (err) {
    console.error("OpenAI API Error:", err);
    return NextResponse.json({ error: "Failed to generate AI reply" }, { status: 500 });
  }
}
