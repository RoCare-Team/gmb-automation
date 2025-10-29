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
        // New user - needs to complete registration
        showMessage("OTP verified! Please complete your profile.", "success");
        setTimeout(() => setStep("details"), 500);
      } else if (res.ok && data.token) {
        // Existing user - login successful
        localStorage.setItem("token", data.token);
        showMessage("Login successful! Redirecting...", "success");
        router.push("/subscription")
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
        showMessage("Registration complete! Redirecting...", "success");
        router.push("/subscription")
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
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
    }`}>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 ${
          isDark ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
        }`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main Card */}
      <div className={`w-full max-w-md rounded-2xl shadow-2xl transition-all duration-300 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>

        {/* Header */}
        <div className={`p-8 text-center border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>

          <div className="flex justify-center mb-4">

            <div className={`p-4 rounded-full ${
              isDark ? "bg-blue-500/20" : "bg-blue-500/10"
            }`}>
              <Lock className="text-blue-500" size={32} />
            </div>

          </div>

          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            GMB Automation
          </h1>

          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Secure Login Portal
          </p>

        </div>

        {/* Form Content */}
        <div className="p-8">

          {/* Step Indicator */}
          <div className="mb-8">

            <div className="flex items-center justify-center gap-2">

              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                step === "phone" ? "bg-blue-500 text-white" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
              }`}>
                1
              </div>

              <div className={`h-1 w-12 ${step !== "phone" ? "bg-blue-500" : isDark ? "bg-gray-700" : "bg-gray-200"}`} />

              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                step === "otp" ? "bg-blue-500 text-white" : step === "details" ? isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
              }`}>
                2
              </div>

              {!isExisting && (
                <>
                  <div className={`h-1 w-12 ${step === "details" ? "bg-blue-500" : isDark ? "bg-gray-700" : "bg-gray-200"}`} />

                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                    step === "details" ? "bg-blue-500 text-white" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
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

                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Mobile Number
                </label>

                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} size={20} />
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
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>

          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="space-y-6">

              <div>

                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Enter OTP
                </label>

                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} size={20} />
                  <input
                    type="text"
                    placeholder="Enter Otp"
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
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="space-y-6">

              <div>

                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Full Name
                </label>

                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} size={20} />
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
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} size={20} />
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
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Complete Registration"}
              </button>
            </div>

          )}

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
              messageType === "success" ? "bg-green-500/10 text-green-500" :
              messageType === "error" ? "bg-red-500/10 text-red-500" :
              "bg-blue-500/10 text-blue-500"
            }`}>
              {messageType === "success" ? (
                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              ) : messageType === "error" ? (
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              )}

              <p className="text-sm font-medium">
                {message}
              </p>

            </div>

          )}
        </div>

        {/* Footer */}
        <div className={`p-6 text-center border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>

          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Secure authentication powered by GMB Automation
          </p>

        </div>

      </div>

    </div>

  );
}