import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/problems" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;