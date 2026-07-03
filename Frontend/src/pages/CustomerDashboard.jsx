import React, { useEffect, useState } from "react";
import API from "../api/authService";
import { useToast } from "../context/ToastContext";
import { User, Mail, Calendar, ShieldCheck, Loader, Heart } from "lucide-react";

const CustomerDashboard = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/customer/profile");
        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          showToast(response.data.message || "Failed to load customer profile", "error");
        }
      } catch (error) {
        console.error("Error fetching customer profile:", error);
        showToast("Error retrieving customer profile from backend", "error");
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
        <span className="text-slate-500 font-medium">Loading customer dashboard...</span>
      </div>
    );
  }

  const formattedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Manage your customer account and profile settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6 lg:col-span-1">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
            <User className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">{profile?.fullName || profile?.username || "Valued Customer"}</h2>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{profile?.role}</p>
          </div>
          <div className="w-full border-t border-slate-100 pt-6 space-y-4 text-left">
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <User className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span className="truncate">Username: <strong className="text-slate-800">{profile?.username}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span className="truncate">Email: <strong className="text-slate-800">{profile?.email}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <Calendar className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>Registered: <strong className="text-slate-800">{formattedDate}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>Account Status: <span className="px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">Enabled</span></span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your Experience Matters</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <h3 className="font-semibold text-slate-800">Exclusive Customer Services</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Thank you for choosing our secure authentication portal. You have access to our customized customer settings. Feel free to browse, configure your account settings, and explore active client widgets.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <h3 className="font-semibold text-slate-800">Security Checkup</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your account is fully protected using JWT standard token authentication. We automatically expire inactive credentials to keep your profile secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
