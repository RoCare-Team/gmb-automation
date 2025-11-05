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
  ChevronLeft,
  ChevronRight,
  Lock,
  Zap,
  RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPlan, setUserPlan] = useState(null);
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false);
  const reviewsPerPage = 5;

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const plan = localStorage.getItem("plan");
    const normalizedPlan = plan ? plan.trim() : null;
    setUserPlan(normalizedPlan);
    setCheckingPlan(false);
    
    console.log("User plan detected:", normalizedPlan);
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const locationDetails = JSON.parse(localStorage.getItem("locationDetails") || "[]");
      const token = session?.accessToken;

      if (!locationDetails.length || !token) {
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
            pageToken,
          }),
        });

        const data = await res.json();

        if (res.ok && data.reviews) {
          allReviews = [...allReviews, ...data.reviews];
          pageToken = data.nextPageToken || null;
        } else {
          break;
        }
      } while (pageToken);

      setReviews(allReviews);
      setHasLoadedReviews(true);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIdx = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIdx, startIdx + reviewsPerPage);

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
      if (!localReply.trim()) return;

      try {
        setReplyingTo(review.reviewId);
        const res = await fetch("/api/post-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId: review.reviewId, comment: localReply }),
        });
        if (res.ok) {
          fetchReviews();
          setShowReplyInput(false);
          setLocalReply("");
        }
      } catch (err) {
        console.error(err);
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
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                  <button
                    onClick={() => setShowReplyInput(false)}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all px-4 py-2"
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

  if (checkingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (userPlan && userPlan.toLowerCase() === "basic") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Upgrade Your Plan
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Review management is not available on the Basic plan. Upgrade to access premium features.
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 text-left">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Premium Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">View and manage all customer reviews in one place</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">AI-powered reply suggestions for faster responses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Multi-location review management support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced analytics and customer insights</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => router.push("/subscription")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg px-12 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3"
            >
              <Zap className="w-5 h-5" />
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600 text-lg">
            Manage and respond to your Google Business reviews with AI assistance
          </p>
        </div>

        {!hasLoadedReviews ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <RefreshCw className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Load Your Reviews</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Click the button below to fetch all your customer reviews from Google Business
              </p>
              <button
                onClick={fetchReviews}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg px-10 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Loading Reviews...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-6 h-6" />
                    Get Reviews
                  </>
                )}
              </button>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow-sm text-center border border-gray-100">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No reviews found</p>
            <p className="text-gray-400 text-sm">Your business doesn't have any reviews yet</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700 font-medium">
                Showing {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={fetchReviews}
                disabled={loading}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all inline-flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </button>
            </div>

            <div className="grid gap-6">
              {currentReviews.map((review) => (
                <ReviewCard key={review.reviewId} review={review} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-600 hover:text-blue-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-600 hover:text-blue-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}