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

    const admin = await Admin.findOne({ email });
    if (!admin) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });
    const res = NextResponse.json({ message: "Login success" });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
