"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { method: "POST" });
      const data = await res.json();

      

      if (data.success) {
        setStats(data.stats);
        setUserGrowth(data.userGrowth || []);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        Loading dashboard...
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white rounded-xl p-5 shadow-lg">
          <h2 className="text-sm opacity-80">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-green-500 text-white rounded-xl p-5 shadow-lg">
          <h2 className="text-sm opacity-80">Active Subscriptions</h2>
          <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
        </div>

        <div className="bg-red-500 text-white rounded-xl p-5 shadow-lg">
          <h2 className="text-sm opacity-80">Inactive Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.inactiveUsers}</p>
        </div>

        <div className="bg-purple-500 text-white rounded-xl p-5 shadow-lg">
          <h2 className="text-sm opacity-80">Latest Signup</h2>
          <p className="text-lg font-semibold mt-2">
            {stats.latestSignup
              ? new Date(stats.latestSignup).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Revenue & Plans Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-yellow-500 text-white rounded-xl p-5 shadow-lg">
          <h2 className="text-sm opacity-80">Total Revenue</h2>
          <p className="text-3xl font-bold mt-2">
            ₹{stats.totalRevenue?.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md text-gray-800">
          <h2 className="text-lg font-semibold mb-3">Plan Distribution</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Basic Plan</span>
              <span className="font-bold text-blue-600">
                {stats.planCounts?.basic || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Standard Plan</span>
              <span className="font-bold text-green-600">
                {stats.planCounts?.standard || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Premium Plan</span>
              <span className="font-bold text-purple-600">
                {stats.planCounts?.premium || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Monthly User Growth
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "10px" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#2563eb"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
