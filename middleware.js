// src/middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("tokentokentoken",token);
  
  const { pathname } = req.nextUrl;

  // ✅ Public routes that don't require auth
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 🔒 If user not logged in → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🧠 Extract subscription info from token
  const hasActiveSubscription =
    token.subscription &&
    token.subscription.status === "active" &&
    token.subscription.plan;

  // 🚫 If no active subscription → block dashboard access
  if (pathname.startsWith("/dashboard") && !hasActiveSubscription) {
    return NextResponse.redirect(new URL("/subscription", req.url));
  }

  // ✅ If user already subscribed and tries to go to /subscription, send to /dashboard
  if (pathname.startsWith("/subscription") && hasActiveSubscription) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/subscription/:path*"],
};
