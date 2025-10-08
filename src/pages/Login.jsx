import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utilities/api";
import getCsrfToken from "../utilities/csrf";
import { useAuth } from "../auth/AuthContext";

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
      //Get csrf token
      const csrfToken = await getCsrfToken();

      // Build payload based on input (email or username)
      const id = form.identity.trim();
      const payload = id.includes("@")
        ? { email: id, password: form.password, csrfToken }
        : { username: id, password: form.password, csrfToken };

      //Make login request
      const { data } = await api.post("/auth/token", payload);
      if (!data.token) {
        throw new Error("No token received");
      }

      //Extract user info from response
      const user = data?.user ?? {};

      // Use login function from AuthContext (handles token decoding and storage)
      login(data.token, {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      });
      setSuccess("You are logged in! Redirecting to Home...");
      setTimeout(() => {
        navigate("/chat", { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Response status:", err?.response?.status);
      console.error("Response data:", err?.response?.data);
      console.error("Error message:", err?.message);
      // Handle different error scenarios
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 403 ? "Missing CSRF token" : "") ||
        (err?.response?.status === 400
          ? "Bad request - Missing username or password"
          : "") ||
        "Login failed";
      setError(msg);
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
          value={form.identify}
          onChange={onChange}
          required
          autoComplete="username"
        />
        <input
          placeholder="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <p>
          Not a user? <Link to="/register">Register here!</Link>
        </p>
      </form>
    </div>
  );
}
