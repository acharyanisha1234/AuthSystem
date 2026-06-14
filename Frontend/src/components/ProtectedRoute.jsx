import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to={`/${auth.role}`} replace />;
  }
  return children;
};

export default ProtectedRoute;