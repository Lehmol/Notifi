import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api, { setAuthToken } from "../utilities/api";
import getCsrfToken from "../utilities/csrf";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      //1) CSRF
      const csrfToken = await getCsrfToken();

      //2) payload
      const id = form.identity.trim();
      const payload = id.includes("@")
        ? { email: id, password: form.password, csrfToken }
        : { username: id, password: form.password, csrfToken };

      //3) POST /auth/token
      const { data } = await api.post("/auth/token", payload);

      const token = data.token;
      if (!token) throw new Error("No token");

      //4) Decoda token
      let decoded = {};
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("Not able to decode token:", decoded);
      }
      //Extract userinfo
      const user = data?.user ?? {};
      const idClaim = user.id;
      const nameClaim = user.user;
      const avatarClaim = user.avatar;

      //5) Update auth-context and redirect
      login(token, { id: idClaim, username: nameClaim, avatar: avatarClaim });
      setAuthToken(token);
      setSuccess("You are logged in");
      setTimeout(() => {
        navigate("/chat", { replace: true });
      }, 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 403 ? "Missing CSRF-token" : "") ||
        (err?.response?.status === 400
          ? "Bad request - Missing username or password"
          : "") ||
        "Login failed";
      setError(msg);
      console.debug("LOGIN ERROR", err?.response?.status, err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <form className="formCard" onSubmit={onSubmit}>
        <h1>Login</h1>
        <input
          placeholder="username or email"
          name="identity"
          value={form.identity}
          onChange={onChange}
          required
          autoComplete="off"
        />
        <input
          placeholder="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          autoComplete="off"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <p>
          Not a user?<Link to="/register">Register here!</Link>
        </p>
      </form>
    </div>
  );
}
