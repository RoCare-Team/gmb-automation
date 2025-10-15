'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("data", data);

    if (!res.ok) throw new Error(data.error || "Invalid credentials");

    toast.success("Login successful!");


    // Save token and userId
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.userId);
    localStorage.setItem("Plan", data.user.subscription.plan)
    localStorage.setItem("user",data.user.name)

    // 🔹 Redirect based on subscription
    if (data.user.subscription && data.user.subscription.status === "active") {
      router.push("/dashboard");
    } else {
      router.push("/subscription");
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};


  const handleGoogleLogin = async () => {
    toast("Google login not implemented yet", { icon: "⚡" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transition-transform hover:scale-[1.01]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back 👋</h1>
          <p className="text-gray-500 text-sm">
            Sign in to your account to manage your GMB profile
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition-all font-medium text-gray-700"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">Create one</a>
        </p>
      </div>
    </div>
  );
}
