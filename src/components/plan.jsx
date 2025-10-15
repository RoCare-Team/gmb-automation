"use client";
import React, { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Plan({ user }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const plans = [
    {
      name: "Basic",
      price: 250,
      features: ["5 fixed-date posts", "Customer support"],
      highlight: false,
    },
    {
      name: "Standard",
      price: 500,
      features: ["10 posts (alternate days)", "Customer support + auto review reply", "Auto review reply"],
      highlight: true,
    },
    {
      name: "Premium",
      price: 1000,
      features: ["30 posts (any day)", "Instant customer support + auto review reply", "Auto review reply"],
      highlight: false,
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    setLoading(true);

    // 1️⃣ Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      console.log("Creating order for plan:", plan.name);

      // 2️⃣ Get userId from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not found. Please login first.");
        setLoading(false);
        return;
      }

      // 3️⃣ Create order on backend
      const orderRes = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: plan.name }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        toast.error(orderData.error || "Backend order creation failed");
        setLoading(false);
        return;
      }

      // 4️⃣ Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Auto GMB",
        description: `${plan.name} Plan Subscription`,
        order_id: orderData.id,
        handler: async (response) => {
          console.log("Payment response:", response);

          // ✅ Use same userId from localStorage for verification
          try {
            const verifyRes = await fetch("/api/subscribe/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, plan: plan.name, payment: response }),
            });

            const result = await verifyRes.json();
            
             if (result.success) {
            toast.success(`Subscribed to ${plan.name} successfully!`);
      
      // ✅ Save plan name in localStorage
      localStorage.setItem("Plan", plan.name);

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      toast.error(result.error || "Payment verification failed");
    }
          } catch (err) {
            console.error("Verify API error:", err);
            toast.error("Verify API failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#1976d2" },
      };

      // 5️⃣ Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response);
        toast.error("Payment failed!");
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Razorpay init error:", err);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-start py-16 px-6">
      <Toaster position="top-right" />
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Auto GMB Subscription Plans</h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Boost your Google My Business profile with AI automation.
        </p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col p-8 rounded-3xl shadow-2xl transition-transform hover:scale-105 border ${plan.highlight ? "border-blue-600 bg-gradient-to-b from-blue-600 to-blue-500 text-white" : "bg-white"
              }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 right-4 bg-yellow-400 text-gray-900 font-semibold px-3 py-1 rounded-full text-sm shadow-lg">
                Popular
              </div>
            )}
            <h2 className={`text-2xl font-bold mb-4 ${plan.highlight ? "text-white" : "text-gray-800"}`}>{plan.name}</h2>
            <p className={`text-3xl font-extrabold mb-6 ${plan.highlight ? "text-white" : "text-gray-900"}`}>₹{plan.price} / month</p>
            <ul className="flex-1 space-y-4 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckIcon className={`h-6 w-6 ${plan.highlight ? "text-white" : "text-blue-600"}`} />
                  <span className={plan.highlight ? "text-white" : "text-gray-700"}>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loading}
              className={`py-3 rounded-xl font-semibold transition-all ${plan.highlight
                ? "bg-white text-blue-600 hover:bg-gray-100"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {loading ? "Processing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
