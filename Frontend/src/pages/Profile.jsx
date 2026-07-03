import React, { useEffect, useState } from "react";
import API from "../api/authService";
import { useToast } from "../context/ToastContext";
import { User, Mail, Shield, Loader, FileText, CheckCircle, AlertCircle } from "lucide-react";

const Profile = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");
  let loggedInUser = null;
  try {
    loggedInUser = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error(e);
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!loggedInUser) {
        setLoading(false);
        return;
      }

      const endpoint =
        loggedInUser.role === "ADMIN" || loggedInUser.role === "STAFF"
          ? "/api/staff/profile"
          : "/api/customer/profile";

      try {
        const response = await API.get(endpoint);
        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          showToast(response.data.message || "Failed to load profile", "error");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        showToast("Error retrieving profile details from backend", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showToast, loggedInUser?.role]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="text-slate-500 font-medium">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <span>No profile data could be retrieved. Please try logging in again.</span>
      </div>
    );
  }

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

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

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-slate-500 mt-1">Review your personal details and privileges.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-sky-600"></div>

        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-8 gap-4">
            <div className="w-28 h-28 bg-slate-100 border-4 border-white rounded-2xl shadow flex items-center justify-center text-slate-500">
              <User className="w-14 h-14" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getRoleBadge(profile.role)}`}>
                {profile.role}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                {profile.enabled ? "Active Account" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{profile.fullName || "User Profile"}</h2>
              <p className="text-slate-500 text-sm font-medium">Member since: {formattedDate}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username</label>
                <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                  <User className="w-4 h-4 text-slate-400" />
                  {profile.username}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {profile.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">User ID</label>
                <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                  <FileText className="w-4 h-4 text-slate-400" />
                  #{profile.id}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Credentials</label>
                <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                  <Shield className="w-4 h-4 text-slate-400" />
                  JWT Secured
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
