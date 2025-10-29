"use client";
import { useEffect, useState } from "react";
import { Loader2, Star, MessageCircle, Send, Sparkles, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const accountId = "116862092928692422428";
const locationId = "1940115651408221204";

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast notification handler
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      
      if (res.ok) {
        setReviews(data.reviews || []);
        showToast("Reviews loaded successfully", "success");
      } else {
        showToast("Failed to fetch reviews", "error");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      showToast("Error loading reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // AI Auto Reply
  const handleAIReply = async (review) => {
    try {
      setReplyingTo(review.reviewId);
      
      // Call AI API to generate reply
      const aiRes = await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewText: review.comment,
          rating: review.starRating,
          reviewerName: review.reviewer?.displayName,
        }),
      });

      const { reply } = await aiRes.json();

      // Post the AI-generated reply
      const postRes = await fetch("/api/post-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review.reviewId,
          comment: reply,
        }),
      });

      if (postRes.ok) {
        showToast("AI reply posted successfully!", "success");
        fetchReviews();
      } else {
        showToast("Failed to post AI reply", "error");
      }
    } catch (err) {
      console.error("Error posting AI reply:", err);
      showToast("Error posting AI reply", "error");
    } finally {
      setReplyingTo(null);
    }
  };

  // Manual Reply
  const handleManualReply = async (reviewId, replyText, setLocalReply, setShowReplyInput) => {
    if (!replyText.trim()) {
      showToast("Please enter a reply message", "error");
      return;
    }

    try {
      setReplyingTo(reviewId);

      const res = await fetch("/api/post-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          comment: replyText,
        }),
      });

      if (res.ok) {
        showToast("Manual reply posted successfully!", "success");
        setLocalReply("");
        setShowReplyInput(false);
        fetchReviews();
      } else {
        showToast("Failed to post reply", "error");
      }
    } catch (err) {
      console.error("Error posting manual reply:", err);
      showToast("Error posting reply", "error");
    } finally {
      setReplyingTo(null);
    }
  };

  // Toast Component
  const Toast = ({ message, type }) => (
    <div className="fixed top-18 right-6 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );

  // Star Rating Component
  const StarRating = ({ rating }) => {
    const filled =
      rating === "FIVE" ? 5 :
      rating === "FOUR" ? 4 :
      rating === "THREE" ? 3 :
      rating === "TWO" ? 2 : 1;
    
    return (
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < filled
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Review Card Component
  const ReviewCard = ({ review }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [localReply, setLocalReply] = useState("");
    const isReplying = replyingTo === review.reviewId;

    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar */}
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

          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
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
              </div>
            </div>

            <StarRating rating={review.starRating} />

            <p className="text-gray-700 mt-2 leading-relaxed text-base">
              {review.comment || "No comment provided."}
            </p>

            {/* Existing Reply */}
            {review.reviewReply && (
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Your Reply
                    </p>
                    <p className="text-sm text-green-800 leading-relaxed">
                      {review.reviewReply.comment}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!review.reviewReply && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleAIReply(review)}
                  disabled={isReplying}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReplying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  AI Auto Reply
                </button>

                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Manual Reply
                </button>
              </div>
            )}

            {/* Manual Reply Input */}
            {showReplyInput && !review.reviewReply && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
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
                    onClick={() => handleManualReply(review.reviewId, localReply, setLocalReply, setShowReplyInput)}
                    disabled={isReplying || !localReply.trim()}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isReplying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send Reply
                  </button>
                  <button
                    onClick={() => {
                      setShowReplyInput(false);
                      setLocalReply("");
                    }}
                    disabled={isReplying}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all disabled:opacity-50"
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
        {/* Toast Notification */}
        {toast && <Toast message={toast.message} type={toast.type} />}

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Customer Reviews
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and respond to your Google Business reviews with AI assistance
              </p>
            </div>
            <button
              onClick={fetchReviews}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 text-lg">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow-sm text-center border border-gray-100">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No reviews found for this location yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.reviewId} review={review} />
            ))}
          </div>
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