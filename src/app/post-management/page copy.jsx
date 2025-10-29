"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  Clock,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Download,
  Share2,
  Upload,
  X,
} from "lucide-react";
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

// Toast Component
const Toast = ({ message, type = "success" }) => (
  <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`}>
    {message}
  </div>
);

// Loading Overlay Component - Only for AI Generation
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-6 max-w-sm w-full border border-white/20">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse"></div>
        <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-white animate-spin relative z-10" />
        <Sparkles className="w-7 h-7 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
      </div>
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-white">Generating Your Post</h3>
        <p className="text-blue-100 text-sm">AI is creating something amazing...</p>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 h-full rounded-full animate-shimmer"></div>
      </div>
    </div>
  </div>
);

// Post Input Component
const PostInput = ({ prompt, setPrompt, logo, setLogo, onGenerate, loading }) => {
  const removeImage = () => setLogo(null);

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/50 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100">
      <div className="flex flex-col space-y-5">
        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            What would you like to create?
          </label>

          <textarea
            placeholder="Describe your post idea... e.g., 'Create a festive Diwali offer post for RO water purifier with 30% discount'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-none placeholder:text-gray-400 bg-white shadow-sm"
            disabled={loading}
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-3">
          <label className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            Add Your Logo (Optional)
          </label>

          {!logo ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-100/50 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-10 h-10 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-gray-600 font-medium">Click to upload logo</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                className="hidden"
                disabled={loading}
              />
            </label>
          ) : (
            <div className="relative w-full h-32 bg-white rounded-xl border-2 border-blue-200 p-3 shadow-sm">
              <img
                src={URL.createObjectURL(logo)}
                alt="Logo Preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-bold text-lg"
        >
          <Sparkles className="w-6 h-6" />
          Generate Post with AI
        </button>

        {/* Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span><strong>Pro Tip:</strong> Be specific about your business, offer details, colors, and style for best results!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ tab, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-3.5 rounded-xl border-2 text-sm md:text-base font-bold transition-all flex-1 min-w-0 shadow-sm hover:shadow-md ${isActive
      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent scale-105"
      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
      }`}
  >
    <tab.icon className="w-5 h-5 flex-shrink-0" />
    <span className="truncate hidden sm:inline">{tab.label}</span>
    <span className="truncate sm:hidden">{tab.shortLabel || tab.label}</span>
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${isActive ? "bg-white/25 text-white" : "bg-blue-100 text-blue-700"
        }`}
    >
      {count}
    </span>
  </button>
);

// Post Card Component
const PostCard = ({ post, showFull, setShowFull, scheduleDates, onDateChange, onUpdateStatus, onReject, handleDownload, handleShare, handlePost, isEditing, setIsEditing }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
    <a href={post.aiOutput} target="_blank">
      <div className="relative">
        <img
          src={post?.aiOutput || "https://via.placeholder.com/400"}
          alt="Post"
          className="w-full h-56 md:h-64 object-cover"
        />
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${post.status === "pending" ? "bg-yellow-500 text-white" :
          post.status === "approved" ? "bg-green-500 text-white" :
            "bg-blue-500 text-white"
          }`}>
          {post.status.toUpperCase()}
        </div>
      </div>
    </a>

    <div className="p-5 space-y-4">
      <div className="mt-2">
        <strong className="text-gray-900 block mb-1">Description:</strong>

        {isEditing ? (
          <textarea
            value={post?.description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 text-sm"
            rows={5}
          />
        ) : (
          <p
            className={`text-sm text-gray-700 ${showFull ? "" : "line-clamp-4"
              }`}
          >
            {post?.description || "No description available"}
          </p>
        )}

        {post?.description?.length > 150 && !isEditing && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-blue-600 text-sm font-medium mt-1 hover:underline"
          >
            {showFull ? "View Less" : "View More"}
          </button>
        )}

        <div className="mt-3 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  // You can handle save logic here (API or state update)
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDescription(post?.description || "");
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
            >
              Edit Description
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
      </p>


      <div className="flex flex-col gap-3 pt-2">
        {post.status === "pending" && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onUpdateStatus(post._id, "approved")}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReject(post._id)}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}

        {post.status === "approved" && (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleDownload(post)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              <button
                onClick={() => handleShare(post)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="datetime-local"
                value={scheduleDates[post._id] || ""}
                onChange={(e) => onDateChange(post._id, e.target.value)}
                min={new Date().toISOString().slice(0, 16)} // 🚫 disables past date/time
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can only select current or future date & time
              </p>

              <button
                onClick={() => onUpdateStatus(post._id, "scheduled")}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule Post
              </button>
            </div>
          </div>
        )}

        {post.status === "scheduled" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3 space-y-4">
            {/* Scheduled Info */}
            <div>
              <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
                📅 Scheduled for:
              </p>
              <p className="text-blue-700 font-bold mt-1">
                {post.scheduledDate
                  ? new Date(post.scheduledDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "Not set"}
              </p>
            </div>

            {/* Download + Share Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleDownload(post)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              <button
                onClick={() => handleShare(post)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Post Button (Separate Line) */}
            <div className="pt-2">
              <button
                onClick={() => handlePost(post)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LabelImportantIcon className="w-4 h-4" />
                Post
              </button>
            </div>
          </div>
        )}





      </div>
    </div>
  </div>
);

// Main Component
export default function PostManagement() {
  const { data: session } = useSession()
  const { slug } = useParams();



  const [savedPost, setSavedPost] = useState()

  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [aiResponse, setAiResponse] = useState(null);

  const [activeTab, setActiveTab] = useState("total");
  const [prompt, setPrompt] = useState("");
  const [scheduleDates, setScheduleDates] = useState({});
  const [logo, setLogo] = useState(null);
  const [toast, setToast] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [isEditing, setIsEditing] = useState(false);




  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [allCounts, setAllCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    scheduled: 0,
  });

  const tabs = [
    { id: "pending", label: "Pending", shortLabel: "Pending", icon: Clock, count: allCounts.pending },
    { id: "approved", label: "Approved", shortLabel: "Approved", icon: CheckCircle, count: allCounts.approved },
    { id: "scheduled", label: "Scheduled", shortLabel: "Scheduled", icon: Calendar, count: allCounts.scheduled },
    { id: "total", label: "Total Posts", shortLabel: "Total", icon: ImageIcon, count: allCounts.total },
  ];


  const fetchPosts = async (status) => {
    try {
      const userId = localStorage.getItem("userId"); // ✅ later make dynamic from session/auth

      // build url with userId and optional status
      const url =
        status === "total"
          ? `/api/post-status?userId=${userId}`
          : `/api/post-status?userId=${userId}&status=${status}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      setPosts(data.data);

      // ✅ fetch all posts again for counts
      const allPostsRes = await fetch(`/api/post-status?userId=${userId}`);
      const allPostsData = await allPostsRes.json();

      if (allPostsRes.ok && allPostsData.success) {
        const allPosts = allPostsData.data;
        const total = allPosts.length;
        const approved = allPosts.filter((p) => p.status === "approved").length;
        const pending = allPosts.filter((p) => p.status === "pending").length;
        const scheduled = allPosts.filter((p) => p.status === "scheduled").length;

        setAllCounts({ total, approved, pending, scheduled });
      }
    } catch (err) {
      showToast(err.message || "Error fetching posts", "error");
    }
  };


  // Helper: File -> Base64 string
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleAiAgent = async () => {
    const userId = localStorage.getItem("userId"); // ✅ later make dynamic from session/auth

    if (!prompt.trim()) {
      showToast("Please enter a prompt before generating!", "error");
      return;
    }

    try {
      setIsGenerating(true);
      setAiResponse(null);

      // --- 1️⃣ Convert logo file to base64 (if provided) ---
      let logoBase64 = null;
      if (logo) {
        logoBase64 = await fileToBase64(logo);
      }

      // --- 2️⃣ Call AI Agent API with JSON body ---
      const res = await fetch("/api/aiAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          logo: logoBase64, // base64 string instead of file
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate post from AI agent.");
      }

      const apiResponse = await res.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "AI agent failed with no specific error.");
      }

      const data = apiResponse.data || {};
      const aiOutput = data.output; // AI-generated image/post URL
      const logoUrl = data.logoUrl; // Cloudinary logo URL
      const description = data.description



      // ✅ Save successful AI agent response
      setAiResponse(data);

      // --- 3️⃣ Save post in MongoDB ---
      const postRes = await fetch("/api/post-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId, // Replace with real logged-in user ID
          aiOutput,
          description,
          logoUrl, // optional field
          status: "pending",
        }),
      });

      const postData = await postRes.json();

      if (!postData.success) {
        throw new Error(postData.error || "Failed to save post in database.");
      }

      // --- 4️⃣ Update frontend state ---
      setPosts((prev) => [postData.data, ...prev]);
      setAllCounts((prev) => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1,
      }));

      showToast("AI Post Generated & Saved Successfully! 🎉");
      setPrompt("");
      setLogo(null);
    } catch (error) {
      console.error("Generation Error:", error);
      showToast(error.message || "Failed to generate AI post!", "error");
    } finally {
      setIsGenerating(false);
    }
  };


  const handleDateChange = (id, value) => {
    setScheduleDates((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const scheduleDate = scheduleDates[id];
    const userId = localStorage.getItem("userId"); // ✅ later make dynamic from session/auth


    if (newStatus === "scheduled" && !scheduleDate) {
      showToast("Please select a schedule date!", "error");
      return;
    }

    try {
      const res = await fetch("/api/post-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: newStatus,
          scheduledDate: scheduleDate,
          userId: userId, // ✅ pass userId
        }),
      });


      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update post", "error");
        return;
      }

      showToast("Post Updated Successfully! ✅");

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, status: newStatus, scheduledDate: data.data.scheduledDate }
            : p
        )
      );

      await fetchPosts(activeTab);
    } catch (err) {
      showToast("Error updating post", "error");
    }
  };





  const handlePost = async (post) => {
    const fullAccount = localStorage.getItem("accountId"); // "accounts/100262617409791423070"
    const accountId = fullAccount.split("/").pop(); // "100262617409791423070"
    const payloadDetails = JSON.parse(localStorage.getItem("listingData"));

    try {
      const response = await fetch(
        "https://n8n.srv968758.hstgr.cloud/webhook/cc144420-81ab-43e6-8995-9367e92363b0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: slug,
            account: accountId,
            bookUrl:
              payloadDetails?.website,
            output:
              post.aiOutput,
            description:
              post.description,
            cityName: payloadDetails?.locality,
            accessToken:
              session.accessToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("responseresponse", data);
      setSavedPost(data)
      console.log("✅ Successfully sent data:", data);
      alert("Post successfully sent to webhook!");
    } catch (error) {
      console.error("❌ Error sending data:", error);
      alert("Failed to send post. Please check console for details.");
    }
  };


  console.log("ASDFGHJK", posts);


  const handleReject = async (id) => {
    const userId = localStorage.getItem("userId"); // ✅ later make dynamic from session/auth

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/post-status?id=${id}&userId=${userId}`, { // ✅ add userId in query
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Post deleted successfully! 🗑️");
        const removed = posts.find((p) => p._id === id);
        setPosts((prev) => prev.filter((p) => p._id !== id));

        if (removed) {
          setAllCounts((prev) => {
            const next = { ...prev, total: Math.max(0, prev.total - 1) };
            if (removed.status === "pending") next.pending = Math.max(0, next.pending - 1);
            if (removed.status === "approved") next.approved = Math.max(0, next.approved - 1);
            if (removed.status === "scheduled") next.scheduled = Math.max(0, next.scheduled - 1);
            return next;
          });
        }
      } else {
        showToast(data.error || "Failed to delete", "error");
      }
    } catch (error) {
      showToast("Error deleting post", "error");
    }
  };


  const handleDownload = async (post) => {
    console.log("Downloading image:", post);

    if (!post.aiOutput) {
      alert("No image available to download.");
      return;
    }

    try {
      let imageBlob;
      let extension = "jpg"; // default fallback

      // 🖼️ Case 1: Direct Image URL (e.g. https://example.com/image.jpg)
      if (post.aiOutput.startsWith("http")) {
        const response = await fetch(post.aiOutput);
        if (!response.ok) throw new Error("Failed to fetch image.");
        imageBlob = await response.blob();

        // Extract file extension from Content-Type or URL
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.startsWith("image/")) {
          extension = contentType.split("/")[1];
        } else {
          const urlExt = post.aiOutput.split(".").pop().split("?")[0];
          if (["jpg", "jpeg", "png", "webp", "svg"].includes(urlExt)) {
            extension = urlExt;
          }
        }
      }

      // 🧬 Case 2: Base64 Data (e.g. data:image/jpeg;base64,...)
      else if (post.aiOutput.startsWith("data:image")) {
        const [meta, base64Data] = post.aiOutput.split(",");
        const mimeType = meta.match(/:(.*?);/)[1];
        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        imageBlob = new Blob([ab], { type: mimeType });
        extension = mimeType.split("/")[1];
      }

      // ❌ Invalid format
      else {
        alert("Invalid image format.");
        return;
      }

      // ✅ Download logic
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${post.prompt?.slice(0, 30)?.replace(/\s+/g, "_") || "ai-image"}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Optional success toast
      console.log(`✅ Downloaded as .${extension}`);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download image. Please try again.");
    }
  };


  // 🔗 Share handler
  const handleShare = async (post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post",
          text: post.aiOutput || "AI-generated content",
        });
      } catch (err) {
        console.error("Share cancelled or failed", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(post.aiOutput || "").then(() => {
        alert("Post content copied to clipboard!");
      });
    }
  };

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchPosts("total");
  }, []);

  const filteredPosts = activeTab === "total" ? posts : posts.filter((post) => post.status === activeTab);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {toast && <Toast message={toast.message} type={toast.type} />}
        {isGenerating && <LoadingOverlay />}

        {/* Header */}
        <div className="rounded-2xl p-6 md:p-8 mt-16 sm:mt-8 shadow-xl border-4 border-indigo-400 relative">
          {/* <div className="rounded-xl p-6 md:p-8 border-2 border-pink-400 bg-white"> */}
          <h1 className="text-3xl md:text-4xl font-black text-black mb-2">✨ Post Management</h1>
          <p className="text-gray-600 text-sm md:text-base">Create stunning GMB posts with AI in seconds</p>
          {/* </div> */}
        </div>


        {/* Post Input */}
        <PostInput
          prompt={prompt}
          setPrompt={setPrompt}
          logo={logo}
          setLogo={setLogo}
          onGenerate={handleAiAgent}
          loading={isGenerating}
        />

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              count={tab.count}
            />
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                aiResponse={aiResponse}
                scheduleDates={scheduleDates}
                onDateChange={handleDateChange}
                handleDownload={handleDownload}
                handleShare={handleShare}
                onUpdateStatus={handleUpdateStatus}
                onReject={handleReject}
                handlePost={handlePost}
                setShowFull={setShowFull}
                showFull={showFull}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm p-12 md:p-16 text-center border-2 border-dashed border-gray-300 rounded-2xl">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg font-medium">No posts found in this category</p>
            <p className="text-gray-500 text-sm mt-2">Create your first AI-powered post above!</p>
          </div>
        )}
      </div>
    </div>
  );
}