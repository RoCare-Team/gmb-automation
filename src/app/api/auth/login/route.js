import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import OTP from "@/models/Otp";
import axios from "axios";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mannubhai_secret";

export async function POST(req) {
  try {
    await dbConnect();
    const { phone, otp, name, email } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // ✅ Step 1: SEND OTP
    if (!otp) {
      const existingUser = await User.findOne({ phone });
      const generatedOtp = Math.floor(1000 + Math.random() * 9000);

      const msg = `Dear Customer, Your OTP for Mannu Bhai profile verification is ${generatedOtp}. Regards, Mannubhai Service Expert`;
      const tmpid = "1007963727820356167";
      const key = "dVHOFwEe";
      const from = "MANNBH";
      const entityid = "1001762193665245675";
      const encodedMsg = encodeURIComponent(msg);

      const url = `https://api.savshka.co.in/api/sms?key=${key}&from=${from}&to=${phone}&body=${encodedMsg}&entityid=${entityid}&templateid=${tmpid}`;

      console.log("Sending OTP:", url);
      await axios.get(url).catch(() => {
        throw new Error("Failed to send OTP via Savshka");
      });

      await OTP.findOneAndUpdate(
        { phone },
        { otp: generatedOtp, createdAt: new Date() },
        { upsert: true }
      );

      return NextResponse.json({
        message: "OTP sent successfully",
        isExistingUser: !!existingUser,
      });
    }

    // ✅ Step 2: VERIFY OTP
    const otpRecord = await OTP.findOne({ phone });
    if (!otpRecord) return NextResponse.json({ error: "OTP not sent" }, { status: 400 });

    const isExpired = (Date.now() - otpRecord.createdAt.getTime()) / 1000 / 60 > 5;
    if (isExpired) return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    if (otpRecord.otp.toString() !== otp.toString())
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    // ✅ Step 3: Check user
    let user = await User.findOne({ phone });

    // new user → need name + email
    if (!user && (!name || !email)) {
      return NextResponse.json({
        step: "collect_details",
        message: "New user — please provide name and email",
      });
    }

    // ✅ Step 4: Register new user if not exist
    if (!user) {
      user = await User.create({
        userId: `USR${Date.now()}`,
        fullName: name,
        email,
        phone,
        wallet: 0,
        subscription: {
          status: "inactive",
          plan: "Free",
          startDate: null,
          endDate: null,
        },
      });
    }

    await OTP.deleteOne({ phone });

    // ✅ Generate JWT (include subscription in payload)
    const token = jwt.sign(
      {
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        phone: user.phone,
        subscription: user.subscription, // 🔥 add subscription in token
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return token + user
    return NextResponse.json({
      message: "Login successful",
      token,
      user,
      redirectTo: user.subscription.status === "active" ? "/dashboard" : "/subscription",
    });
  } catch (err) {
    console.error("OTP API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
