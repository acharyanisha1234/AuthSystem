import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authService";
import { useToast } from "../context/ToastContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({ password: "" });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    fullName: "",          //  Added fullName
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        const role = user.role?.toUpperCase() || "";
        if (role === "ADMIN") navigate("/admin", { replace: true });
        else if (role === "STAFF") navigate("/staff", { replace: true });
        else if (role === "CUSTOMER") navigate("/customer", { replace: true });
      } catch (e) {
        console.error("Auto-redirect error", e);
      }
    }
  }, [navigate]);

  // Login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loginData.password.length < 6) {
      setLoginErrors({ password: "Password must be at least 6 characters." });
      return;
    }
    setLoginErrors({ password: "" });

    try {
      const response = await API.post("/api/auth/login", loginData);
      const { accessToken, user } = response.data;

      if (accessToken && user) {
        // Normalize role: uppercase and map "USER" → "CUSTOMER"
        let role = user.role ? user.role.toUpperCase() : "CUSTOMER";
        if (role === "USER") role = "CUSTOMER";

        const normalizedUser = {
          ...user,
          role: role,
        };

        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        showToast("Login Successful", "success");

        if (role === "ADMIN") navigate("/admin", { replace: true });
        else if (role === "STAFF") navigate("/staff", { replace: true });
        else navigate("/customer", { replace: true });
      } else {
        showToast("Login failed – invalid response", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      let serverMessage = "Login failed. Please try again.";
      if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        serverMessage = "Cannot connect to server. Is your backend running?";
      } else if (error.response) {
        serverMessage = error.response.data?.message || "Login failed.";
      } else {
        serverMessage = error.message || "Login failed.";
      }
      showToast(serverMessage, "error");
    }
  };

  // Register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerData.username.trim()) {
      setRegisterErrors((prev) => ({ ...prev, username: "Username is required." }));
      return;
    }
    setRegisterErrors((prev) => ({ ...prev, username: "" }));

    if (!registerData.fullName.trim()) {
      setRegisterErrors((prev) => ({ ...prev, fullName: "Full name is required." }));
      return;
    }
    setRegisterErrors((prev) => ({ ...prev, fullName: "" }));

    if (registerData.password.length < 6) {
      setRegisterErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters." }));
      return;
    }
    setRegisterErrors((prev) => ({ ...prev, password: "" }));

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      return;
    }
    setRegisterErrors((prev) => ({ ...prev, confirmPassword: "" }));

    try {
      const payload = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName,   //  Send fullName
      };
      const response = await API.post("/api/auth/register", payload);
      if (response.data.user) {
        showToast(response.data.message || "Registration successful!", "success");
        setIsLogin(true);
        setRegisterData({
          username: "",
          email: "",
          fullName: "",
          password: "",
          confirmPassword: "",
        });
        setRegisterErrors({ username: "", fullName: "", password: "", confirmPassword: "" });
      } else {
        showToast(response.data.message || "Registration Failed.", "error");
      }
    } catch (error) {
      console.error("Register error:", error);
      let serverMessage = "Registration failed. Please try again.";
      if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        serverMessage = "Cannot connect to server. Is your backend running?";
      } else if (error.response) {
        serverMessage = error.response.data?.message || "Registration failed.";
      } else {
        serverMessage = error.message || "Registration failed.";
      }
      showToast(serverMessage, "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {isLogin ? "Login to continue" : "Register as a customer"}
        </p>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              {loginErrors.password && <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                required
              />
              {registerErrors.fullName && <p className="text-red-500 text-sm mt-1">{registerErrors.fullName}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
              />
              {registerErrors.username && <p className="text-red-500 text-sm mt-1">{registerErrors.username}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
              {registerErrors.password && <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
              />
              {registerErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{registerErrors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Create Account
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold cursor-pointer"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-semibold cursor-pointer"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;