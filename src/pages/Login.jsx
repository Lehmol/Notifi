import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <form className="formCard">
        <h1>Login</h1>
        <input
          placeholder="username or email"
          name="identity"
          required
          autoComplete="off"
        />
        <input
          placeholder="password"
          name="password"
          required
          autoComplete="off"
        />
        <button type="submit">Login</button>
        <p>
          Not a user?<Link to="/register">Register here!</Link>
        </p>
      </form>
    </div>
  );
}
