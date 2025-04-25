import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AuthGuard;
