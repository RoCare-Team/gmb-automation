// src/middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/subscription") // 🔓 subscription page हमेशा matcher से बाहर
  ) {
    return NextResponse.next();
  }

  // ✅ Token from header or cookie
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const hasActiveSubscription =
      decoded.subscription &&
      decoded.subscription.status === "active" &&
      new Date(decoded.subscription.endDate) > new Date();

    // 🚫 If user NOT paid → block ALL protected routes (dashboard, settings, profile etc.)
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
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*"
  ],
};
