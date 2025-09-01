import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  }, [auth]);

  const login = (token, extra = {}) => {
    let decoded = {};
    try {
      decoded = jwtDecode(token);
    } catch {}
    const username =
      extra.username ?? extra.user ?? decoded.username ?? decoded.user ?? null;

    const payload = {
      token,
      id: extra.id ?? decoded.id ?? null,
      username,
      user: username,
      avatar: extra.avatar ?? decoded.avatar ?? null,
    };
    setAuth(payload);
  };

  const logout = () => setAuth(null);

  const value = useMemo(() => ({ auth, login, logout }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
