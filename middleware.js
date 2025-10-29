import { NextResponse } from "next/server";

export async function middleware(req) {
  // ✅ Allow everything, no validation
  return NextResponse.next();
}

// Optional: you can even remove matcher if you want it to apply on all routes
export const config = {
  matcher: ["/:path*"], // runs for all routes, but just passes through
};
