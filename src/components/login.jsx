"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Phone, Mail, User, Lock, CheckCircle, AlertCircle } from "lucide-react";

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
        showMessage("OTP verified! Please complete your profile.", "success");
        setTimeout(() => setStep("details"), 500);
      } else if (res.ok) {
        localStorage.setItem("token", data.token);
        showMessage("Login successful! Redirecting...", "success");
        setTimeout(() => router.push(data.redirectTo || "/subscription"), 1000);
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

      if (res.ok) {
        localStorage.setItem("token", data.token);
        showMessage("Registration complete! Redirecting...", "success");
        setTimeout(() => router.push(data.redirectTo || "/subscription"), 1000);
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
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300 ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isDark 
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" 
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main Card */}
      <div className={`w-full max-w-md transition-colors duration-300 ${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-3xl shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`p-8 text-center ${
          isDark 
            ? "bg-gradient-to-r from-blue-600 to-purple-600" 
            : "bg-gradient-to-r from-blue-500 to-indigo-600"
        }`}>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">GMB Automation</h1>
          <p className="text-blue-100 text-sm">Secure Login Portal</p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === "phone" 
                  ? "bg-blue-600 text-white" 
                  : "bg-green-500 text-white"
              }`}>1</div>
              <div className={`w-12 h-1 ${step === "phone" ? "bg-gray-300" : "bg-green-500"}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === "otp" 
                  ? "bg-blue-600 text-white" 
                  : step === "phone" 
                  ? isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                  : "bg-green-500 text-white"
              }`}>2</div>
              {!isExisting && (
                <>
                  <div className={`w-12 h-1 ${step === "details" ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === "details" 
                      ? "bg-blue-600 text-white" 
                      : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                  }`}>3</div>
                </>
              )}
            </div>
          </div>

          {/* Phone Step */}
          {step === "phone" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-3 ${isDark ? "text-gray-400" : "text-gray-400"}`} size={20} />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, sendOtp)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" 
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <button
                onClick={sendOtp}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Enter OTP
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 ${isDark ? "text-gray-400" : "text-gray-400"}`} size={20} />
                  <input
                    type="text"
                    placeholder="4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, verifyOtp)}
                    maxLength={6}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 text-center text-2xl tracking-widest font-semibold ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" 
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <button
                onClick={verifyOtp}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={() => setStep("phone")}
                className={`w-full py-2 text-sm ${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"} transition-colors`}
              >
                ← Change Number
              </button>
            </div>
          )}

          {/* Details Step */}
          {step === "details" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-3 ${isDark ? "text-gray-400" : "text-gray-400"}`} size={20} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" 
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 ${isDark ? "text-gray-400" : "text-gray-400"}`} size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, completeRegistration)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" 
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <button
                onClick={completeRegistration}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Processing..." : "Complete Registration"}
              </button>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-start space-x-3 animate-fade-in ${
              messageType === "success" 
                ? isDark ? "bg-green-900/30 border border-green-700" : "bg-green-50 border border-green-200"
                : messageType === "error"
                ? isDark ? "bg-red-900/30 border border-red-700" : "bg-red-50 border border-red-200"
                : isDark ? "bg-blue-900/30 border border-blue-700" : "bg-blue-50 border border-blue-200"
            }`}>
              {messageType === "success" ? (
                <CheckCircle className="text-green-500 mt-0.5" size={20} />
              ) : messageType === "error" ? (
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
              ) : (
                <AlertCircle className="text-blue-500 mt-0.5" size={20} />
              )}
              <p className={`text-sm flex-1 ${
                messageType === "success" 
                  ? "text-green-700 dark:text-green-300"
                  : messageType === "error"
                  ? "text-red-700 dark:text-red-300"
                  : "text-blue-700 dark:text-blue-300"
              }`}>
                {message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-8 py-4 text-center border-t ${
          isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
        }`}>
          <p className="text-xs">Secure authentication powered by GMB Automation</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}