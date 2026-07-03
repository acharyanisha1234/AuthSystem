import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error("Error parsing user", e);
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Normalize user role to uppercase
  const userRole = user.role ? user.role.toUpperCase() : null;

  // If no allowedRoles specified, just require authentication
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Normalize allowed roles to uppercase
  const upperAllowed = allowedRoles.map((r) => r.toUpperCase());

  if (!upperAllowed.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};