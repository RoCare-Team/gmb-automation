import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(request) {
  try {
    const { planId, amount, receipt, notes } = await request.json()

    if (!planId || !amount || !receipt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ Razorpay keys are missing in environment variables")
      return NextResponse.json({ error: "Razorpay environment variables missing" }, { status: 500 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt,
      notes,
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
