import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { auth } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
  <div className="container mx-auto flex justify-between items-center">

    <div className="flex gap-4">
      <Link to="/">Home</Link>

      {auth?.accessToken && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
        </>
      )}
    </div>

    <div className="flex gap-4">
      {auth?.accessToken ? (
        <button>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>

  </div>
</nav>
  );
};

export default Navbar;