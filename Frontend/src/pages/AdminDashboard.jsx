// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Register form state
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!auth || auth.role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [auth, navigate]);

  // Update user role
  const changeRole = async (userId, newRole) => {
    try {
      const response = await API.put(`/users/${userId}/role`, { role: newRole });
      setMessage(` ${response.data.user.username || response.data.user.name}'s role changed to ${newRole.toUpperCase()}`);
      fetchUsers(); // Refresh user list
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error changing role");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Register new staff or user
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await API.post("/auth/register", newUser);
      setMessage(` ${newUser.username} registered as ${newUser.role.toUpperCase()}`);
      setShowRegisterForm(false);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      fetchUsers(); // Refresh user list
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setTimeout(() => setError(""), 3000);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Calculate stats
  const adminCount = users.filter(u => u.role === "admin").length;
  const staffCount = users.filter(u => u.role === "staff").length;
  const userCount = users.filter(u => u.role === "user").length;

  if (!auth || auth.role !== "admin") {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-600">Welcome to Admin Dashboard</p>
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{adminCount}</div>
          <div className="text-sm text-red-700">Total Admins</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{staffCount}</div>
          <div className="text-sm text-blue-700">Total Staff</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{userCount}</div>
          <div className="text-sm text-green-700">Total Users</div>
        </div>
      </div>

      {/* Register New Staff/User Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showRegisterForm ? "✖ Cancel" : " Register New Staff / User"}
        </button>
      </div>

      {/* Registration Form */}
      {showRegisterForm && (
        <div className="mb-6 bg-white border rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4"> Register New Staff or User</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 rounded"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border p-2 rounded"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
                minLength={6}
              />
              <select
                className="border p-2 rounded"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="staff">👨‍💼 Staff</option>
                <option value="user">👤 User</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Registering..." : "Register User"}
            </button>
          </form>
        </div>
      )}

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-xl font-semibold text-gray-800">📋 User Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Change roles using dropdown or register new staff/users
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.N.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select New Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username || user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "admin" ? "bg-red-100 text-red-800" :
                      user.role === "staff" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={selectedRole[user._id] || user.role}
                      onChange={(e) => setSelectedRole({ ...selectedRole, [user._id]: e.target.value })}
                      className="border rounded px-3 py-1 text-sm"
                      disabled={user.email === auth?.email}
                    >
                      <option value="admin"> Admin</option>
                      <option value="staff"> Staff</option>
                      <option value="user"> User</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => changeRole(user._id, selectedRole[user._id] || user.role)}
                      disabled={user.email === auth?.email}
                      className={`px-3 py-1 rounded text-sm ${
                        user.email === auth?.email
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2"> How to change role?</h4>
        <ul className="text-sm text-blue-700 space-y-1 ml-6 list-disc">
          <li><strong>Step 1:</strong> Select new role from dropdown (Admin/Staff/User)</li>
          <li><strong>Step 2:</strong> Click "Update Role" button</li>
          <li><strong>Step 3:</strong> Role will be changed instantly</li>
        </ul>
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
             <strong>Note:</strong> Staff can only view data. User can only see profile. Admin has full control.
            You cannot change your own role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;