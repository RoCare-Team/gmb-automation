import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mannubhai_secret";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/otp") || // OTP route allow
    pathname.startsWith("/subscription") // subscription page allow
  ) {
    return NextResponse.next();
  }

  // ✅ Get token (Authorization: Bearer <token>)
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const sub = decoded.subscription;
    const hasActiveSubscription =
      sub && sub.status === "active" && sub.endDate && new Date(sub.endDate) > new Date();

    // 🚫 Not paid → force subscription page
    if (!hasActiveSubscription) {
      return NextResponse.redirect(new URL("/subscription", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT Error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/profile/:path*"],
};
