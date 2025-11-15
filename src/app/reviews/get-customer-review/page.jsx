"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const router = useRouter();

  // ---------------- READ BUSINESS NAME ----------------
  const getBusinessName = () => {
    try {
      const raw = localStorage.getItem("locationDetails");
      if (!raw) return "";

      const parsed = JSON.parse(raw);

      // always take FIRST entry title
      return parsed[0]?.title || "";
    } catch (e) {
      console.error("localStorage error", e);
      return "";
    }
  };

  // ---------------- AUTO FETCH ON PAGE LOAD ----------------
  useEffect(() => {
    fetchReviews();
  }, []);

  // ---------------- FETCH REVIEWS BY BUSINESS NAME ----------------
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const business = getBusinessName();
      console.log("Selected Business:", business);

      const res = await fetch(`/api/customer-review?business=${business}`);
      const data = await res.json();

      if (!data.success) {
        setError("Something went wrong!");
        return;
      }

      setReviews(data.reviews);

    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 
                 rounded-lg shadow hover:bg-gray-100 transition text-gray-700 font-medium"
    >
      ← Back
    </button>
      <h1 className="text-3xl font-bold text-center mb-6">
        Customer Reviews Dashboard
      </h1>

      {loading && (
        <p className="text-center text-lg font-semibold text-gray-600">
          Loading reviews...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600 font-medium">{error}</p>
      )}

      <div className="mt-6 max-w-2xl mx-auto space-y-4">
        {reviews.length === 0 && !loading && (
          <p className="text-center text-gray-500">No reviews found.</p>
        )}

        {reviews.map((r) => (
          <div
            key={r._id}
            className="bg-white p-5 rounded-xl shadow border hover:shadow-lg transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 font-semibold text-sm">Name</p>
                <p className="text-gray-900 font-medium">
                  {r.name || "Anonymous User"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold text-sm">Business</p>
                <p className="text-indigo-600 font-medium">
                  {r.business || "Not Provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold text-sm">Rating</p>
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-500"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-500 font-semibold text-sm">Date</p>
                <p className="text-gray-700">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-500 font-semibold text-sm">Feedback</p>
              <p className="text-gray-700">
                {r.feedback || "No feedback given"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
