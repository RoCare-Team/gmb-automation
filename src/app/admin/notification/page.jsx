"use client";
import { useState, useEffect } from "react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Fetch notifications
  const fetchNotifications = async () => {
    const res = await fetch("/api/admin/notification");
    const data = await res.json();
    if (data.success) setNotifications(data.notifications);
  };

  // Add new notification
  const addNotification = async () => {
    const res = await fetch("/api/admin/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });

    const data = await res.json();
    if (data.success) {
      setTitle("");
      setMessage("");
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Admin Notifications
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 w-full mb-3"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded p-2 w-full mb-3"
        ></textarea>
        <button
          onClick={addNotification}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Notification
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className="bg-gray-100 p-3 rounded-lg border border-gray-200"
          >
            <h3 className="font-semibold text-gray-800">{n.title}</h3>
            <p className="text-gray-600">{n.message}</p>
            <span className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
