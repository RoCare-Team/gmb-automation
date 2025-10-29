import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  userId: String,
  email: String,
  passwordHash: String,
  subscription: {
    plan: String,
    paymentId: String,
    orderId: String,
    date: Date,
    status: String,
  },
  createdAt: Date,
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// ✅ GET: Fetch all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST: Fetch dashboard stats + monthly growth
export async function POST(req) {
  try {
    await connectDB();
    const users = await User.find({});

    const totalUsers = users.length;
    const activeUsers = users.filter(
      (u) => u.subscription?.status === "active"
    ).length;
    const inactiveUsers = totalUsers - activeUsers;

    const latestUser = users.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    const monthlyData = Array(12).fill(0);
    users.forEach((user) => {
      if (user.createdAt) {
        const month = new Date(user.createdAt).getMonth();
        monthlyData[month]++;
      }
    });

    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const userGrowth = monthLabels.map((m, i) => ({
      month: m,
      users: monthlyData[i],
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        latestSignup: latestUser?.createdAt || null,
      },
      userGrowth,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update user's subscription plan
export async function PUT(req) {
  try {
    await connectDB();

    const { userId, newPlan } = await req.json();
    if (!userId || !newPlan)
      return NextResponse.json(
        { success: false, error: "Missing userId or newPlan" },
        { status: 400 }
      );

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          "subscription.plan": newPlan,
          "subscription.status": "active",
          "subscription.date": new Date(),
        },
      },
      { new: true }
    );

    if (!updatedUser)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: `Plan updated to ${newPlan}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
