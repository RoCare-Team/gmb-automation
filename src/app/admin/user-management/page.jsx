"use client";
import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ userId: "", email: "", plan: "Basic" });

  // 🔹 Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ GET: Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ PUT: Handle plan upgrade
  const handleUpgradePlan = (user) => {
    setSelectedUser(user);
    setSelectedPlan(user.subscription?.plan || "Basic");
  };

  const confirmPlanChange = async () => {
    if (!selectedUser || !selectedPlan) return;
    setUpdating(selectedUser.userId);

    try {
      const res = await fetch(`/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.userId,
          newPlan: selectedPlan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setSelectedUser(null);
      } else {
        alert(data.error || "Failed to update plan");
      }
    } catch (err) {
      console.error("Error updating plan:", err);
    } finally {
      setUpdating(null);
    }
  };

  // ✅ DELETE: Remove user
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // ✅ POST: Add new user (for dummy/testing)
  const handleAddUser = async () => {
    if (!newUser.userId || !newUser.email) {
      alert("Please enter both User ID and Email");
      return;
    }

    try {
      const res = await fetch(`/api/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        alert("User added successfully!");
        setAddingUser(false);
        setNewUser({ userId: "", email: "", plan: "Basic" });
        fetchUsers();
      } else {
        alert(data.error || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-600">
        Loading users...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => setAddingUser(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Subscribed On</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium">{user.userId}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.subscription?.plan === "Premium"
                        ? "bg-purple-100 text-purple-700"
                        : user.subscription?.plan === "Standard"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.subscription?.plan || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.subscription?.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.subscription?.status || "inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.subscription?.date
                    ? new Date(user.subscription.date).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleUpgradePlan(user)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition"
                  >
                    Upgrade
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.userId)}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Upgrade Plan Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Upgrade Plan for {selectedUser.email}
            </h2>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmPlanChange}
                disabled={updating === selectedUser.userId}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {updating === selectedUser.userId ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add User Modal */}
      {addingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New User</h2>

            <input
              type="text"
              placeholder="User ID"
              value={newUser.userId}
              onChange={(e) =>
                setNewUser({ ...newUser, userId: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-3"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-3"
            />
            <select
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              value={newUser.plan}
              onChange={(e) =>
                setNewUser({ ...newUser, plan: e.target.value })
              }
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAddingUser(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
