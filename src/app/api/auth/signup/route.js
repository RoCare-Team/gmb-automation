import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  const { fullName, email, password } = await req.json();

  // ✅ Validate inputs
  if (!fullName || !email || !password) {
    return new Response(
      JSON.stringify({ error: "Full name, email, and password are required" }),
      { status: 400 }
    );
  }

  // ✅ Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "User already exists with this email" }),
      { status: 400 }
    );
  }

  // ✅ Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // ✅ Find last user to determine the next userId
  const lastUser = await User.findOne().sort({ createdAt: -1 });
  let nextNumber = 1;

  if (lastUser && lastUser.userId) {
    const lastNumber = parseInt(lastUser.userId.replace("MB-", ""), 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // ✅ Format userId like MB-01, MB-02, ...
  const formattedUserId = `MB-${String(nextNumber).padStart(2, "0")}`;

  // ✅ Create new user
  const newUser = new User({
    userId: formattedUserId,
    fullName,
    email,
    passwordHash,
  });

  await newUser.save();

  return new Response(
    JSON.stringify({
      message: "User created successfully",
      userId: newUser.userId,
    }),
    { status: 201 }
  );
}
