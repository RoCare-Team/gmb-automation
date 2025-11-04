"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Phone, Mail, User, Lock, CheckCircle, AlertCircle, MapPin, Star, TrendingUp, BarChart3, Users, Globe } from "lucide-react";

export default function LoginPage() {
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("phone");
  const [isExisting, setIsExisting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDark(theme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };

const sendOtp = async () => {
  if (!phone || phone.length < 10) {
    showMessage("Please enter a valid phone number", "error");
    return;
  }

  setIsLoading(true);
  showMessage("Sending OTP...", "info");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (res.ok) {
      showMessage("OTP sent successfully ✓", "success");
      setIsExisting(data.isExistingUser);
      setTimeout(() => setStep("otp"), 500);
    } else {
      showMessage(data.error || "Failed to send OTP", "error");
    }
  } catch (error) {
    showMessage("Network error. Please try again.", "error");
  } finally {
    setIsLoading(false);
  }
};

const verifyOtp = async () => {
  if (!otp || otp.length < 4) {
    showMessage("Please enter a valid OTP", "error");
    return;
  }

  setIsLoading(true);
  showMessage("Verifying OTP...", "info");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();

    if (data.step === "collect_details") {
      // New user - needs to complete registration
      showMessage("OTP verified! Please complete your profile.", "success");
      setTimeout(() => setStep("details"), 500);
    } else if (res.ok && data.token) {
      // Existing user - login successful
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.userId);
      localStorage.setItem("fullName", data.user.fullName);
      showMessage("Login successful! Redirecting...", "success");
      setTimeout(() => router.push("/dashboard"), 800);
    } else {
      showMessage(data.error || "Invalid OTP", "error");
    }
  } catch (error) {
    showMessage("Network error. Please try again.", "error");
  } finally {
    setIsLoading(false);
  }
};


  const completeRegistration = async () => {
    if (!name || !email) {
      showMessage("Please fill in all fields", "error");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      showMessage("Please enter a valid email", "error");
      return;
    }
    
    setIsLoading(true);
    showMessage("Completing registration...", "info");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name, email }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.userId);

        showMessage("Registration complete! Redirecting...", "success");
        if(data.token){
         router.push("/dashboard")
       }
       else {
        router.push("/login")
       }
      } else {
        showMessage(data.error || "Registration failed", "error");
      }
    } catch (error) {
      showMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter" && !isLoading) {
      action();
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${
      isDark ? "bg-slate-950" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!isDark && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </>
        )}
        
        {isDark && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 z-50 backdrop-blur-sm ${
          isDark ? "bg-slate-800/80 text-yellow-400 hover:bg-slate-700 shadow-lg shadow-blue-500/20" : "bg-white/80 text-slate-700 hover:bg-white shadow-xl shadow-purple-500/20"
        }`}
      >
        {isDark ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      {/* Container with Two Sections */}
      <div className="w-full max-w-6xl flex gap-8 items-center relative z-10">
        
        {/* Left Side - Marketing Content */}
        <div className="hidden lg:flex flex-1 flex-col gap-8">
          
          {/* Main Hero Section */}
          <div className={`rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 ${
            isDark ? "bg-slate-900/60 border border-slate-800" : "bg-white/60 border border-white/50"
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${
                isDark ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"
              } shadow-lg`}>
                <MapPin className="text-white" size={32} />
              </div>
              <div>
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
                } bg-clip-text text-transparent`}>
                  GMB Management
                </h2>
                <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Your Business, Amplified Online
                </p>
              </div>
            </div>

            <p className={`text-lg mb-6 ${isDark ? "text-slate-300" : "text-slate-700"} leading-relaxed`}>
              Take control of your Google My Business presence with our powerful automation platform. Manage reviews, posts, and analytics all in one place.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                  <BarChart3 className={isDark ? "text-blue-400" : "text-blue-600"} size={20} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Real-Time Analytics</h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Track performance metrics and customer engagement instantly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                  <Users className={isDark ? "text-purple-400" : "text-purple-600"} size={20} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Review Management</h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Respond to reviews automatically and maintain your reputation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-indigo-500/20" : "bg-indigo-100"}`}>
                  <Globe className={isDark ? "text-indigo-400" : "text-indigo-600"} size={20} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Multi-Location Support</h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Manage multiple business locations from a single dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`rounded-2xl p-5 text-center backdrop-blur-xl ${
              isDark ? "bg-slate-900/60 border border-slate-800" : "bg-white/60 border border-white/50"
            }`}>
              <Star className={`mx-auto mb-2 ${isDark ? "text-yellow-400" : "text-yellow-500"}`} size={28} />
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>4.9/5</div>
              <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Avg Rating</div>
            </div>

            <div className={`rounded-2xl p-5 text-center backdrop-blur-xl ${
              isDark ? "bg-slate-900/60 border border-slate-800" : "bg-white/60 border border-white/50"
            }`}>
              <TrendingUp className={`mx-auto mb-2 ${isDark ? "text-green-400" : "text-green-600"}`} size={28} />
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>1k</div>
              <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Businesses</div>
            </div>

            <div className={`rounded-2xl p-5 text-center backdrop-blur-xl ${
              isDark ? "bg-slate-900/60 border border-slate-800" : "bg-white/60 border border-white/50"
            }`}>
              <BarChart3 className={`mx-auto mb-2 ${isDark ? "text-blue-400" : "text-blue-600"}`} size={28} />
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>45%</div>
              <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Growth Avg</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={`w-full lg:w-[440px] rounded-3xl shadow-2xl transition-all duration-500 backdrop-blur-xl ${
          isDark ? "bg-slate-900/80 border border-slate-800 shadow-blue-500/10" : "bg-white/70 border border-white/50 shadow-purple-500/20"
        }`}>

          {/* Header with Gradient */}
          <div className={`p-8 text-center border-b relative overflow-hidden ${isDark ? "border-slate-800" : "border-indigo-100"}`}>
            
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-blue-600/10 to-purple-600/10' : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'}`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className={`p-5 rounded-2xl relative ${
                  isDark ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"
                } shadow-lg`}>
                  <Lock className="text-white" size={32} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              <h1 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Welcome Back
              </h1>

              <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Sign in to access your dashboard
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">

            {/* Enhanced Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2">
                <div className={`flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm shadow-lg transition-all duration-300 ${
                  step === "phone" 
                    ? isDark ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-blue-500/50" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/50"
                    : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-500"
                }`}>
                  1
                </div>

                <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${
                  step !== "phone" 
                    ? isDark ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                    : isDark ? "bg-slate-800" : "bg-slate-200"
                }`} />

                <div className={`flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm shadow-lg transition-all duration-300 ${
                  step === "otp" 
                    ? isDark ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-blue-500/50" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/50"
                    : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-500"
                }`}>
                  2
                </div>

                {!isExisting && (
                  <>
                    <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${
                      step === "details" 
                        ? isDark ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : isDark ? "bg-slate-800" : "bg-slate-200"
                    }`} />

                    <div className={`flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm shadow-lg transition-all duration-300 ${
                      step === "details" 
                        ? isDark ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-blue-500/50" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/50"
                        : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-500"
                    }`}>
                      3
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Phone Step */}
            {step === "phone" && (
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Mobile Number
                  </label>

                  <div className="relative group">
                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-slate-500 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`} size={20} />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, sendOtp)}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 font-medium ${
                        isDark 
                          ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800" 
                          : "bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"
                      } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-blue-500/20' : 'focus:ring-indigo-500/20'}`}
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={isLoading}
                  className={`w-full py-3.5 font-bold rounded-xl transition-all duration-300 shadow-lg ${
                    isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/30"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-indigo-500/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Enter OTP
                  </label>

                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-slate-500 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`} size={20} />
                    <input
                      type="text"
                      placeholder="• • • • "
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, verifyOtp)}
                      maxLength={6}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 text-center text-2xl tracking-[0.5em] font-bold ${
                        isDark 
                          ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800" 
                          : "bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"
                      } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-blue-500/20' : 'focus:ring-indigo-500/20'}`}
                    />
                  </div>
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={isLoading}
                  className={`w-full py-3.5 font-bold rounded-xl transition-all duration-300 shadow-lg ${
                    isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/30"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-indigo-500/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                
                <button
                  onClick={() => setStep("phone")}
                  className={`w-full py-2 text-sm font-semibold ${isDark ? "text-slate-400 hover:text-blue-400" : "text-slate-600 hover:text-indigo-600"} transition-colors`}
                >
                  ← Change Number
                </button>
              </div>
            )}

            {/* Details Step */}
            {step === "details" && (
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Full Name
                  </label>

                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-slate-500 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`} size={20} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 font-medium ${
                        isDark 
                          ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800" 
                          : "bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"
                      } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-blue-500/20' : 'focus:ring-indigo-500/20'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Email Address
                  </label>

                  <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-slate-500 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`} size={20} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, completeRegistration)}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 font-medium ${
                        isDark 
                          ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800" 
                          : "bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"
                      } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-blue-500/20' : 'focus:ring-indigo-500/20'}`}
                    />
                  </div>
                </div>

                <button
                  onClick={completeRegistration}
                  disabled={isLoading}
                  className={`w-full py-3.5 font-bold rounded-xl transition-all duration-300 shadow-lg ${
                    isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/30"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-indigo-500/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {isLoading ? "Processing..." : "Complete Onboarding"}
                </button>
              </div>
            )}

            {/* Enhanced Message Display */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm transition-all duration-300 ${
                messageType === "success" ? isDark ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border border-emerald-200 text-emerald-700" :
                messageType === "error" ? isDark ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-red-50 border border-red-200 text-red-700" :
                isDark ? "bg-blue-500/10 border border-blue-500/30 text-blue-400" : "bg-blue-50 border border-blue-200 text-blue-700"
              }`}>
                {messageType === "success" ? (
                  <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                ) : messageType === "error" ? (
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                )}

                <p className="text-sm font-semibold">
                  {message}
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className={`p-6 text-center border-t relative overflow-hidden ${isDark ? "border-slate-800" : "border-indigo-100"}`}>
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-slate-900/50' : 'bg-gradient-to-t from-blue-50/50'}`}></div>
            <p className={`text-xs font-medium relative z-10 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              🔒 Secure authentication powered by GMB Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}