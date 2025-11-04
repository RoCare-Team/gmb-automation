"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    async function fetchUserData() {
      try {
        const res = await fetch(`/api/auth/signup?userId=${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-700 text-xl">
        Loading Profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        No user data found.
      </div>
    );
  }

  const { fullName, email, phone, wallet, subscription, freeUsedCount } = userData;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          👤 My Profile
        </h1>

        <div className="space-y-5">
          <InfoRow label="Full Name" value={fullName} />
          <InfoRow label="Email" value={email} />
          <InfoRow label="Phone" value={phone} />
          <InfoRow label="Free Uses Left" value={freeUsedCount} />

          {/* Wallet Section */}
          <div className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-3">
            <span className="font-medium text-gray-600">Wallet Balance</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-800 font-semibold">₹{wallet}</span>
              <button
                onClick={() => router.push("/wallet")}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white px-3 py-1.5 text-sm rounded-lg font-medium shadow-md"
              >
                Add More Coins
              </button>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-3">
            <span className="font-medium text-gray-600">
              Plan:{" "}
              <span className="text-gray-800 font-semibold">
                {subscription?.plan || "N/A"}
              </span>
            </span>
            <button
              onClick={() => router.push("/subscription")}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white px-3 py-1.5 text-sm rounded-lg font-medium shadow-md"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  
  return (
    <div className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-3">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-800 font-semibold">{value}</span>
    </div>
  );
}
