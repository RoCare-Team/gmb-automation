"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Loader2,
  MapPin,
  Phone,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Building2,
  Plus,
} from "lucide-react";
import Link from "next/link";

// --- API Helpers ---
export async function fetchGMBAccounts(accessToken) {
  try {
    const res = await fetch(
      "https://mybusinessbusinessinformation.googleapis.com/v1/accounts",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch accounts: ${errText}`);
    }

    const data = await res.json();
    return data.accounts || [];
  } catch (err) {
    console.error("Fetch Accounts Error:", err);
    toast.error("Error fetching GMB accounts!");
    return [];
  }
}

export async function fetchLocationsByAccount(accessToken, accountId) {
  try {
    const res = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,openInfo,metadata`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) throw new Error(`Failed to fetch locations for account ${accountId}`);

    const data = await res.json();
    console.log("logggg", data);

    return data.locations || [];
  } catch (err) {
    console.error(`Error fetching locations for account ${accountId}:`, err);
    return [];
  }
}

export async function fetchAllLocations(accessToken, accounts) {
  let allLocations = [];

  for (const account of accounts) {
    try {
      const accountId = account.name.replace("accounts/", "");
      const locations = await fetchLocationsByAccount(accessToken, accountId);

      const locationsWithAccount = locations.map((loc) => ({
        ...loc,
        accountId,
        accountName: account.accountName || account.name,
      }));

      allLocations = [...allLocations, ...locationsWithAccount];
    } catch (error) {
      console.error(`Failed to fetch locations for account ${account.name}:`, error);
    }
  }

  return allLocations;
}

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log("session");
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [summary, setSummary] = useState({ total: 0, verified: 0, unverified: 0, pending: 0 });
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const userPlan = session?.user?.plan || "Standard";
  console.log("userPlan",userPlan);
  
  const maxAccounts = userPlan === "Standard" ? 1 : 0;

  console.log("summary",summary);

  console.log("accountsaccounts",accounts);
  
  

  // --- Fetch Accounts & Locations ---
  const fetchInitialData = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    const token = session.accessToken;

    const accountsData = await fetchGMBAccounts(token);
    if (accountsData.length === 0) {
      setAccounts([]);
      toast.info("No accounts found. Please add your project!");
      setLoading(false);
      setInitialFetchDone(true);
      return;
    }

    const locationsData = await fetchAllLocations(token, accountsData);
    if (locationsData.length > 0) {
      setAccounts([{ email: session.user.email, listings: locationsData }]);
      toast.success("Listings loaded successfully!");
    } else {
      setAccounts([]);
      toast.info("No locations found under these accounts.");
    }

    setInitialFetchDone(true);
    setLoading(false);
  };

  useEffect(() => {
    if (session && !initialFetchDone) {
      fetchInitialData();
    }
  }, [session, initialFetchDone]);



  // --- Summary Update ---
  useEffect(() => {
    if (accounts.length > 0) {
      const allListings = accounts.flatMap((acc) => acc.listings);
      const total = allListings.length;
      const verified = allListings.filter((l) => l.state === "VERIFIED").length;
      const pending = allListings.filter((l) => l.state === "PENDING").length;
      const unverified = total - verified - pending;
      setSummary({ total, verified, unverified, pending });
    }
  }, [accounts]);

  // --- Add Project ---
  const handleAddProject = async () => {
    if (!session) {
      await signIn("google", { redirect: false });
      return;
    }

    if (accounts.length >= maxAccounts) {
      toast.error(`⚠️ ${userPlan} plan allows only ${maxAccounts} profiles. Upgrade to add more!`);
      return;
    }

    setLoading(true);
    const token = session.accessToken;
    const accountsData = await fetchGMBAccounts(token);
    const locationsData = await fetchAllLocations(token, accountsData);

    if (locationsData.length > 0) {
      setAccounts((prev) => [...prev, { email: session.user.email, listings: locationsData }]);
      toast.success("GMB listings fetched successfully!");
    } else {
      toast.info("No locations found under this account.");
    }

    setLoading(false);
  };




  // --- Verification Badge ---
  const getVerificationBadge = (state) => {
    switch (state) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" /> Verified
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            <XCircle className="w-3 h-3" /> Unverified
          </span>
        );
    }
  };

  // --- Loading State ---
  if (status === "loading" || (loading && !initialFetchDone)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center flex flex-col items-center justify-center py-20">
          <CircularProgress size={80} thickness={2} color="primary" />
          <p className="text-gray-600 font-medium mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mt-10">AI GMB Auto Management</h1>
            <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name || "User"}</p>
          </div>

          {accounts.length < maxAccounts && (
            <button
              onClick={handleAddProject}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all px-6 py-3 flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Add Project</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    {accounts.length}/{maxAccounts}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Listings or Empty State */}
        {accounts.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center mt-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listings Found</h3>
            <p className="text-gray-600 mb-6">
              {initialFetchDone
                ? "No Google Business Profiles found. Add your project from Google Business Profile Manager."
                : "Connect your Google Business Profile to get started."}
            </p>
            {!session && (
              <button
                onClick={() => signIn("google", { redirect: false })}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Sign in with Google
              </button>
            )}
          </div>
        ) : (
          accounts.map((acc, idx) => (
            <div key={idx} className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl px-6 py-4 flex justify-between">
                <h2 className="text-xl font-semibold">{acc.email}</h2>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {acc.listings.length} {acc.listings.length === 1 ? "listing" : "listings"}
                </span>
              </div>

              <div className="space-y-4 mt-4">
                {acc.listings.map((listing, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === `${idx}-${i}` ? null : `${idx}-${i}`)
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {listing.title || listing.name || "Unnamed Listing"}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                {listing.primaryCategory || "Uncategorized"}
                              </p>
                            </div>
                            {getVerificationBadge(listing.state)}
                          </div>
                        </div>
                        <button className="ml-6 p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
                          {expandedIndex === `${idx}-${i}` ? (
                            <ChevronUp className="w-6 h-6 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Info */}
                      {expandedIndex === `${idx}-${i}` && (
                        <div className="mt-6 pt-6 border-t space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
                              {/* Card Header */}

                              {/* Card Content */}
                              <div className="bg-white  rounded-xl border border-gray-200 w-full max-w-3xl mx-auto space-y-5">
                                {/* Card Header */}
                                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                                  <Building2 className="w-5 h-5 text-blue-600" />
                                  Business Details
                                </h4>

                                {/* Card Content */}
                                <div className="space-y-4">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 px-5 py-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                                      <Star className="w-5 h-5 text-yellow-500" />
                                      Account ID
                                    </span>
                                    <span className="text-gray-900 font-mono text-sm break-all mt-1 md:mt-0">{listing.name}</span>
                                  </div>

                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 px-5 py-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                                      <Phone className="w-5 h-5 text-green-600" />
                                      Mobile Number
                                    </span>
                                    <span className="text-gray-900 text-sm break-all mt-1 md:mt-0">{listing.phoneNumbers?.primaryPhone || "N/A"}</span>
                                  </div>

                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 px-5 py-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                                      <MapPin className="w-5 h-5 text-blue-500" />
                                      Location ::
                                    </span>
                                    <span className="text-gray-900 text-sm break-all mt-1 mr-4 md:mt-0">{listing.storefrontAddress?.addressLines?.[0] || "N/A"}</span>
                                  </div>

                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 px-5 py-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                                      <Globe className="w-5 h-5 text-purple-600" />
                                      Website
                                    </span>
                                    <span className="text-gray-900 text-sm break-all mt-1 md:mt-0">{listing.websiteUri || "N/A"}</span>
                                  </div>

                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 px-5 py-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                                      <MapPin className="w-5 h-5 text-blue-500" />
                                      State
                                    </span>
                                    <span className="text-gray-900 text-sm break-all mt-1 md:mt-0">{listing.storefrontAddress?.locality || "N/A"}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-3 pt-2">
                                    <Link href="/post-management">
                                      <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm hover:shadow-md">
                                        Manage Listing
                                      </button>
                                    </Link>
                                    <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium shadow-sm hover:shadow-md">
                                      View Analytics
                                    </button>
                                    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition text-sm font-medium shadow-sm hover:shadow-md">
                                      AI Insights
                                    </button>
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
