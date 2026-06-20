import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          {auth?.accessToken && (
            <>
              {auth.role === "admin" && <Link to="/admin">Admin Panel</Link>}
              {auth.role === "staff" && <Link to="/staff">Staff Panel</Link>}
              {auth.role === "user" && <Link to="/user">Dashboard</Link>}
            </>
          )}
        </div>
        <div className="flex gap-4">
          {/* Always show Logout button – no Login/Register */}
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;