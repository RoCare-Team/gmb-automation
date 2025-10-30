"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Coins, IndianRupee, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export default function SmartWalletRecharge() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(199);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // 🧠 Coin calculation formula
  const coins = Math.floor((amount / 199) * 2000);

  // 🧩 Preset options
  const presetAmounts = [
    { price: 199, coins: 2000 },
    { price: 499, coins: 5200 },
    { price: 999, coins: 11000 },
    { price: 1999, coins: 23000 },
  ];

  // 🔹 Get userId from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // 🧠 Handle Recharge API Call
  const handleRecharge = async () => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
    if (amount < 199) {
      alert("Minimum recharge is ₹199");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: coins, // ✅ Add same coins as displayed
          type: "add",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Show success modal instead of alert
        setShowSuccess(true);
        // After 2.5 sec, auto redirect back
        setTimeout(() => {
          setShowSuccess(false);
          router.back();
        }, 2500);
      } else {
        alert(`❌ Error: ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Recharge Error:", err);
      alert("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center space-y-3">
          <Wallet className="text-amber-600 w-12 h-12" />
          <h1 className="text-3xl font-bold text-gray-800">Smart Wallet</h1>
          <p className="text-gray-500 text-sm text-center">
            Add money to get coins instantly.
          </p>
        </div>

        {/* Quick Recharge */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Quick Recharge</h2>
          <div className="grid grid-cols-2 gap-3">
            {presetAmounts.map((pkg, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAmount(pkg.price)}
                className={`border-2 rounded-xl py-3 flex flex-col items-center space-y-1 transition-all ${
                  amount === pkg.price
                    ? "bg-amber-600 text-white border-amber-600"
                    : "border-amber-300 text-gray-700 hover:border-amber-500"
                }`}
              >
                <span className="font-bold text-lg">₹{pkg.price}</span>
                <span className="text-sm">{pkg.coins} Coins</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Or enter custom amount
          </label>
          <input
            type="number"
            min="199"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
          />
          <p className="text-xs text-gray-500 mt-1">
            ₹199 = 2000 coins (auto-calculated)
          </p>
        </div>

        {/* Coin Info */}
        <motion.div
          key={coins}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="text-amber-600" />
            <span className="font-semibold text-gray-700">You’ll Get</span>
          </div>
          <div className="text-amber-700 font-bold text-lg">{coins} Coins</div>
        </motion.div>

        {/* Recharge Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRecharge}
          disabled={loading}
          className={`w-full flex justify-center items-center space-x-2 py-3 rounded-2xl shadow-md font-semibold text-white transition-all ${
            loading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          <IndianRupee className="w-5 h-5" />
          <span>{loading ? "Processing..." : "Recharge Now"}</span>
          {!loading && <ArrowRight className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      {/* ✅ Success Popup Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center w-[90%] max-w-sm border border-amber-200"
            >
              <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Transaction Successful 🎉</h2>
              <p className="text-gray-600 mt-2">
                You’ve added <b>₹{amount}</b> and earned <b>{coins} coins</b>.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-sm text-gray-500"
              >
                Redirecting back...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
