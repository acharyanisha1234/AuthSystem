import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/authService";
import { useToast } from "../context/ToastContext";
import { Users, Shield, UserCheck, UserCog, ArrowRight, Loader } from "lucide-react";

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/api/admin/stats");
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          showToast(response.data.message || "Failed to load statistics", "error");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        showToast("Error retrieving statistics from backend", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="text-slate-500 font-medium">Loading statistics...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      bgColor: "bg-blue-50 border-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Administrators",
      value: stats?.adminCount ?? 0,
      icon: Shield,
      bgColor: "bg-rose-50 border-rose-100",
      textColor: "text-rose-600",
    },
    {
      title: "Staff Members",
      value: stats?.staffCount ?? 0,
      icon: UserCog,
      bgColor: "bg-amber-50 border-amber-100",
      textColor: "text-amber-600",
    },
    {
      title: "Customers",
      value: stats?.customerCount ?? 0,
      icon: UserCheck,
      bgColor: "bg-emerald-50 border-emerald-100",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Monitor users, statistics, and system configurations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`p-6 rounded-2xl border bg-white flex items-center justify-between shadow-sm transition hover:shadow-md ${card.bgColor}`}>
              <div className="space-y-1">
                <span className="text-sm font-medium text-slate-500">{card.title}</span>
                <p className="text-3xl font-bold text-slate-800">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-xl bg-white shadow-sm ${card.textColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">User Management</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              View all registered users, adjust their authentication roles, enable or disable accounts, and permanently delete profiles from the system.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Manage Users <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">Register Staff Member</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Provision administrative staff members with proper security credentials. Created staff members can log in immediately.
            </p>
          </div>
          <Link
            to="/admin/create-staff"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Create Staff Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
