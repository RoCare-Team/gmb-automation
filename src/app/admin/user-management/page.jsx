"use client";
import { useEffect, useState } from "react";
import { Search, Filter, X, Crown, Zap, Shield, Mail, Phone, Calendar, Edit2, Trash2, Plus, User, User2Icon } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ userId: "", email: "", phone: "", plan: "Basic" });
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Plan statistics
  const [stats, setStats] = useState({
    total: 0,
    basic: 0,
    standard: 0,
    premium: 0,
    active: 0
  });

  // 🔹 Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Apply search and filters
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone?.includes(searchQuery)
      );
    }

    // Plan filter
    if (filterPlan !== "All") {
      result = result.filter((user) => user.subscription?.plan === filterPlan);
    }

    // Status filter
    if (filterStatus !== "All") {
      result = result.filter((user) => user.subscription?.status === filterStatus);
    }

    setFilteredUsers(result);
  }, [searchQuery, filterPlan, filterStatus, users]);

  // ✅ Calculate statistics
  useEffect(() => {
    const total = users.length;
    const basic = users.filter(u => u.subscription?.plan === "Basic").length;
    const standard = users.filter(u => u.subscription?.plan === "Standard").length;
    const premium = users.filter(u => u.subscription?.plan === "Premium").length;
    const active = users.filter(u => u.subscription?.status === "active").length;

    setStats({ total, basic, standard, premium, active });
  }, [users]);

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

  console.log("useruser",users);
  

  // ✅ POST: Add new user
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
        setNewUser({ userId: "", email: "", phone: "", plan: "Basic" });
        fetchUsers();
      } else {
        alert(data.error || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterPlan("All");
    setFilterStatus("All");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage subscriptions and user accounts</p>
          </div>
          <button
            onClick={() => setAddingUser(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <User className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Basic Plan</p>
                <p className="text-3xl font-bold text-gray-700 mt-1">{stats.basic}</p>
              </div>
              <Shield className="text-gray-600" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Standard Plan</p>
                <p className="text-3xl font-bold text-blue-800 mt-1">{stats.standard}</p>
              </div>
              <Zap className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">Premium Plan</p>
                <p className="text-3xl font-bold text-purple-800 mt-1">{stats.premium}</p>
              </div>
              <Crown className="text-purple-600" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Paid Users</p>
                <p className="text-3xl font-bold text-green-800 mt-1">{stats.active}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by email, user ID, or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Plan Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="pl-11 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer min-w-[150px]"
              >
                <option value="All">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer min-w-[150px]"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || filterPlan !== "All" || filterStatus !== "All") && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <X size={18} />
                Clear
              </button>
            )}
          </div>

          {/* Active Filters Info */}
          {filteredUsers.length !== users.length && (
            <div className="mt-4 text-sm text-gray-600">
              Showing <span className="font-semibold text-indigo-600">{filteredUsers.length}</span> of {users.length} users
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subscribed</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.userId}</div>
                          <div className="text-xs text-gray-500">ID: {user._id?.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                     <td className="px-6 py-4">
                      <div className="space-y-1">
                       
                        {user.fullName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User2Icon size={14} className="text-gray-400" />
                            {user.fullName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} className="text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.subscription?.plan === "Premium" && <Crown size={16} className="text-purple-600" />}
                        {user.subscription?.plan === "Standard" && <Zap size={16} className="text-blue-600" />}
                        {user.subscription?.plan === "Basic" && <Shield size={16} className="text-gray-600" />}
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            user.subscription?.plan === "Premium"
                              ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                              : user.subscription?.plan === "Standard"
                              ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.subscription?.plan || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          user.subscription?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          user.subscription?.status === "active" ? "bg-green-500" : "bg-gray-500"
                        }`}></div>
                        {user.subscription?.status === "active" ? "Paid User" : "Free Plan"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {user.subscription?.date
                          ? new Date(user.subscription.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.subscription?.expiry ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <div>
                            <div className={`text-sm font-medium ${
                              new Date(user.subscription.expiry) < new Date() 
                                ? "text-red-600" 
                                : new Date(user.subscription.expiry) - new Date() < 7 * 24 * 60 * 60 * 1000
                                ? "text-orange-600"
                                : "text-gray-700"
                            }`}>
                              {new Date(user.subscription.expiry).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </div>
                            {new Date(user.subscription.expiry) < new Date() ? (
                              <span className="inline-block mt-0.5 px-2 py-0.5 text-xs text-red-700 bg-red-100 rounded-full font-semibold">
                                Expired
                              </span>
                            ) : new Date(user.subscription.expiry) - new Date() < 7 * 24 * 60 * 60 * 1000 ? (
                              <span className="inline-block mt-0.5 px-2 py-0.5 text-xs text-orange-700 bg-orange-100 rounded-full font-semibold">
                                Expiring Soon
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpgradePlan(user)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
                          title="Upgrade Plan"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.userId)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="text-gray-400">
                        <Search size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upgrade Plan Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Upgrade Plan</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">User</p>
                <p className="font-semibold text-gray-800">{selectedUser.email}</p>
              </div>

              <div className="space-y-3 mb-6">
                {["Basic", "Standard", "Premium"].map((plan) => (
                  <label
                    key={plan}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPlan === plan
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        value={plan}
                        checked={selectedPlan === plan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <div className="flex items-center gap-2">
                        {plan === "Premium" && <Crown size={18} className="text-purple-600" />}
                        {plan === "Standard" && <Zap size={18} className="text-blue-600" />}
                        {plan === "Basic" && <Shield size={18} className="text-gray-600" />}
                        <span className="font-semibold text-gray-800">{plan}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPlanChange}
                  disabled={updating === selectedUser.userId}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
                >
                  {updating === selectedUser.userId ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {addingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
                <button
                  onClick={() => setAddingUser(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                  <input
                    type="text"
                    placeholder="Enter user ID"
                    value={newUser.userId}
                    onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                  <select
                    value={newUser.plan}
                    onChange={(e) => setNewUser({ ...newUser, plan: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setAddingUser(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}