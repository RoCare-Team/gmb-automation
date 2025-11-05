"use client";
import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, Sparkles, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Plan({ user }) {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState(null);
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState(null);

  // Load current plan from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem("Plan");
    if (savedPlan) {
      setCurrentPlan(savedPlan);
    }
  }, []);

  // Base Plan Data (Monthly prices)
  const basePlans = [
    {
      name: "Basic Plan",
      monthlyPrice: 999,
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
      icon: "✨",
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
      icon: "🚀",
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
      icon: "👑",
    },
  ];

  const calculatePrice = (monthlyPrice) => {
    switch (billingCycle) {
      case "quarterly":
        return Math.round(monthlyPrice * 3 * 0.84);
      case "yearly":
        return Math.round(monthlyPrice * 12 * 0.80);
      default:
        return monthlyPrice;
    }
  };

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
    setLoadingPlan(plan.name);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      setLoadingPlan(null);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not found. Please login first.");
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
        alert(orderData.error || "Order creation failed");
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
              alert(result.error || "Payment verification failed");
              setLoadingPlan(null);
              return;
            }

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
              localStorage.setItem("Plan", plan.name);
              setCurrentPlan(plan.name);
              
              toast.success(`Subscribed to ${plan.name} successfully! ${totalCredits} credits added.`);
              
              setTimeout(() => {
                router.push("/dashboard");
              }, 1500);
            } else {
              alert("Payment successful but credit update failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment processing error:", err);
            alert("Verification failed!");
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
        alert("Payment failed!");
        setLoadingPlan(null);
      });
      rzp.open();
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Something went wrong!");
      setLoadingPlan(null);
    }
  };

  const formatCreditsDisplay = (feature, monthlyCredits) => {
    if (!feature.includes("Credits Included")) return feature;

    const totalCredits = calculateCredits(monthlyCredits);

    if (billingCycle === "monthly") {
      return `${totalCredits} Credits Included /month`;
    } else {
      return `${totalCredits} Credits Included (${monthlyCredits}/month)`;
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-8">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Current Plan Badge */}
        {/* {currentPlan && (
          <div className="max-w-7xl mx-auto mb-8 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Your Current Plan: {currentPlan}</span>
            </div>
          </div>
        )} */}

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
        
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Choose Your Plan
            
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Supercharge your Google My Business presence with AI-powered automation tools
          </p>
        </div>

        {/* Billing Cycle Selector */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 inline-flex gap-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("quarterly")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === "quarterly"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Quarterly
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                16% OFF
              </span>
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {basePlans.map((plan) => {
            const finalPrice = calculatePrice(plan.monthlyPrice);
            const totalCredits = calculateCredits(plan.monthlyCredits);
            const savings = getSavings();
            const originalPrice =
              billingCycle === "quarterly"
                ? plan.monthlyPrice * 3
                : billingCycle === "yearly"
                ? plan.monthlyPrice * 12
                : null;
            const isCurrentPlan = currentPlan === plan.name;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl transition-all duration-500 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl scale-105 lg:scale-110 border-2 border-blue-400"
                    : "bg-white/90 backdrop-blur-sm text-gray-800 shadow-xl hover:shadow-2xl hover:scale-105 border border-gray-200"
                }`}
              >
                {/* Popular Badge */}
                {plan.highlight && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-6 py-2 rounded-full text-sm shadow-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-5 right-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Active
                    </div>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Plan Icon & Name */}
                  <div className="mb-6">
                    <div className="text-5xl mb-3">{plan.icon}</div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">{plan.name}</h2>
                    <p className={`text-base ${plan.highlight ? "text-blue-100" : "text-gray-600"}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    {originalPrice && (
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl line-through opacity-60">₹{originalPrice}</span>
                        {savings && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                            {savings}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold">₹{finalPrice}</span>
                      <span className="text-lg font-medium opacity-75">/{getDuration()}</span>
                    </div>
                    {billingCycle !== "monthly" && (
                      <p className={`text-sm mt-2 ${plan.highlight ? "text-blue-100" : "text-gray-600"}`}>
                        ₹{Math.round(finalPrice / (billingCycle === "quarterly" ? 3 : 12))}/month
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            plan.highlight ? "bg-white/20" : "bg-blue-100"
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 ${plan.highlight ? "text-white" : "text-blue-600"}`}
                          />
                        </div>
                        <span className="text-sm leading-relaxed">
                          {formatCreditsDisplay(feature, plan.monthlyCredits)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loadingPlan === plan.name || isCurrentPlan}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:opacity-60 disabled:cursor-not-allowed ${
                      plan.highlight
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    }`}
                  >
                    {loadingPlan === plan.name ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      "Get Started"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">Bank-grade encryption</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-gray-900 mb-1">Instant Activation</h3>
              <p className="text-sm text-gray-600">Start automating immediately</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="font-bold text-gray-900 mb-1">Money-back Guarantee</h3>
              <p className="text-sm text-gray-600">30-day refund policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}