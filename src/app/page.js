"use client"
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login"); // Redirect to login page for new users
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            AI
          </div>
          <h1 className="text-xl font-semibold">GMB Automate</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#about" className="hover:text-blue-700 transition">About Us</a>
          <a href="#contact" className="hover:text-blue-700 transition">Contact Us</a>
          <button
            onClick={handleGetStarted}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
          >
            Get Started
          </button>
        </nav>

        <div className="md:hidden">
          <button
            onClick={handleGetStarted}
            className="px-3 py-2 bg-blue-700 text-white rounded-md text-sm"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-2xl">
          Automate Your Google My Business with AI
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-xl">
          Manage reviews, schedule posts, and analyze insights — all in one smart dashboard powered by AI.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-6 px-6 py-3 bg-blue-700 text-white text-lg rounded-lg shadow hover:bg-blue-800 transition"
        >
          Get Started
        </button>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t py-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} GMB Automate. All rights reserved.</p>
          <div className="flex gap-6 mt-3 sm:mt-0">
            <a href="#about" className="hover:text-blue-700">About Us</a>
            <a href="#contact" className="hover:text-blue-700">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}