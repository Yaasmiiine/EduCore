import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({
  children,
  allowedRoles
}) {

  const { role, isAuthenticated } = useAuth();

  // NOT LOGGED IN
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ROLE NOT ALLOWED
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}