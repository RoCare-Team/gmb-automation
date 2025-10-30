"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import {
  MapPin,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Building2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
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

export async function fetchLocationsByAccount(accessToken, accountId, pageToken = null) {
  try {
    let url = `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,openInfo,metadata&pageSize=10`;

    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) throw new Error(`Failed to fetch locations for account ${accountId}`);

    const data = await res.json();
    return {
      locations: data.locations || [],
      nextPageToken: data.nextPageToken || null
    };
  } catch (err) {
    console.error(`Error fetching locations for account ${accountId}:`, err);
    return { locations: [], nextPageToken: null };
  }
}

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total: 0, verified: 0, unverified: 0, pending: 0 });
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTokens, setPageTokens] = useState([null]); // Array to store tokens for each page
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const userPlan = session?.user?.plan || "";
  const maxAccounts = userPlan === "" ? 1 : 0;

  const listRef = useRef()

  // --- Fetch Accounts & Locations ---
  const fetchInitialData = async (pageToken = null) => {
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

    // Fetch locations with pagination
    const accountId = accountsData[0].name.replace("accounts/", "");
    const { locations, nextPageToken: newNextToken } = await fetchLocationsByAccount(
      token,
      accountId,
      pageToken
    );

    if (locations.length > 0) {
      const locationsWithAccount = locations.map((loc) => ({
        ...loc,
        accountId,
        accountName: accountsData[0].accountName || accountsData[0].name,
      }));

      setAccounts([{ email: session.user.email, listings: locationsWithAccount }]);
      setNextPageToken(newNextToken);
      setHasMore(!!newNextToken);
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

  // Handle pagination
  const handleNextPage = () => {
    if (nextPageToken && !loading) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);

      // Store the token for this page if not already stored
      if (!pageTokens[newPage]) {
        setPageTokens([...pageTokens, nextPageToken]);
      }

      fetchInitialData(nextPageToken);

      window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scroll
    });
    }
  };


useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);


  const handlePrevPage = () => {
    if (currentPage > 1 && !loading) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const prevToken = pageTokens[newPage - 1];
      fetchInitialData(prevToken);
    }
  };
const handleListingData = (listing) => {
  console.log("listinglisting",listing);
  
  const dataToSend = {
    locality: listing?.storefrontAddress?.locality || "",
    website: listing?.websiteUri || "",
  };

  // Save to localStorage instead of sessionStorage
  localStorage.setItem("listingData", JSON.stringify(dataToSend));
  localStorage.setItem("accountId", listing.accountId);

  // Navigate
  router.push(`/post-management/${listing.name}`);
};




  // --- Summary Update ---
  useEffect(() => {
    if (accounts.length > 0) {
      const allListings = accounts.flatMap((acc) => acc.listings);
      console.log("allListings", allListings);

      const total = allListings.length;
      const verified = allListings.filter((l) => l.openInfo?.status === "OPEN").length;
      const pending = allListings.filter((l) => l.openInfo?.status === "OPEN_FOROPEN_BUSINESS_UNSPECIFIED").length;
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

    if (accountsData.length > 0) {
      const accountId = accountsData[0].name.replace("accounts/", "");
      const { locations } = await fetchLocationsByAccount(token, accountId);

      const locationsWithAccount = locations.map((loc) => ({
        ...loc,
        accountId,
        accountName: accountsData[0].accountName || accountsData[0].name,
      }));

      if (locationsWithAccount.length > 0) {
        setAccounts((prev) => [...prev, { email: session.user.email, listings: locationsWithAccount }]);
        toast.success("GMB listings fetched successfully!");
      } else {
        toast.info("No locations found under this account.");
      }
    }

    setLoading(false);
  };

  // --- Verification Badge ---
  const getVerificationBadge = (listing) => {
    const isVerified = true === true;

    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
          <CheckCircle className="w-3.5 h-3.5" /> Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
          <XCircle className="w-3.5 h-3.5" /> Unverified
        </span>
      );
    }
  };

  // --- Loading State ---
  if (status === "loading" || (loading && !initialFetchDone)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center flex flex-col items-center justify-center">
          <CircularProgress size={60} thickness={4} sx={{ color: "#3b82f6" }} />
          <p className="text-gray-700 font-semibold mt-6 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  


  console.log("summary",summary);
  



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mt-14">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI GMB Auto Management
              </h1>
              <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name || "User"} 👋</p>
            </div>
{session && (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-300"
        >
          Logout
        </button>
      )}


            {accounts.length < maxAccounts && (
              <button
                onClick={handleAddProject}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all px-6 py-3 flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Project
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {accounts.length}/{maxAccounts}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Listings in This Page</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total}</p>
                </div>
                <Building2 className="w-10 h-10 text-blue-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Verified</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{summary.verified}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unverified</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                </div>
                <XCircle className="w-10 h-10 text-red-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{summary.pending}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-500 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Listings or Empty State */}
        {accounts.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Listings Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {initialFetchDone
                ? "No Google Business Profiles found. Add your project from Google Business Profile Manager."
                : "Connect your Google Business Profile to get started."}
            </p>
            {!session && (
              <button
                onClick={() => signIn("google", { redirect: false })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:opacity-90 transition font-semibold shadow-lg"
              >
                Sign in with Google
              </button>
            )}
          </div>
        ) : (
          accounts.map((acc, idx) => (
            <div key={idx} className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl px-6 py-5 flex justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold">{acc.email}</h2>
                <span className="text-sm bg-white/20 px-4 py-2 rounded-full font-semibold backdrop-blur-sm">
                  {acc.listings.length} {acc.listings.length === 1 ? "listing" : "listings"}
                </span>
              </div>

              <div ref={listRef} className="space-y-4 mt-4">
                {acc.listings.map((listing, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-400">
                    <div className="p-6">
                      {/* Header Section */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {listing.title || listing.name || "Unnamed Listing"}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {listing.categories?.primaryCategory?.displayName || "Uncategorized"}
                          </p>
                        </div>
                        {getVerificationBadge(listing)}
                      </div>

                      {/* Manage Listing Button - Prominent */}

                      {/* Business Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-700">Phone</span>
                          </div>
                          <p className="text-gray-900 font-medium">{listing.phoneNumbers?.primaryPhone || "N/A"}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-700">Website</span>
                          </div>
                          <Link
                            href={listing.websiteUri || "#"}
                            className="text-gray-900 font-medium truncate"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {listing.websiteUri || "N/A"}
                          </Link>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200 md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-gray-700">Address</span>
                          </div>
                          <p className="text-gray-900 font-medium">
                            {listing.storefrontAddress?.addressLines?.join(", ") || "N/A"}
                            {listing.storefrontAddress?.locality && `, ${listing.storefrontAddress.locality}`}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                          onClick={() => handleListingData(listing)}
                          className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition text-base font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <Star className="w-5 h-5" />
                          Manage This Listing
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {(currentPage > 1 || hasMore) && (
                <div className="flex items-center justify-center gap-4 mt-8 bg-white rounded-xl shadow-md p-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  <span className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold">
                    Page {currentPage}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}