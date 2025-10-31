"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // If userId not found and not on /login → redirect to login
    if (!userId && pathname !== "/login") {
      router.replace("/dashboard");
    }

    // If userId found and currently on /login → redirect to dashboard
    if (userId && pathname === "/login") {
      router.replace("/dashboard");
    }

    setIsChecking(false);
  }, [pathname, router]);

  // Avoid flashing while checking auth
  if (isChecking) return null;

  return <>{children}</>;
}
