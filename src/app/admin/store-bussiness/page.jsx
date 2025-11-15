"use client";

import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Users,
  Building2,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Globe,
  Search,
  Download,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const [allUserListings, setAllUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    verifiedListings: 0,
    unverifiedListings: 0,
  });

  useEffect(() => {
    fetchAllUserListings();
  }, []);

  const fetchAllUserListings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/saveBussiness");
      const data = await response.json();

      if (data.success) {
        setAllUserListings(data.listings || []);
        calculateStats(data.listings || []);
      }
    } catch (error) {
      console.error("Error fetching user listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (listings) => {
    const totalUsers = listings.length;
    let totalListings = 0;
    let verifiedListings = 0;
    let unverifiedListings = 0;

    listings.forEach((user) => {
      totalListings += user.totalListings || 0;
      verifiedListings += user.verifiedCount || 0;
      unverifiedListings += user.unverifiedCount || 0;
    });

    setStats({ totalUsers, totalListings, verifiedListings, unverifiedListings });
  };

  const getFilteredUsers = () => {
    let filtered = allUserListings;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered
        .map((user) => ({
          ...user,
          listings: user.listings.filter((listing) =>
            filterStatus === "verified" ? listing.verified : !listing.verified
          ),
        }))
        .filter((user) => user.listings.length > 0);
    }

    return filtered;
  };

  const exportToCSV = () => {
    if (allUserListings.length === 0) return;

    const csvData = [];
    allUserListings.forEach((user) => {
      user.listings.forEach((listing) => {
        csvData.push({
          "User Email": user.userEmail,
          "User Name": user.userName,
          "Listing Title": listing.title,
          "Location ID": listing.locationId,
          Verified: listing.verified ? "Yes" : "No",
          Category: listing.category,
          Phone: listing.phone,
          Website: listing.website,
          City: listing.address.locality,
          "Last Updated": new Date(user.lastUpdated).toLocaleString(),
        });
      });
    });

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) =>
        Object.values(row).map((val) => `"${val}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-listings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8" />
            Store Bussiness
            </h1>
            <p className="text-indigo-100 mt-2">
              Manage and monitor all user business listings
            </p>
          </div>
          <button
            onClick={fetchAllUserListings}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon={<Users />} color="blue" />
          <StatCard title="Total Listings" value={stats.totalListings} icon={<Building2 />} color="purple" />
          <StatCard title="Verified" value={stats.verifiedListings} icon={<CheckCircle />} color="green" />
          <StatCard title="Unverified" value={stats.unverifiedListings} icon={<XCircle />} color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {["all", "verified", "unverified"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === status
                      ? status === "verified"
                        ? "bg-green-600 text-white"
                        : status === "unverified"
                        ? "bg-red-600 text-white"
                        : "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* User Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <CircularProgress size={60} sx={{ color: "#4f46e5" }} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">No user data available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUsers.map((user, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{user.userName}</h3>
                      <p className="text-sm text-gray-600">{user.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Listings</p>
                      <p className="text-2xl font-bold text-indigo-600">{user.totalListings}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.listings.map((listing, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">{listing.title}</h4>
                        {listing.verified ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="w-4 h-4" /> {listing.phone}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2"><Globe className="w-4 h-4" /> {listing.website}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" /> {listing.address.locality}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "border-blue-500 text-blue-500",
    purple: "border-purple-500 text-purple-500",
    green: "border-green-500 text-green-500",
    red: "border-red-500 text-red-500",
  };
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${colorMap[color].split(" ")[1]} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
}
