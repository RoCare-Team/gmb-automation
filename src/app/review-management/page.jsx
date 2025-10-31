"use client";
import { useEffect, useState } from "react";
import {
  Loader2,
  Star,
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const { data: session } = useSession();

  // Toast handler
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all reviews (with pagination handling)
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const locationDetails = JSON.parse(localStorage.getItem("locationDetails") || "[]");
      const token = session?.accessToken;

      if (!locationDetails.length || !token) {
        showToast("Missing account or location data", "error");
        setLoading(false);
        return;
      }

      const acc_id = locationDetails[0]?.accountId;
      const locationIds = locationDetails.map((loc) => loc.locationId);
      let allReviews = [];
      let pageToken = null;

      do {
        const res = await fetch("https://n8n.srv968758.hstgr.cloud/webhook/b3f4dda4-aef1-4e87-a426-b503cee3612b", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            acc_id,
            locationIds,
            access_token: token,
            pageToken, // pagination cursor
          }),
        });

        const data = await res.json();

        if (res.ok && data.reviews) {
          allReviews = [...allReviews, ...data.reviews];
          pageToken = data.nextPageToken || null;
        } else {
          showToast("Failed to fetch reviews", "error");
          break;
        }
      } while (pageToken);

      setReviews(allReviews);
      showToast(`Loaded ${allReviews.length} reviews successfully`, "success");
    } catch (err) {
      console.error("Error fetching reviews:", err);
      showToast("Error loading reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on first load
  useEffect(() => {
    fetchReviews();
  }, [session]);

  // Pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIdx = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIdx, startIdx + reviewsPerPage);

  // --- Components ---
  const Toast = ({ message, type }) => (
    <div className="fixed top-18 right-6 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );

  const StarRating = ({ rating }) => {
    const filled =
      rating === "FIVE" ? 5 : rating === "FOUR" ? 4 : rating === "THREE" ? 3 : rating === "TWO" ? 2 : 1;
    return (
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const ReviewCard = ({ review }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [localReply, setLocalReply] = useState("");
    const isReplying = replyingTo === review.reviewId;

    const handleManualReply = async () => {
      if (!localReply.trim()) {
        showToast("Please enter a reply message", "error");
        return;
      }

      try {
        setReplyingTo(review.reviewId);
        const res = await fetch("/api/post-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId: review.reviewId, comment: localReply }),
        });
        if (res.ok) {
          showToast("Reply posted successfully!", "success");
          fetchReviews();
          setShowReplyInput(false);
          setLocalReply("");
        } else showToast("Failed to post reply", "error");
      } catch {
        showToast("Error posting reply", "error");
      } finally {
        setReplyingTo(null);
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-shrink-0">
            {review.reviewer?.profilePhotoUrl ? (
              <img
                src={review.reviewer.profilePhotoUrl}
                alt={review.reviewer?.displayName}
                className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {review.reviewer?.displayName?.[0] || "U"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">
              {review.reviewer?.displayName || "Anonymous User"}
            </h3>
            <span className="text-sm text-gray-400">
              {new Date(review.createTime).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>

            <StarRating rating={review.starRating} />
            <p className="text-gray-700 mt-2">{review.comment || "No comment provided."}</p>

            {review.reviewReply && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-900 mb-1">Your Reply</p>
                <p className="text-sm text-green-800">{review.reviewReply.comment}</p>
              </div>
            )}

            {!review.reviewReply && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="bg-white text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  <MessageCircle className="w-4 h-4 inline-block mr-2" />
                  Reply
                </button>
              </div>
            )}

            {showReplyInput && (
              <div className="mt-4">
                <textarea
                  value={localReply}
                  onChange={(e) => setLocalReply(e.target.value)}
                  placeholder="Write your reply here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows="3"
                  disabled={isReplying}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleManualReply}
                    disabled={isReplying || !localReply.trim()}
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                  <button
                    onClick={() => setShowReplyInput(false)}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6 pt-24">
        {toast && <Toast message={toast.message} type={toast.type} />}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600 text-lg">
            Manage and respond to your Google Business reviews with AI assistance
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 text-lg">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow-sm text-center border border-gray-100">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No reviews found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {currentReviews.map((review) => (
                <ReviewCard key={review.reviewId} review={review} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-600 hover:text-blue-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-600 hover:text-blue-600 disabled:opacity-50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
