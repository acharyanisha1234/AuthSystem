import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import AuthPage from "./pages/AuthPage";
import AccessDenied from "./pages/AccessDenied";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import CreateStaff from "./pages/CreateStaff";

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Protected Dashboard Routes (Shared Layout) */}
        <Route element={<DashboardLayout />}>
          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/create-staff" element={<CreateStaff />} />
          </Route>

          {/* Staff & Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["STAFF", "ADMIN"]} />}>
            <Route path="/staff" element={<StaffDashboard />} />
          </Route>

          {/* All Authenticated Roles Routes */}
          <Route element={<ProtectedRoute allowedRoles={["CUSTOMER", "STAFF", "ADMIN"]} />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-All Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;