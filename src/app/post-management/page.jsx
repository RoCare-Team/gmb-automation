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
  Edit3,
  Save,
  Eye,
  EyeOff,
  Send,
  MapPin,
  CheckSquare,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

// Toast Component
const Toast = ({ message, type = "success" }) => (
  <div className={`fixed top-18 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in ${
    type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"
  } text-white font-semibold`}>
    {message}
  </div>
);

// Insufficient Balance Modal
const InsufficientBalanceModal = ({ onClose, onRecharge, walletBalance, requiredCoins }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-red-200 animate-scale-in">
      <div className="text-center space-y-6">
        <div className="text-7xl">💸</div>
        <h3 className="text-3xl font-black text-gray-900">Insufficient Balance!</h3>
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <p className="text-red-800 font-semibold">Current Balance: ₹{walletBalance}</p>
          <p className="text-red-600 text-sm mt-1">
            Required: {requiredCoins} Coins {requiredCoins === 300 ? 'for AI generation' : 'per location'}
          </p>
        </div>
        <p className="text-gray-600">
          {requiredCoins === 300 
            ? 'Please recharge your wallet to continue generating AI posts' 
            : 'Please recharge your wallet to continue posting to locations'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onRecharge}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Recharge Wallet
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Upgrade Plan Modal
const UpgradePlanModal = ({ onClose, onUpgrade }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-amber-200 animate-scale-in">
      <div className="text-center space-y-6">
        <div className="text-7xl">🔒</div>
        <h3 className="text-3xl font-black text-gray-900">Upgrade Required!</h3>
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          <p className="text-amber-800 font-semibold">Free Plan Active</p>
          <p className="text-amber-600 text-sm mt-1">Upgrade to generate AI posts</p>
        </div>
        <p className="text-gray-600">Unlock unlimited AI-powered post generation with our premium plans</p>
        <div className="flex gap-3">
          <button
            onClick={onUpgrade}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            View Plans
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Loading Overlay Component with Timer
const LoadingOverlay = ({ countdown }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-6 max-w-md w-full border-4 border-white/30">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-300/40 rounded-full blur-2xl animate-pulse"></div>
        <Loader2 className="w-20 h-20 text-white animate-spin relative z-10" />
        <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-3 -right-3 animate-bounce" />
      </div>
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-black text-white">Creating Magic ✨</h3>
        <p className="text-blue-100 text-sm">AI is generating your stunning post...</p>
        {countdown > 0 && (
          <div className="mt-4">
            <div className="text-6xl font-black text-white animate-pulse">{countdown}</div>
            <p className="text-blue-100 text-xs mt-2">seconds remaining</p>
          </div>
        )}
      </div>
      <div className="w-full bg-white/30 rounded-full h-2.5 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 h-full rounded-full animate-shimmer"></div>
      </div>
    </div>
  </div>
);

// Success Animation Overlay Component
const SuccessOverlay = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
        </div>

        <div className="relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-12 flex flex-col items-center space-y-6 max-w-lg w-full border-4 border-white animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-300/50 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="text-9xl animate-rocket relative z-10">🚀</div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                <div className="w-2 h-8 bg-orange-400 rounded-full animate-flame-1"></div>
                <div className="w-2 h-10 bg-yellow-400 rounded-full animate-flame-2"></div>
                <div className="w-2 h-8 bg-orange-400 rounded-full animate-flame-3"></div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4 relative z-10">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-16 h-16 text-white animate-check" />
            </div>
            <h3 className="text-4xl font-black text-white animate-bounce-in">
              Post Published!
            </h3>
            <p className="text-white/90 text-lg font-semibold">
              Your post is now live on Google My Business! 🎉
            </p>
          </div>

          <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden relative">
            <div className="bg-white h-full rounded-full animate-progress-bar shadow-lg"></div>
          </div>

          <div className="flex gap-2 animate-stars">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <Sparkles className="w-10 h-10 text-yellow-200" />
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Input Component
const PostInput = ({ prompt, setPrompt, logo, setLogo, onGenerate, loading }) => {
  const removeImage = () => setLogo(null);

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-6 md:p-8">
      <div className="flex flex-col space-y-6">
        <div className="space-y-3">
          <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            What would you like to create?
          </label>
          <textarea
            placeholder="Describe your post idea... e.g., 'Create a festive Diwali offer post for RO water purifier with 30% discount'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-gray-800 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none placeholder:text-gray-400 bg-gray-50"
            disabled={loading}
          />
        </div>

        <div className="space-y-3">
          <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-500" />
            Add Your Logo (Optional)
          </label>

          {!logo ? (
            <label className="flex flex-col items-center justify-center w-full h-36 border-3 border-dashed border-blue-400 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 hover:border-blue-500 transition-all group">
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-base text-gray-700 font-semibold">Click to upload logo</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
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
            <div className="relative w-full h-36 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300 p-4 shadow-md">
              <img
                src={URL.createObjectURL(logo)}
                alt="Logo Preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all shadow-xl hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-5 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-black text-lg"
        >
          <Sparkles className="w-6 h-6" />
          Generate Post with AI
        </button>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
          <p className="text-sm text-amber-900 flex items-start gap-2">
            <span className="text-xl">💡</span>
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
    className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-3 text-sm md:text-base font-bold transition-all flex-1 shadow-md hover:shadow-xl ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent scale-105"
        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
    }`}
  >
    <tab.icon className="w-5 h-5 flex-shrink-0" />
    <span className="truncate hidden sm:inline">{tab.label}</span>
    <span className="truncate sm:hidden">{tab.shortLabel || tab.label}</span>
    <span
      className={`px-3 py-1 rounded-full text-xs font-black ${
        isActive ? "bg-white/30 text-white" : "bg-blue-100 text-blue-700"
      }`}
    >
      {count}
    </span>
  </button>
);

// Post Card Component
const PostCard = ({ post, scheduleDates, onDateChange, onUpdateStatus, onReject, handleDownload, handleShare, onOpenModal, onEditDescription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post?.description || "");

  const handleSave = () => {
    onEditDescription(post._id, editedDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(post?.description || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all">
      <a href={post.aiOutput} target="_blank" rel="noopener noreferrer">
        <div className="relative group">
          <img
            src={post?.aiOutput || "https://via.placeholder.com/400"}
            alt="Post"
            className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
          />

          <div
            className={`absolute top-4 right-4 px-4 py-2 rounded-full text-xs font-black shadow-xl backdrop-blur-sm ${
              post.status === "pending"
                ? "bg-yellow-500/90 text-white"
                : post.status === "approved"
                ? "bg-green-500/90 text-white"
                : post.status === "posted"
                ? "bg-purple-600/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {post.status.toUpperCase()}
          </div>

          <div className="absolute bottom-4 right-4 flex gap-3 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDownload(post);
              }}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md backdrop-blur-sm transition"
              title="Download"
            >
              <Download className="w-4 h-4 text-blue-600" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleShare(post);
              }}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md backdrop-blur-sm transition"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </a>

      <div className="p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <strong className="text-gray-900 font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              Description
            </strong>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none text-gray-800 text-sm min-h-[120px]"
                rows={5}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-sm text-gray-700 leading-relaxed ${showFull ? "" : "line-clamp-3"}`}>
                {post?.description || "No description available"}
              </p>
              {post?.description?.length > 150 && (
                <button
                  onClick={() => setShowFull(!showFull)}
                  className="flex items-center gap-1 text-blue-600 text-sm font-semibold mt-2 hover:text-blue-700"
                >
                  {showFull ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showFull ? "Show Less" : "Show More"}
                </button>
              )}
            </>
          )}
        </div>

        <p className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t border-gray-100">
          <Calendar className="w-3 h-3" />
          Created: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
        </p>

        <div className="pt-3 space-y-3">
          {post.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onUpdateStatus(post._id, "approved")}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
              <button
                onClick={() => onReject(post._id)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                <X className="w-5 h-5" />
                Reject
              </button>
            </div>
          )}

        {(post.status === "approved" || post.status === "posted") && (
  <div className="space-y-3">
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 space-y-3">
      <button
        onClick={() => onOpenModal(post)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3.5 rounded-xl font-black hover:shadow-xl transition-all text-base cursor-pointer"
      >
        <Send className="w-5 h-5" />
        {post.status === "posted" ? "Again Post" : "Post Now"}
      </button>
    </div>
  </div>
)}


          {post.status === "scheduled" && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-5 space-y-4">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-gray-700 font-semibold flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Scheduled for:
                </p>
                <p className="text-blue-700 font-black text-lg">
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

              <button
                onClick={() => onOpenModal(post)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3.5 rounded-xl font-black hover:shadow-xl transition-all text-base"
              >
                <Send className="w-5 h-5" />
                Post Now
              </button>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function PostManagement() {
      const { data: session } = useSession()
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  const [showUpgradePlan, setShowUpgradePlan] = useState(false);
  const [userWallet, setUserWallet] = useState(0);
  const [requiredCoinsForPost, setRequiredCoinsForPost] = useState(300);

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("total");
  const [prompt, setPrompt] = useState("");
  const [scheduleDates, setScheduleDates] = useState({});
  const [logo, setLogo] = useState(null);
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [allCounts, setAllCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    scheduled: 0,
    posted: 0,
  });

  const tabs = [
    { id: "total", label: "Total Posts", shortLabel: "Total", icon: ImageIcon, count: allCounts.total },
    { id: "pending", label: "Pending", shortLabel: "Pending", icon: Clock, count: allCounts.pending },
    { id: "approved", label: "Approved", shortLabel: "Approved", icon: CheckCircle, count: allCounts.approved },
    { id: "scheduled", label: "Scheduled", shortLabel: "Scheduled", icon: Calendar, count: allCounts.scheduled },
    { id: "posted", label: "Posted", shortLabel: "Posted", icon: CheckCircle, count: allCounts.posted },
  ];

  const fetchPosts = async (status) => {
    try {
      const userId = localStorage.getItem("userId");
      const url = status === "total"
        ? `/api/post-status?userId=${userId}`
        : `/api/post-status?userId=${userId}&status=${status}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch posts");
      }
      setPosts(data.data);

      const allPostsRes = await fetch(`/api/post-status?userId=${userId}`);
      const allPostsData = await allPostsRes.json();

      if (allPostsRes.ok && allPostsData.success) {
        const allPosts = allPostsData.data;
        setAllCounts({
          total: allPosts.length,
          approved: allPosts.filter((p) => p.status === "approved").length,
          pending: allPosts.filter((p) => p.status === "pending").length,
          scheduled: allPosts.filter((p) => p.status === "scheduled").length,
          posted: allPosts.filter((p) => p.status === "posted").length,
        });
      }
    } catch (err) {
      showToast(err.message || "Error fetching posts", "error");
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleAiAgent = async () => {
    const userId = localStorage.getItem("userId");

    if (!prompt.trim()) {
      showToast("Please enter a prompt before generating!", "error");
      return;
    }

    try {
      const userRes = await fetch(`/api/auth/signup?userId=${userId}`);
      if (!userRes.ok) {
        showToast("Failed to fetch user data", "error");
        return;
      }

      const userData = await userRes.json();
      const subscription = userData.subscription || {};
      const walletBalance = userData.wallet || 0;

      setUserWallet(walletBalance);

      if (subscription.plan === "Free" && walletBalance < 300) {
        setShowUpgradePlan(true);
        return;
      }

      if (subscription.plan !== "Free" && subscription.status !== "active" && walletBalance < 300) {
        setShowUpgradePlan(true);
        return;
      }

      if (walletBalance < 300) {
        setRequiredCoinsForPost(300);
        setShowInsufficientBalance(true);
        return;
      }

      setIsGenerating(true);
      setAiResponse(null);
      setCountdown(59);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      let logoBase64 = null;
      if (logo) {
        logoBase64 = await fileToBase64(logo);
      }

      const res = await fetch("/api/aiAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          logo: logoBase64,
        }),
      });

      clearInterval(timer);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate post from AI agent.");
      }

      const apiResponse = await res.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "AI agent failed with no specific error.");
      }

      const data = apiResponse.data || {};
      const aiOutput = data.output;
      const logoUrl = data.logoUrl;
      const description = data.description;

      setAiResponse(data);

      const postRes = await fetch("/api/post-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          aiOutput,
          description,
          logoUrl,
          status: "pending",
        }),
      });

      const postData = await postRes.json();
      if (!postData.success) {
        throw new Error(postData.error || "Failed to save post in database.");
      }

      const walletRes = await fetch("/api/auth/signup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: 300,
          type: "deduct",
        }),
      });

      const walletData = await walletRes.json();

      if (walletData.error) {
        console.warn("Wallet deduction failed:", walletData.error);
        showToast(walletData.error, "error");
      } else {
        showToast("300 coins deducted for AI post ✅", "success");
        setUserWallet((prev) => Math.max(0, prev - 300));
      }

      setPosts((prev) => [postData.data, ...prev]);
      setAllCounts((prev) => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1,
      }));

      showToast("AI Post Generated & Saved Successfully! 🎉");

      setPrompt("");
      setLogo(null);
      setCountdown(0);
    } catch (error) {
      console.error("Generation Error:", error);
      showToast(error.message || "Failed to generate AI post!", "error");
    } finally {
      setIsGenerating(false);
      setCountdown(0);
    }
  };

  const handleDateChange = (id, value) => {
    setScheduleDates((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const scheduleDate = scheduleDates[id];
    const userId = localStorage.getItem("userId");

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
          userId: userId,
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

  const handleEditDescription = async (id, newDescription) => {
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch("/api/post-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          description: newDescription,
          userId: userId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update description", "error");
        return;
      }

      showToast("Description Updated Successfully! ✅");
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, description: newDescription } : p))
      );
    } catch (err) {
      showToast("Error updating description", "error");
    }
  };

  const handleCheckboxChange = (location) => {
    setSelectedLocations((prev) => {
      const exists = prev.find((loc) => loc.locationId === location.locationId);
      if (exists) {
        return prev.filter((loc) => loc.locationId !== location.locationId);
      } else {
        return [...prev, location];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedLocations.length === filteredLocations.length) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations(filteredLocations);
    }
  };

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setSelectedLocations([]);
    setIsModalOpen(true);
  };

  const handleConfirmPost = async () => {
    if (!selectedPost || selectedLocations.length === 0) {
      showToast("Please select at least one location", "error");
      return;
    }

    setIsPosting(true);

    try {
      const userId = localStorage.getItem("userId");

      const userRes = await fetch(`/api/auth/signup?userId=${userId}`);
      if (!userRes.ok) {
        showToast("Failed to fetch user data", "error");
        setIsPosting(false);
        return;
      }

      const userData = await userRes.json();
      const subscription = userData.subscription || {};
      const walletBalance = userData.wallet || 0;
      setUserWallet(walletBalance);

      const isFreePlan = subscription.plan === "Free";
      const perLocationDeduct = isFreePlan ? 100 : 50;
      const totalDeduct = perLocationDeduct * selectedLocations.length;

      // Check for insufficient balance - Close modal and show popup
      if (isFreePlan && walletBalance < 100) {
        setIsPosting(false);
        setIsModalOpen(false);
        setRequiredCoinsForPost(100);
        setShowInsufficientBalance(true);
        return;
      }

      if (!isFreePlan && walletBalance < 50) {
        setIsPosting(false);
        setIsModalOpen(false);
        setRequiredCoinsForPost(50);
        setShowInsufficientBalance(true);
        return;
      }

      const locationData = selectedLocations.map((loc) => ({
        city: loc.locationId,
        cityName: loc.locality,
        bookUrl: loc.websiteUrl || "",
      }));

      const response = await fetch(
        "https://n8n.srv968758.hstgr.cloud/webhook/cc144420-81ab-43e6-8995-9367e92363b0",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationData,
            account: selectedLocations[0]?.accountId || "",
            output: selectedPost.aiOutput || "",
            description: selectedPost.description || "",
            accessToken: session?.accessToken || "",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const walletRes = await fetch("/api/auth/signup", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            amount: totalDeduct,
            type: "deduct",
          }),
        });

        if (walletRes.ok) {
          const newBalance = walletBalance - totalDeduct;
          setUserWallet(newBalance);
          localStorage.setItem("walletBalance", newBalance);
          showToast(`${totalDeduct} coins deducted from your wallet`, "success");
        } else {
          showToast("Post sent, but wallet deduction failed", "warning");
        }

        await handleUpdateStatus(selectedPost._id, "posted");

        setIsModalOpen(false);
        setSelectedLocations([]);
        setSelectedPost(null);
        setShowSuccess(true);
      } else {
        showToast("Failed to send post to GMB", "error");
      }
    } catch (error) {
      console.error("Post error:", error);
      showToast("Failed to send post", "error");
    } finally {
      setIsPosting(false);
    }
  };

  const handleReject = async (id) => {
    const userId = localStorage.getItem("userId");

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/post-status?id=${id}&userId=${userId}`, {
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
            if (removed.status === "posted") next.posted = Math.max(0, next.posted - 1);
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
    if (!post.aiOutput) {
      alert("No image available to download.");
      return;
    }
    try {
      const response = await fetch(post.aiOutput);
      if (!response.ok) throw new Error("Failed to fetch image.");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `post-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Image downloaded successfully! 📥");
    } catch (err) {
      showToast("Failed to download image", "error");
    }
  };

  const handleShare = async (post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post",
          text: post.description || "AI-generated content",
          url: post.aiOutput,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(post.aiOutput || "");
      showToast("Link copied to clipboard! 📋");
    }
  };

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchPosts("total");
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("locationDetails");
    if (stored) {
      try {
        setLocations(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid JSON in localStorage:", err);
      }
    }
  }, []);

  const filteredPosts = activeTab === "total" ? posts : posts.filter((post) => post.status === activeTab);
  const filteredLocations = locations.filter((loc) =>
    loc.locality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected = selectedLocations.length === filteredLocations.length && filteredLocations.length > 0;

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
        @keyframes rocket {
          0%, 100% {
            transform: translateY(0) rotate(-45deg);
          }
          50% {
            transform: translateY(-30px) rotate(-45deg);
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes check {
          0% {
            transform: scale(0) rotate(0deg);
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }
        @keyframes progress-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes flame-1 {
          0%, 100% {
            height: 2rem;
            opacity: 0.8;
          }
          50% {
            height: 2.5rem;
            opacity: 1;
          }
        }
        @keyframes flame-2 {
          0%, 100% {
            height: 2.5rem;
            opacity: 1;
          }
          50% {
            height: 3rem;
            opacity: 0.8;
          }
        }
        @keyframes flame-3 {
          0%, 100% {
            height: 2rem;
            opacity: 0.7;
          }
          50% {
            height: 2.5rem;
            opacity: 1;
          }
        }
        @keyframes stars {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-rocket {
          animation: rocket 2s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .animate-check {
          animation: check 0.8s ease-out;
        }
        .animate-progress-bar {
          animation: progress-bar 3s ease-in-out;
        }
        .animate-flame-1 {
          animation: flame-1 0.3s ease-in-out infinite;
        }
        .animate-flame-2 {
          animation: flame-2 0.4s ease-in-out infinite;
        }
        .animate-flame-3 {
          animation: flame-3 0.35s ease-in-out infinite;
        }
        .animate-stars {
          animation: stars 1s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #f0f;
          animation: confetti-fall 3s linear infinite;
        }
        .confetti:nth-child(1) {
          left: 10%;
          background: #ff0;
          animation-delay: 0s;
        }
        .confetti:nth-child(2) {
          left: 30%;
          background: #0ff;
          animation-delay: 0.3s;
        }
        .confetti:nth-child(3) {
          left: 50%;
          background: #f0f;
          animation-delay: 0.6s;
        }
        .confetti:nth-child(4) {
          left: 70%;
          background: #0f0;
          animation-delay: 0.9s;
        }
        .confetti:nth-child(5) {
          left: 90%;
          background: #f00;
          animation-delay: 1.2s;
        }
        .confetti:nth-child(6) {
          left: 45%;
          background: #00f;
          animation-delay: 1.5s;
        }
      `}</style>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {toast && <Toast message={toast.message} type={toast.type} />}
        {isGenerating && <LoadingOverlay countdown={countdown} />}
        {showInsufficientBalance && (
          <InsufficientBalanceModal
            walletBalance={userWallet}
            requiredCoins={requiredCoinsForPost}
            onClose={() => setShowInsufficientBalance(false)}
            onRecharge={() => {
              setShowInsufficientBalance(false);
              window.location.href = "/wallet";
            }}
          />
        )}
        {showUpgradePlan && (
          <UpgradePlanModal
            onClose={() => setShowUpgradePlan(false)}
            onUpgrade={() => {
              setShowUpgradePlan(false);
              window.location.href = "/subscription";
            }}
          />
        )}
        {showSuccess && <SuccessOverlay onComplete={() => setShowSuccess(false)} />}

        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-10 mt-16 sm:mt-8 shadow-2xl border-4 border-white">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 flex items-center gap-3">
            <Sparkles className="w-10 h-10" />
            Post Management
          </h1>
          <p className="text-blue-100 text-base md:text-lg font-medium">
            Create stunning GMB posts with AI in seconds ✨
          </p>
        </div>

        <PostInput
          prompt={prompt}
          setPrompt={setPrompt}
          logo={logo}
          setLogo={setLogo}
          onGenerate={handleAiAgent}
          loading={isGenerating}
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                scheduleDates={scheduleDates}
                onDateChange={handleDateChange}
                handleDownload={handleDownload}
                handleShare={handleShare}
                onUpdateStatus={handleUpdateStatus}
                onReject={handleReject}
                onOpenModal={handleOpenModal}
                onEditDescription={handleEditDescription}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border-3 border-dashed border-gray-300 shadow-xl">
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No posts found</h3>
            <p className="text-gray-600 text-lg">
              {activeTab === "total"
                ? "Create your first AI-powered post above!"
                : `No ${activeTab} posts yet`}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 mt-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative overflow-hidden"
            >
              {!isPosting && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              {isPosting ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-300/40 rounded-full blur-2xl animate-pulse"></div>
                    <div className="text-8xl animate-bounce-slow">🚀</div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-3xl font-black text-gray-900">Publishing Post...</h3>
                    <p className="text-gray-600 text-sm">Sending to Google My Business</p>
                  </div>
                  <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 h-full rounded-full animate-shimmer"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                      Select Your Business Locations
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Choose one or multiple locations to post your campaign
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <MapPin className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSelectAll}
                      className={`px-4 py-2.5 flex items-center gap-2 rounded-xl font-semibold transition ${
                        allSelected
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      <CheckSquare className="w-5 h-5" />
                      {allSelected ? "Deselect All" : "Select All"}
                    </motion.button>
                  </div>

                  <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-2xl p-3 space-y-3 mb-5">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc, index) => (
                        <motion.label
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                            selectedLocations.some(
                              (sel) => sel.locationId === loc.locationId
                            )
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.some(
                              (sel) => sel.locationId === loc.locationId
                            )}
                            onChange={() => handleCheckboxChange(loc)}
                            className="accent-green-600 mt-1 w-5 h-5"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{loc.title}</p>
                            <p className="text-sm text-gray-600">{loc.locality}</p>
                            <p className="text-xs text-gray-500">{loc.address}</p>
                          </div>
                        </motion.label>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No locations found.
                      </p>
                    )}
                  </div>

                  {selectedLocations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-sm text-green-800"
                    >
                      <strong>{selectedLocations.length}</strong> location
                      {selectedLocations.length > 1 && "s"} selected:{" "}
                      {selectedLocations.map((loc) => loc.locality).join(", ")}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: selectedLocations.length === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: selectedLocations.length === 0 ? 1 : 0.95 }}
                    onClick={handleConfirmPost}
                    disabled={selectedLocations.length === 0}
                    className={`w-full py-3.5 rounded-xl font-bold transition text-lg ${
                      selectedLocations.length === 0
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-lg"
                    }`}
                  >
                    Confirm & Post
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}