import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="cs-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <Logo light />
            <p className="mt-3" style={{ maxWidth: "36ch" }}>Discover, verify and compare schools and daycares. Free for every parent.</p>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-white">Explore</h6>
            <Link to="/explore?type=school">Schools</Link>
            <Link to="/explore?type=daycare">Daycares</Link>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="text-white">Join CareScout</h6>
            <Link to="/register">Create an account</Link>
            <Link to="/register?role=caretaker">Become a caretaker</Link>
            <Link to="/login">Log in</Link>
          </div>
        </div>
        <hr style={{ borderColor: "#24476f" }} />
        <small>© {new Date().getFullYear()} CareScout. Final Year Project.</small>
      </div>
    </footer>
  );
}
