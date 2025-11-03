"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Coins,
  IndianRupee,
  ArrowRight,
  Sparkles,
  CheckCircle,
  CreditCard,
  Zap,
  TrendingUp,
  Shield,
  ArrowLeft,
} from "lucide-react";

export default function SmartWalletRecharge() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(499);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // 1 Rupee = 1 Coin
  const coins = amount;

  // 💰 Predefined recharge options
  const presetAmounts = [
    { price: 199, coins: 199, popular: false },
    { price: 499, coins: 499, popular: true },
    { price: 999, coins: 999, popular: false },
    { price: 1999, coins: 1999, popular: false },
  ];

  // 🧩 Load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔹 Get userId from localStorage
// 🔹 Get userId from localStorage
useEffect(() => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) setUserId(storedUserId);
}, []);



  // 💰 Handle Recharge Payment
  const handleRecharge = async () => {
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }
    if (amount < 1) {
      alert("Minimum recharge is ₹1");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      setLoading(true);

      // Create Razorpay order
      const orderRes = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          plan: "WalletRecharge",
          amount: amount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        alert(orderData.error || "Order creation failed");
        setLoading(false);
        return;
      }

      // Razorpay Payment Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Auto GMB Wallet",
        description: `Recharge ₹${amount}`,
        order_id: orderData.id,
        theme: { color: "#2563eb" },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/subscribe/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId,
                plan: "WalletRecharge",
                payment: response,
              }),
            });

            const result = await verifyRes.json();
            if (!result.success) {
              alert("Payment verification failed!");
              setLoading(false);
              return;
            }

            // Add coins to wallet
            const walletRes = await fetch("/api/auth/signup", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId,
                amount: coins,
                type: "add",
              }),
            });

            const walletData = await walletRes.json();
            if (walletRes.ok) {
              setShowSuccess(true);
              setTimeout(() => {
                setShowSuccess(false);
                router.back();
              }, 2500);
            } else {
              alert(walletData.message || "Recharge successful but wallet update failed.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Verification failed!");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Auto GMB User",
          email: "user@example.com",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        alert("Payment failed!");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Recharge error:", err);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  // ✅ Fix: Reset loading state on mount
useEffect(() => {
  setLoading(false);
  setShowSuccess(false);
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Main Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Wallet Recharge
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Power up your account instantly
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <Zap className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Instant Credit</h3>
                    <p className="text-sm text-gray-600">Coins added to your wallet immediately after payment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Secure Payment</h3>
                    <p className="text-sm text-gray-600">Protected by Razorpay's enterprise-grade security</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">1:1 Conversion</h3>
                    <p className="text-sm text-gray-600">Every rupee equals one coin - simple and transparent</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Recharge Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 space-y-6"
          >
            {/* Quick Recharge Options */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Popular Amounts
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {presetAmounts.map((pkg, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAmount(pkg.price)}
                    className={`relative border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
                      amount === pkg.price
                        ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg"
                        : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md bg-white"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        Popular
                      </span>
                    )}
                    <IndianRupee className={`w-6 h-6 ${amount === pkg.price ? 'text-white' : 'text-indigo-600'}`} />
                    <span className="font-bold text-2xl">₹{pkg.price}</span>
                    <span className="text-sm opacity-90">{pkg.coins} Coins</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-gray-800 font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Custom Amount
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 font-medium text-lg bg-white"
                  placeholder="Enter amount"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Coins className="w-3 h-3" />
                ₹1 = 1 Coin • Minimum recharge: ₹1
              </p>
            </div>

            {/* Coin Preview */}
            <motion.div
              key={coins}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">You'll Receive</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {coins} Coins
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recharge Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRecharge}
              disabled={loading}
              className={`w-full flex justify-center items-center gap-3 py-4 rounded-2xl shadow-lg font-bold text-white text-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <IndianRupee className="w-6 h-6" />
                  <span>Recharge ₹{amount}</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </motion.button>

            <p className="text-xs text-center text-gray-500">
              By proceeding, you agree to our terms and conditions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center w-full max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-3"
              >
                Payment Successful! 🎉
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6"
              >
                <p className="text-gray-600 mb-2">Recharge Amount</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{amount}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3 text-green-600">
                  <Coins className="w-5 h-5" />
                  <span className="font-semibold">{coins} Coins Added</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 text-gray-500 text-sm"
              >
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                Redirecting to dashboard...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}