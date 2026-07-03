import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (user.role === "STAFF") {
        navigate("/staff", { replace: true });
      } else {
        navigate("/customer", { replace: true });
      }
    } catch (e) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="inline-flex p-4 bg-rose-50 rounded-2xl text-rose-600 mb-6">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Access Denied
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          You do not have permission to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <button
          onClick={handleGoHome}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
