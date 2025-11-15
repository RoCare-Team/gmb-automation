"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Star, ExternalLink, CheckCircle, Sparkles } from "lucide-react";

export default function BusinessQR() {
  const pathname = usePathname();

  const [business, setBusiness] = useState("");
  const [rating, setRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [reviewUri, setReviewUri] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [customerName, setCustomerName] = useState("");

  console.log("pathname",pathname);
  

  // ⭐ Fetch business Google Review URL
  const fetchBusinessReviewUri = async (businessTitle) => {
    try {
      const encodedTitle = encodeURIComponent(businessTitle);

      const res = await fetch(`/api/user-bussiness/${encodedTitle}`);
      const data = await res.json();

      if (data?.newReviewUri) {
        setReviewUri(data.newReviewUri);
      } else {
        setErrorMsg("⚠ No Google Review link found for this business");
      }
    } catch {
      setErrorMsg("⚠ Something went wrong! Try again later.");
    }
  };

  // ⭐ Load slug → extract business name → fetch API
  useEffect(() => {
    if (!pathname) return;

    const slug = pathname.split("/").pop();
    const businessName = slug.replace(/-/g, " ");

    setBusiness(businessName);

    fetchBusinessReviewUri(businessName);
  }, [pathname]);

  // ⭐ Save review to database
  const saveReviewToDB = async ({ name, rating, feedback }) => {
    try {
      const payload = {
        business,
        rating,
        name: name?.trim() || "Anonymous",
        feedback: feedback?.trim() || "",
      };

      await fetch("/api/customer-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Save Review Error:", err);
    }
  };

  // ⭐ When user clicks a star
  const handleRating = (value) => {
    setRating(value);

    if (value <= 3) {
      // For low ratings → ask for feedback
      setShowFeedback(true);
    } else {
      if (!reviewUri) {
        setErrorMsg("⚠ Google review link missing!");
        return;
      }

      // High rating → save internally + redirect to Google Review
      setRedirecting(true);

      setTimeout(async () => {
        await saveReviewToDB({
          name: customerName,
          rating: value,
        });

        window.open(reviewUri, "_blank");

        setRedirecting(false);
        setShowSuccess(true);
      }, 1200);
    }
  };

  // ⭐ Submit low-rating feedback
  const submitFeedback = async () => {
    if (!feedback.trim()) return;

    await saveReviewToDB({
      name: customerName,
      rating,
      feedback,
    });

    setShowFeedback(false);
    setShowSuccess(true);
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            <span>Customer Feedback</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{business}</h1>
          <p className="text-gray-600 text-lg">Share your experience with us</p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-center max-w-xl mx-auto">
            {errorMsg}
          </div>
        )}

        {/* Customer Name Input */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Enter your name (optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-gray-700 bg-white shadow-sm transition-colors"
          />
        </div>

        {/* Rating Section */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl max-w-2xl mx-auto border border-gray-100">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Rate Your Experience
          </h2>
          <p className="text-center text-gray-600 mb-8">Tap a star to share your rating</p>

          {/* Star Rating */}
          <div className="flex gap-3 justify-center mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={redirecting}
                className="transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star
                  size={56}
                  className={`transition-all duration-300 ${
                    rating >= star ? "text-yellow-400 drop-shadow-lg" : "text-gray-300"
                  }`}
                  fill={rating >= star ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {/* Redirecting Loader - Attractive Animation */}
          {redirecting && (
            <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-3xl p-8 text-center shadow-lg">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-10 animate-pulse"></div>
              
              <div className="relative flex flex-col items-center gap-5">
                {/* Multi-layer Animated Circle Loader */}
                <div className="relative w-24 h-24">
                  {/* Outer rotating ring */}
                  <div className="absolute inset-0 border-4 border-green-200 rounded-full opacity-30"></div>
                  <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
                  
                  {/* Inner rotating ring - opposite direction */}
                  <div className="absolute inset-2 border-4 border-emerald-300 rounded-full opacity-40"></div>
                  <div className="absolute inset-2 border-4 border-emerald-600 rounded-full border-b-transparent border-l-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
                  
                  {/* Center icon with pulse */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-3 bg-white rounded-full shadow-lg animate-pulse">
                      <ExternalLink className="text-green-600" size={32} />
                    </div>
                  </div>
                </div>
                
                {/* Text with engaging message */}
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-green-800 animate-pulse">
                    🎉 Something Amazing is Happening...
                  </p>
                  <p className="text-base text-green-700 font-medium">
                    Thank you for your wonderful feedback!
                  </p>
                  <p className="text-sm text-green-600">
                    Preparing your Google Review experience
                  </p>
                </div>

                {/* Animated progress bar */}
                <div className="w-full max-w-xs h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" style={{animation: 'pulse 1s ease-in-out infinite'}}></div>
                </div>

                {/* Dancing dots */}
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce shadow-lg"></div>
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.15s'}}></div>
                  <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.3s'}}></div>
                </div>

                {/* Sparkle effect */}
                <div className="flex gap-2 text-yellow-500">
                  <Sparkles size={20} className="animate-pulse" />
                  <Sparkles size={16} className="animate-pulse" style={{animationDelay: '0.3s'}} />
                  <Sparkles size={20} className="animate-pulse" style={{animationDelay: '0.6s'}} />
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && !redirecting && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
                <div>
                  <p className="text-xl font-bold text-green-800 mb-1">Thank You!</p>
                  <p className="text-sm text-green-600">Your feedback has been submitted successfully</p>
                </div>
              </div>
            </div>
          )}

          {/* Rating Description */}
          {!redirecting && !showSuccess && rating === 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-center">
                <div className="flex gap-1 justify-center mb-2">
                  {[1, 2, 3].map((i) => (
                    <Star key={i} size={16} className="text-orange-500" fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 font-medium">Share private feedback</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                <div className="flex gap-1 justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="text-green-600" fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 font-medium">Post on Google Reviews</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl transform animate-in">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-orange-100 rounded-2xl mb-4">
                <Star size={32} className="text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Help Us Improve</h2>
              <p className="text-gray-600 text-sm">We appreciate your honest feedback</p>
            </div>

            <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none transition-colors"
              placeholder="Share your thoughts with us..."
              rows="5"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl transition-colors font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={!feedback.trim()}
                onClick={submitFeedback}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}