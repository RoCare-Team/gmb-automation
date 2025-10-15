import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, plan, payment } = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = payment;

    if (!userId || !plan || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(JSON.stringify({ success: false, error: "Missing required payment info" }), { status: 400 });
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return new Response(JSON.stringify({ success: false, error: "Invalid signature" }), { status: 400 });
    }

    // Update user plan
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
    }

    user.plan = plan;
    user.subscription = {
      plan,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      subscribedAt: new Date(),
    };

    await user.save();

    return new Response(JSON.stringify({ success: true, message: "Subscription successful" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}
