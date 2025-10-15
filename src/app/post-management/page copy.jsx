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

// Toast Component
const Toast = ({ message, type = "success" }) => (
  <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${
    type === "success" ? "bg-green-500" : "bg-red-500"
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
    className={`flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-3.5 rounded-xl border-2 text-sm md:text-base font-bold transition-all flex-1 min-w-0 shadow-sm hover:shadow-md ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent scale-105"
        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
    }`}
  >
    <tab.icon className="w-5 h-5 flex-shrink-0" />
    <span className="truncate hidden sm:inline">{tab.label}</span>
    <span className="truncate sm:hidden">{tab.shortLabel || tab.label}</span>
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
        isActive ? "bg-white/25 text-white" : "bg-blue-100 text-blue-700"
      }`}
    >
      {count}
    </span>
  </button>
);

// Post Card Component
const PostCard = ({ post, scheduleDates, onDateChange, onUpdateStatus, onReject }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
    <div className="relative">
      <img
        src={post?.output || "https://via.placeholder.com/400"}
        alt="Post"
        className="w-full h-56 md:h-64 object-cover"
      />
      <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
        post.status === "pending" ? "bg-yellow-500 text-white" :
        post.status === "approved" ? "bg-green-500 text-white" :
        "bg-blue-500 text-white"
      }`}>
        {post.status.toUpperCase()}
      </div>
    </div>
    
    <div className="p-5 space-y-4">
      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
        <strong className="text-gray-900">Prompt:</strong> {post.prompt}
      </p>
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
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="datetime-local"
                value={scheduleDates[post._id] || ""}
                onChange={(e) => onDateChange(post._id, e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-700 font-medium">
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
        )}
        <a href={post.output} target="_blank" rel="noopener noreferrer">
  <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
    See Full Post
  </button>
</a>

      </div>
    </div>
  </div>
);

// Main Component
export default function PostManagement() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState([]);
    const [aiResponse, setAiResponse] = useState(null);

  const [activeTab, setActiveTab] = useState("total");
  const [prompt, setPrompt] = useState("");
  const [scheduleDates, setScheduleDates] = useState({});
  const [logo, setLogo] = useState(null);
  const [toast, setToast] = useState(null);

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
    { id: "total", label: "Total Posts", shortLabel: "Total", icon: ImageIcon, count: allCounts.total },
    { id: "approved", label: "Approved", shortLabel: "Approved", icon: CheckCircle, count: allCounts.approved },
    { id: "pending", label: "Pending", shortLabel: "Pending", icon: Clock, count: allCounts.pending },
    { id: "scheduled", label: "Scheduled", shortLabel: "Scheduled", icon: Calendar, count: allCounts.scheduled },
  ];

  const fetchPosts = async (status) => {
    try {
      const url = status === "total" ? "/api/post-status" : `/api/post-status?status=${status}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      setPosts(data.data);

      const allPostsRes = await fetch("/api/post-status");
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

  const handleAiAgent = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a prompt before generating!", "error");
      return;
    }

    try {
      setIsGenerating(true);
            setAiResponse(null); // Clear previous response


      const res = await fetch("/api/aiAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promat: prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate post");

      const data = await res.json();

      setAiResponse(data);

      const postRes = await fetch("/api/post-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          output: data.data?.output || data.output,
          status: "pending",
        }),
      });

      const postData = await postRes.json();
      if (!postData.success) throw new Error(postData.error || "Failed to save post");

      setPosts((prev) => [postData.data, ...prev]);
      setAllCounts((prev) => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
      showToast("AI Post Generated Successfully! 🎉");
      setPrompt("");
      setLogo(null);
    } catch (error) {
      showToast("Failed to generate AI post!", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDateChange = (id, value) => {
    setScheduleDates((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const scheduleDate = scheduleDates[id];

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
          p._id === id ? { ...p, status: newStatus, scheduledDate: data.data.scheduledDate } : p
        )
      );

      await fetchPosts(activeTab);
    } catch (err) {
      showToast("Error updating post", "error");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/post-status?id=${id}`, { method: "DELETE" });
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
                scheduleDates={scheduleDates}
                onDateChange={handleDateChange}
                onUpdateStatus={handleUpdateStatus}
                onReject={handleReject}
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