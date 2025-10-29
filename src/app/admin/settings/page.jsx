"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    razorpayKeyId: "rzp_test_1234567890abcdef",
    supportNumber: "+91 9876543210",
    supportEmail: "support@example.com",
    companyName: "My Company",
    companyAddress: "GMD megapolis",
    websiteUrl: "https://www.mannubhai.com",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Mock save
    setMessage("Settings saved");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

      {/* Payment Gateway */}
      <div className="space-y-2">
        <h2 className="font-semibold text-lg">Payment Gateway</h2>
        <input
          name="razorpayKeyId"
          value={settings.razorpayKeyId}
          onChange={handleChange}
          placeholder="Razorpay Key ID"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Support Info */}
      <div className="space-y-2">
        <h2 className="font-semibold text-lg">Support Info</h2>
        <input
          name="supportNumber"
          value={settings.supportNumber}
          onChange={handleChange}
          placeholder="Support Number"
          className="w-full p-2 border rounded"
        />
        <input
          name="supportEmail"
          value={settings.supportEmail}
          onChange={handleChange}
          placeholder="Support Email"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Company Info */}
      <div className="space-y-2">
        <h2 className="font-semibold text-lg">Company Info</h2>
        <input
          name="companyName"
          value={settings.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="companyAddress"
          value={settings.companyAddress}
          onChange={handleChange}
          placeholder="Company Address"
          className="w-full p-2 border rounded"
        />
        <input
          name="websiteUrl"
          value={settings.websiteUrl}
          onChange={handleChange}
          placeholder="Website URL"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Settings
      </button>

      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
}
