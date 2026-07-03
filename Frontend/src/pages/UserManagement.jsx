import React, { useEffect, useState } from "react";
import API from "../api/authService";
import { useToast } from "../context/ToastContext";
import { Users, Eye, Trash2, Shield, UserCog, UserCheck, Search, X, Loader, ToggleLeft, ToggleRight } from "lucide-react";

const UserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/api/admin/users");
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        showToast(response.data.message || "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error retrieving user database from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await API.put(`/api/admin/users/${userId}/role?role=${newRole}`);
      if (response.data.success) {
        showToast("User role updated successfully", "success");
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      } else {
        showToast(response.data.message || "Failed to update role", "error");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to update user role", "error");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await API.put(`/api/admin/users/${userId}/status`);
      if (response.data.success) {
        const updatedUser = response.data.data;
        const statusStr = updatedUser.enabled ? "enabled" : "disabled";
        showToast(`User has been ${statusStr}`, "success");
        setUsers(users.map((u) => (u.id === userId ? { ...u, enabled: updatedUser.enabled } : u)));
      } else {
        showToast(response.data.message || "Failed to toggle status", "error");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to toggle status", "error");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await API.delete(`/api/admin/users/${userToDelete.id}`);
      if (response.data.success) {
        showToast("User deleted successfully", "success");
        setUsers(users.filter((u) => u.id !== userToDelete.id));
      } else {
        showToast(response.data.message || "Failed to delete user", "error");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to delete user", "error");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleViewDetails = async (userId) => {
    setDetailsLoading(true);
    try {
      const response = await API.get(`/api/admin/users/${userId}`);
      if (response.data.success) {
        setSelectedUser(response.data.data);
      } else {
        showToast(response.data.message || "Failed to retrieve user details", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error fetching user details from backend", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4 text-rose-500" />;
      case "STAFF":
        return <UserCog className="w-4 h-4 text-amber-500" />;
      default:
        return <UserCheck className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "STAFF":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.fullName && u.fullName.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="text-slate-500 font-medium">Loading user directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Review active directory, adjust permissions, and manage states.</p>
        </div>
      </div>

      <div className="flex bg-white p-4 rounded-xl border border-slate-200 shadow-sm items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by username, email, name, or role..."
          className="w-full bg-transparent border-none text-slate-700 placeholder-slate-400 focus:outline-none text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role Designation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No users match your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{user.fullName || "N/A"}</span>
                        <span className="text-xs text-slate-400">@{user.username} • {user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <select
                          className="bg-transparent border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="STAFF">STAFF</option>
                          <option value="CUSTOMER">CUSTOMER</option>
                        </select>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadge(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="flex items-center gap-2 cursor-pointer transition focus:outline-none"
                      >
                        {user.enabled ? (
                          <>
                            <ToggleRight className="w-7 h-7 text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-700">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-7 h-7 text-slate-300" />
                            <span className="text-xs font-semibold text-slate-400">Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in animate-duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">User Identification Card</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{selectedUser.fullName || "N/A"}</h4>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Username</span>
                  <span className="text-slate-800">@{selectedUser.username}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Email</span>
                  <span className="text-slate-800 truncate block">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Record ID</span>
                  <span className="text-slate-800">#{selectedUser.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Member Since</span>
                  <span className="text-slate-800 text-nowrap">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Verification Status</span>
                  <span className={selectedUser.enabled ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                    {selectedUser.enabled ? "Enabled (Access Authorized)" : "Disabled (Access Revoked)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in animate-duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">Confirm Deletion</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Are you sure you want to permanently delete user <strong className="text-slate-800">@{userToDelete.username}</strong>? This action is irreversible and deletes all associated records.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-sm font-semibold rounded-xl text-white transition shadow-sm cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
