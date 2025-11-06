"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // ✅ Public routes that don’t need authentication
    const publicRoutes = [
      "/",
      "/login",
      "/adminLogin", // ✅ Added this line
      "/about",
      "/contact",
      "/privacy-policy",
      "/cancellation-policy",
      "/terms-and-conditions",
      "/refund-policy",
    ];

    // If not logged in and trying to access a private route → redirect to login
    if (!userId && !publicRoutes.includes(pathname)) {
      router.replace("/");
    }

    // If logged in and currently on login page → redirect to dashboard
    if (userId && (pathname === "/login" || pathname === "/adminLogin")) {
      router.replace("/dashboard");
    }

    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) return null;

  return <>{children}</>;
}
