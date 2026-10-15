import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

const roles = [
  { id: "parent", label: "Parent", icon: "👪" },
  { id: "caretaker", label: "Caretaker", icon: "🤝" },
  { id: "school", label: "School", icon: "🏫" },
  { id: "daycare", label: "Daycare", icon: "🧸" },
  { id: "admin", label: "Admin", icon: "🛡️" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState("parent");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", formData);
      const { token, user } = res.data;
      login(token, user);
      const dest = { admin: "/admin-dashboard", institute: "/institute-dashboard", caretaker: "/caretaker-dashboard" };
      navigate(dest[user.role] || "/parent-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell width={470}>
      <h3 className="fw-bold text-center mb-1">Welcome back</h3>
      <p className="text-muted text-center mb-3">Choose how you use CareScout</p>

      <div className="cs-roles">
        {roles.map((r) => (
          <button type="button" key={r.id} className={"cs-role" + (role === r.id ? " on" : "")} onClick={() => setRole(r.id)}>
            <span>{r.icon}</span>{r.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
        </div>
        <button type="submit" className="btn-cs w-100 py-2" disabled={loading}>
          {loading ? "Logging in..." : `Log in as ${roles.find((r) => r.id === role).label}`}
        </button>
      </form>

      {role !== "admin" && (
        <p className="text-center mt-3 mb-0">
          New to CareScout? <Link to="/register" className="fw-bold">Create an account</Link>
        </p>
      )}
      <p className="text-center mt-2 mb-0"><Link to="/" className="small text-muted">Continue browsing without an account</Link></p>
    </AuthShell>
  );
}
