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
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      setLoading(true);
      const csrfToken = await getCsrfToken();

      await api.post("/auth/register", { ...form, csrfToken });

      setOk("You are registered! Now you can login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Username or email already exists";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const validAvatar = form.avatar && /^https?:\/\/.+/i.test(form.avatar);

  return (
    <div className="center-page">
      <form className="formCard" onSubmit={submit}>
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
            }}
          />
        )}
        <input
          placeholder="avatar URL"
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
          autoComplete="off"
        />
        <input
          placeholder="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          autoComplete="off"
        />
        <input
          placeholder="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
          type="password"
          autoComplete="off"
        />
        <button disabled={loading} type="submit">
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p>{error}</p>}
        {ok && <p>{ok}</p>}
        <p>
          Already a user?<Link to="/"> Login here!</Link>
        </p>
      </form>
    </div>
  );
}
