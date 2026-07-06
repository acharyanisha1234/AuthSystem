import React, { useEffect, useState } from "react";
import API from "../api/authService";
import { useToast } from "../context/ToastContext";
import { Loader, User, Mail, Calendar, ShieldCheck } from "lucide-react";

const Profile = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          showToast("Please log in again.", "error");
          setLoading(false);
          return;
        }
        const loggedInUser = JSON.parse(userString);
        const role = loggedInUser.role || "CUSTOMER";

        // Determine endpoint based on role
        const endpoint =
          role === "ADMIN" || role === "STAFF"
            ? "/api/staff/profile"
            : "/api/customer/profile";

        console.log(" Fetching profile from:", endpoint);

        const response = await API.get(endpoint);
        console.log(" Profile response:", response.data);

        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          showToast(
            response.data.message || "Failed to load profile",
            "error"
          );
        }
      } catch (error) {
        console.error(" Error fetching profile:", error);
        if (error.response?.status === 401) {
          showToast("Session expired – please log in again.", "error");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
          return;
        }
        showToast(
          error.response?.data?.message || "Error retrieving profile details",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showToast]);

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
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500">No profile data available.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
            {profile.fullName?.charAt(0) || profile.username?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.fullName || profile.username}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {profile.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-slate-600">
            <User className="w-5 h-5 text-slate-400" />
            <span>
              <span className="font-medium">Username:</span> {profile.username}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-5 h-5 text-slate-400" />
            <span>
              <span className="font-medium">Email:</span> {profile.email}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span>
              <span className="font-medium">Joined:</span>{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
            <span>
              <span className="font-medium">Status:</span>{" "}
              <span className="text-emerald-600">Active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;