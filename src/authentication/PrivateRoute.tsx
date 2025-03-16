import { FC, JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white">Loading user info...</div>;
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return children;
};

export default PrivateRoute;
