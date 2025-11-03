"use client";
import React, { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Plan({ user }) {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState(null);


  // 💳 Base Plan Data (Monthly prices)
  const basePlans = [
    {
      name: "Basic Plan",
      monthlyPrice: 1,
      monthlyCredits: 1000,
      description: "Perfect for small businesses starting with automation.",
      features: [
        "Smart-generated GMB posts",
        "Auto post publishing on Google My Business",
        "No auto review reply",
        "No service list automation",
        "1000 Credits Included /month",
      ],
      goal: "Keep your GMB active with regular smart-generated posts automatically published.",
    },
    {
      name: "Standard Plan",
      monthlyPrice: 1499,
      monthlyCredits: 1500,
      description: "Ideal for growing businesses that want engagement automation.",
      features: [
        "Smart-generated GMB posts",
        "Auto post publishing on Google My Business",
        "Unlimited Smart Auto Review Replies",
        "No service list automation",
        "1500 Credits Included /month",
      ],
      highlight: true,
      goal: "Automate posting and customer review replies to boost engagement and reputation.",
    },
    {
      name: "Premium Plan",
      monthlyPrice: 1999,
      monthlyCredits: 3000,
      description: "For businesses that want complete GMB automation.",
      features: [
        "Smart-generated GMB posts",
        "Auto post publishing on Google My Business",
        "Unlimited Smart Auto Review Replies",
        "Auto service list management (add/update services automatically)",
        "3000 Credits Included /month",
      ],
      goal: "Fully automate your GMB — from smart post creation to review replies and service management.",
    },
  ];

  // 💰 Calculate price based on billing cycle
  const calculatePrice = (monthlyPrice) => {
    switch (billingCycle) {
      case "quarterly":
        return Math.round(monthlyPrice * 3 * 0.84); // 16% off
      case "yearly":
        return Math.round(monthlyPrice * 12 * 0.80); // 20% off
      default:
        return monthlyPrice;
    }
  };

  // 💎 Calculate total credits based on billing cycle
  const calculateCredits = (monthlyCredits) => {
    switch (billingCycle) {
      case "quarterly":
        return monthlyCredits * 3;
      case "yearly":
        return monthlyCredits * 12;
      default:
        return monthlyCredits;
    }
  };

  // 📊 Get duration label
  const getDuration = () => {
    switch (billingCycle) {
      case "quarterly":
        return "3 Months";
      case "yearly":
        return "12 Months";
      default:
        return "1 Month";
    }
  };

  // 💵 Get savings percentage
  const getSavings = () => {
    switch (billingCycle) {
      case "quarterly":
        return "16% OFF";
      case "yearly":
        return "20% OFF";
      default:
        return null;
    }
  };

  // 🔧 Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 💰 Handle Payment
// 💰 Handle Payment
const handleSubscribe = async (plan) => {
  setLoadingPlan(plan.name); // ✅ Only this plan button shows "Processing..."

  const res = await loadRazorpayScript();
  if (!res) {
    toast.error("Razorpay SDK failed to load.");
    setLoadingPlan(null);
    return;
  }

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not found. Please login first.");
      setLoadingPlan(null);
      return;
    }

    const finalPrice = calculatePrice(plan.monthlyPrice);
    const totalCredits = calculateCredits(plan.monthlyCredits);

    const orderRes = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        plan: plan.name,
        billingCycle,
        amount: finalPrice,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      toast.error(orderData.error || "Order creation failed");
      setLoadingPlan(null);
      return;
    }

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Limbu AI",
      description: `${plan.name} - ${getDuration()}`,
      order_id: orderData.id,
      handler: async (response) => {
        try {
          // Step 1: Verify payment
          const verifyRes = await fetch("/api/subscribe/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              plan: plan.name,
              billingCycle,
              payment: response,
            }),
          });

          const result = await verifyRes.json();
          if (!result.success) {
            toast.error(result.error || "Payment verification failed");
            setLoadingPlan(null);
            return;
          }

          // Step 2: Update wallet credits using existing API
          const walletRes = await fetch("/api/auth/signup", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              amount: totalCredits,
              type: "add",
            }),
          });

          const walletResult = await walletRes.json();

          if (walletRes.ok && walletResult.message) {
            toast.success(
              `Subscribed to ${plan.name} successfully! ${totalCredits} credits added.`,
              { duration: 1000 }
            );

            localStorage.setItem("Plan", plan.name);

            setTimeout(() => {
              toast.dismiss();
              router.push("/dashboard");
            }, 1500);
          } else {
            toast.error("Payment successful but credit update failed. Please contact support.");
          }
        } catch (err) {
          console.error("Payment processing error:", err);
          toast.error("Verification failed!");
        } finally {
          setLoadingPlan(null);
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      toast.error("Payment failed!");
      setLoadingPlan(null);
    });
    rzp.open();
  } catch (err) {
    console.error("Subscription error:", err);
    toast.error("Something went wrong!");
    setLoadingPlan(null);
  }
};

  // 📝 Format credits display with billing cycle info
  const formatCreditsDisplay = (feature, monthlyCredits) => {
    if (!feature.includes("Credits Included")) return feature;

    const totalCredits = calculateCredits(monthlyCredits);

    if (billingCycle === "monthly") {
      return `${totalCredits} Credits Included /month`;
    } else {
      return `${totalCredits} Credits Included (${monthlyCredits}/month)`;
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-16 px-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="text-center max-w-3xl mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-3">
          Auto GMB Subscription Plans
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Boost your Google My Business with powerful smart automation tools.
        </p>
      </div>

      {/* Billing Cycle Selector */}
      <div className="mb-12 bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${billingCycle === "monthly"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("quarterly")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${billingCycle === "quarterly"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          Quarterly
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            16% OFF
          </span>
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${billingCycle === "yearly"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          Yearly
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            20% OFF
          </span>
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
        {basePlans.map((plan) => {
          const finalPrice = calculatePrice(plan.monthlyPrice);
          const totalCredits = calculateCredits(plan.monthlyCredits);
          const savings = getSavings();
          const originalPrice = billingCycle === "quarterly"
            ? plan.monthlyPrice * 3
            : billingCycle === "yearly"
              ? plan.monthlyPrice * 12
              : null;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl border shadow-xl transition-all duration-300 hover:shadow-2xl ${plan.highlight
                  ? "bg-gradient-to-b from-blue-600 to-blue-500 text-white border-blue-600 scale-105"
                  : "bg-white text-gray-800 hover:scale-105"
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 right-4 bg-yellow-400 text-gray-900 font-semibold px-3 py-1 rounded-full text-sm shadow-md">
                  Most Popular
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-lg mb-6 opacity-90">{plan.description}</p>

                <div className="mb-6">
                  {originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg line-through opacity-60">
                        ₹{originalPrice}
                      </span>
                      {savings && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          {savings}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-4xl font-extrabold">
                    ₹{finalPrice}
                    <span className="text-lg font-medium">
                      /{getDuration()}
                    </span>
                  </p>
                  {billingCycle !== "monthly" && (
                    <p className="text-sm mt-1 opacity-75">
                      ₹{Math.round(finalPrice / (billingCycle === "quarterly" ? 3 : 12))}/month
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon
                        className={`h-6 w-6 flex-shrink-0 ${plan.highlight ? "text-white" : "text-blue-600"
                          }`}
                      />
                      <span>{formatCreditsDisplay(feature, plan.monthlyCredits)}</span>
                    </li>
                  ))}
                </ul>

                <button
  onClick={() => handleSubscribe(plan)}
  disabled={loadingPlan === plan.name}
  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
    plan.highlight
      ? "bg-white text-blue-600 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700"
  } disabled:opacity-50 disabled:cursor-not-allowed`}
>
  {loadingPlan === plan.name ? "Processing..." : "Subscribe"}
</button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}