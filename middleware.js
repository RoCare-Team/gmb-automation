// src/middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Redirect if not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect if no active subscription
  if (token && (!token.subscription || token.subscription.status !== "active")) {
    if (!pathname.startsWith("/subscription")) {
      return NextResponse.redirect(new URL("/subscription", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/subscription/:path*"], // protect dashboard & subscription
};
