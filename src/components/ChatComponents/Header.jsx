import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { IoMenuSharp } from "react-icons/io5";
import "../../index.css";

function Header() {
  const [open, setOpen] = useState(false);
  const { logout, auth } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <img src="/notifi.png" alt="logo" className="logo" />
        </div>
        <div className="nav-center">
          <h1>
            {auth?.avatar && (
              <img src={auth.avatar} alt={auth.user} className="nav-avatar" />
            )}
            <span> Welcome {auth.user}</span>
          </h1>
        </div>
        <div className="nav-right">
          <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
            <IoMenuSharp />
          </button>
          {open && (
            <div className="dropdown-menu">
              <button onClick={onLogout} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
