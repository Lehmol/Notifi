import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";

import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";

function RequireAuth() {
  const { auth } = useAuth();
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
}

function RedirectIfAuth() {
  const { auth } = useAuth();
  return auth ? <Navigate to="/chat" replace /> : <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<RedirectIfAuth />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
