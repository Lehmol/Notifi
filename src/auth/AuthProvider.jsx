import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext.jsx";
import { setAuthToken } from "../utilities/api.js";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
      setAuthToken(auth.token);
    } else {
      localStorage.removeItem("auth");
      setAuthToken(null);
    }
  }, [auth]);

  const login = (token, extra = {}) => {
    let decoded = {};
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }

    const username = decoded.username ?? extra.username ?? decoded.user ?? null;

    const payload = {
      token,
      id: decoded.id ?? null,
      user: username,
      avatar: decoded.avatar ?? null,
    };

    setAuth(payload);
  };

  const logout = () => setAuth(null);

  const value = useMemo(() => ({ auth, login, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
