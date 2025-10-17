"use client";
import { useEffect, useState } from "react";
import { Loader2, Star, MessageCircle } from "lucide-react";

const accountId = "116862092928692422428"
const locationId = "1940115651408221204"

export default function DashboardPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Google My Business reviews
const fetchReviews = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/reviews"); // ✅ call your server route
    const data = await res.json();
    setReviews(data.reviews || []);
  } catch (err) {
    console.error("Error fetching reviews:", err);
  } finally {
    setLoading(false);
  }
};
  

  useEffect(() => {
    fetchReviews();
  }, []);

  // ✅ Auto reply to review
  const handleReply = async (reviewId) => {
    try {
      await fetch(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            comment: "Thank you for visiting our business!",
          }),
        }
      );
      alert("✅ Reply posted successfully!");
      fetchReviews();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  // ⭐ Star Rating Component
  const StarRating = ({ rating }) => {
    const filled =
      rating === "FIVE"
        ? 5
        : rating === "FOUR"
        ? 4
        : rating === "THREE"
        ? 3
        : rating === "TWO"
        ? 2
        : 1;
    return (
      <div className="flex gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < filled
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // 🧾 Review Card Component
  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.reviewer?.profilePhotoUrl ? (
            <img
              src={review.reviewer.profilePhotoUrl}
              alt={review.reviewer?.displayName}
              className="w-14 h-14 rounded-full border shadow-sm object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              {review.reviewer?.displayName?.[0] || "U"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 text-lg">
              {review.reviewer?.displayName || "Anonymous User"}
            </h3>
            <span className="text-sm text-gray-400">
              {new Date(review.createTime).toLocaleDateString()}
            </span>
          </div>

          <StarRating rating={review.starRating} />

          <p className="text-gray-700 mt-1 leading-relaxed">
            {review.comment || "No comment provided."}
          </p>

          {review.reviewReply && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-800">
                <b>Reply:</b> {review.reviewReply.comment}
              </p>
            </div>
          )}

          <button
            onClick={() => handleReply(review.reviewId)}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <MessageCircle className="w-4 h-4" />
            AI Auto Reply
          </button>
        </div>
      </div>
    </div>
  );

  console.log("reviews",reviews);
  

  // 🧩 Page Layout
  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="text-gray-500 mt-1">
          Manage and respond to your Google Business reviews easily.
        </p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500">
            No reviews found for this location yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
