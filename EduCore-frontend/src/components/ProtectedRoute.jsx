import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles
}) {

  const role = localStorage.getItem("role");

  // NOT LOGGED IN
  if (!role) {
    return <Navigate to="/login" />;
  }

  // ROLE NOT ALLOWED
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}