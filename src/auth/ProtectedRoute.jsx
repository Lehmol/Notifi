import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export function RequireAuth() {
  const { auth } = useAuth();
  return auth ? <Outlet /> : <Navigate to="login" replace />;
}

export function RedirectIfAuth() {
  const { auth } = useAuth();
  return auth ? <Navigate to="chat" replace /> : <Outlet />;
}
