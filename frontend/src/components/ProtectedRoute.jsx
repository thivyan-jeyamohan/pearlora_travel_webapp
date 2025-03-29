import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../User/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: isAuthenticated =", isAuthenticated);
  console.log("ProtectedRoute: User =", user);

  if (!isAuthenticated) {
    return <Navigate to="/user-login" state={{ from: location }} replace />;
  }

  return children;
}
