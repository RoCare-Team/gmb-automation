import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mannubhai_secret";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 🔍 Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );

    // 🔑 Verify password
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );

    // 🧩 Create JWT payload
    const payload = {
      id: admin._id,
      email: admin.email,
      role: admin.role || "admin", // default to admin if role not set
    };

    // 🔐 Sign JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    // 🍪 Set token in secure cookie
    const res = NextResponse.json({
      message: "Login success",
      token,
      role: admin.role || "admin",
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
