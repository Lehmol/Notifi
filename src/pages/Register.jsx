import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div>
      <form className="formCard">
        <h1>Register</h1>
        <input
          placeholder="username"
          name="username"
          type="text"
          required
          autoComplete="off"
        />
        <input
          placeholder="email"
          name="email"
          type="email"
          required
          autoComplete="off"
        />
        <input
          placeholder="password"
          name="password"
          required
          type="password"
          autoComplete="off"
        />
        <button type="submit">Register</button>
        <p>
          Not a user?<Link to="/">Register here!</Link>
        </p>
      </form>
    </div>
  );
}
