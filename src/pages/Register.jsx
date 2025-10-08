import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utilities/api";
import getCsrfToken from "../utilities/csrf";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const csrfToken = await getCsrfToken();
      await api.post("/auth/register", { ...form, csrfToken });

      setSuccess("You are registered! Redirecting to Login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Username or email already in exists";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  //Check if avatar URL is valid
  const validAvatar = form.avatar && /^hhtps?:\/\/.+/i.test(form.avatar);

  return (
    <div className="center-page">
      <form className="formCard" onSubmit={onSubmit}>
        <h1>Register</h1>

        {validAvatar && (
          <img
            src={form.avatar}
            alt="avatar preview"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              marginTop: 8,
              objectFit: "cover",
            }}
          />
        )}

        <input
          placeholder="avatar URL (optional)"
          name="avatar"
          type="url"
          value={form.avatar}
          onChange={onChange}
          autoComplete="off"
        />
        <input
          placeholder="username"
          name="username"
          type="text"
          value={form.username}
          onChange={onChange}
          required
          autoComplete="username"
        />
        <input
          placeholder="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          autoComplete="email"
        />
        <input
          placeholder="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
          type="password"
          autoComplete="new-password"
        />

        <button disabled={loading} type="submit">
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <p>
          Already a user? <Link to="/login">Login here!</Link>
        </p>
      </form>
    </div>
  );
}
