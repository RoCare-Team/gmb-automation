"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userId = localStorage.getItem("userId"); // For normal user
    const role = localStorage.getItem("role"); // For admin

    // ✅ Public routes that don’t need authentication
    const publicRoutes = [
      "/",
      "/login",
      "/adminLogin",
      "/about",
      "/contact",
      "/privacy-policy",
      "/cancellation-policy",
      "/terms-and-conditions",
      "/refund-policy",
    ];

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAdminRoute = pathname.startsWith("/admin");

    // 🧠 Add small delay for localStorage readiness
    setTimeout(() => {
      // ✅ Case 1: Admin area access
      if (isAdminRoute) {
        // If not admin → redirect to admin login
        if (role !== "admin") {
          router.replace("/adminLogin");
          setIsChecking(false);
          return;
        }
        // If admin logged in → allow
        setIsChecking(false);
        return;
      }

      // ✅ Case 2: Not logged in + accessing private user route → redirect to home
      if (!userId && !isPublicRoute && role !== "admin") {
        router.replace("/");
        setIsChecking(false);
        return;
      }

      // ✅ Case 3: Logged-in user trying to access /login → go to dashboard
      if (userId && pathname === "/login") {
        router.replace("/dashboard");
        setIsChecking(false);
        return;
      }

      // ✅ Case 4: Admin already logged in & visiting /adminLogin → redirect dashboard
      if (role === "admin" && pathname === "/adminLogin") {
        router.replace("/admin/dashboard");
        setIsChecking(false);
        return;
      }

      // ✅ Case 5: Allow public routes
      setIsChecking(false);
    }, 100);
  }, [pathname, router]);

  if (isChecking) return null;

  return <>{children}</>;
}
