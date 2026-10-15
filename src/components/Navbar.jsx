import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth() || {};
  const cls = ({ isActive }) => "cs-link" + (isActive ? " active" : "");
  const close = () => setOpen(false);

  return (
    <header className="cs-nav">
      <div className="container cs-nav-inner">
        <Logo onClick={close} />

        <button className="cs-toggle" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>

        <nav className={"cs-links" + (open ? " open" : "")}>
          <NavLink to="/" end className={cls} onClick={close}>Home</NavLink>
          <NavLink to="/explore" className={cls} onClick={close}>Search and compare</NavLink>
          <NavLink to="/register?role=caretaker" className={cls} onClick={close}>Become a Caretaker</NavLink>

          {user ? (
            <button className="btn-cs-outline ms-lg-2" onClick={logout}>Log out</button>
          ) : (
            <Link to="/login" className="btn-cs ms-lg-2" onClick={close}>Log in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
