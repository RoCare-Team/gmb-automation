import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@mannubhai.com" });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 200 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("mannubhai@007", 10);

    // Create admin
    await Admin.create({
      fullName: "Super Admin",
      email: "admin@mannubhai.com",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
