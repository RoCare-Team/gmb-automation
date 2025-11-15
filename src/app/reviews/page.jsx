"use client";
import { useEffect, useState } from "react";
import { Star, Download, MessageSquare, ExternalLink } from "lucide-react";

export default function BusinessQR() {
  const [business, setBusiness] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [rating, setRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submittedRatings, setSubmittedRatings] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Generate QR
  const generateQR = (url) => {
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      url
    )}`;
    setQrImage(qr);
  };

  useEffect(() => {
      const locationDetailsStr = localStorage.getItem("locationDetails");
      const locationDetails = JSON.parse(locationDetailsStr);

      const bussinessLocation = locationDetails[0]?.title;
      setBusiness(name);

    const saved = JSON.parse(sessionStorage.getItem("ratings") || "[]");
    setSubmittedRatings(saved);

    const qrURL = `https://limbu.ai/qr-management/${name
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()}`;

    generateQR(qrURL);
  }, []);

  // ⭐ Rating Logic
  const handleRating = (value) => {
    setRating(value);

    if (value <= 3) {
      setShowFeedback(true);
    } else {
      setRedirecting(true);
      setTimeout(() => {
        window.open("https://www.google.com/search?q=leave+a+review", "_blank");
        setRedirecting(false);
        setShowSuccess(true);
        saveRating(value, "Positive review - Redirected to Google");
      }, 1200);
    }
  };

  // ⭐ Save ratings
  const saveRating = (stars, note) => {
    const newRating = {
      id: Date.now(),
      stars,
      note,
      date: new Date().toLocaleString(),
    };
    const updated = [newRating, ...submittedRatings];
    setSubmittedRatings(updated);
    sessionStorage.setItem("ratings", JSON.stringify(updated));
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      saveRating(rating, feedback);
      setShowFeedback(false);
      setShowSuccess(true);
      setFeedback("");
    }
  };

  // ✅ PERFECT HD QR DOWNLOAD (Canvas 2x Quality)
  const downloadQR = async () => {
    if (!qrImage) return;

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Important for QR API
    img.src = qrImage;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 3; // Super HD (3x)
      canvas.height = img.height * 3;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${business}-qr.png`;
      a.click();
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{business}</h1>
          <p className="text-gray-600">QR Code Management & Feedback System</p>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-indigo-600">📱</span> QR Code
            </h2>

            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-8 mb-6">
              {qrImage && (
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>

            <button
              onClick={downloadQR}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <Download size={20} />
              Download QR Code
            </button>
          </div>

          {/* Rating Section */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Rate Your Experience
              </h2>

              <div className="flex gap-2 justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`transition-all transform hover:scale-110 ${
                      rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <Star
                      size={48}
                      fill={rating >= star ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>

              {redirecting && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-lg">
                    <ExternalLink className="animate-pulse" size={20} />
                    <span className="font-semibold">
                      Redirecting to Google Reviews...
                    </span>
                  </div>
                </div>
              )}

              {showSuccess && !redirecting && (
                <div className="text-center py-4 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-semibold text-lg">
                    ⭐ Thank you for your feedback!
                  </p>
                </div>
              )}
            </div>

            {/* Feedback History */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare size={24} className="text-indigo-600" />
                Recent Feedback
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {submittedRatings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No feedback yet. Be the first!
                  </p>
                ) : (
                  submittedRatings.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < item.stars ? "#fbbf24" : "none"}
                              className={
                                i < item.stars
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{item.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Help Us Improve
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry! Please share what went wrong.
            </p>

            <textarea
              className="w-full border-2 border-gray-200 p-4 rounded-xl min-h-[150px] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Share your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
                onClick={submitFeedback}
                disabled={!feedback.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
