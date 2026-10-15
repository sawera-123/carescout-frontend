import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AuthShell from "../components/AuthShell";

// Backend ready hone par isay true kar dein
const USE_BACKEND = false;

const roles = [
  { id: "parent", icon: "👪", title: "Parent", hint: "Find and save schools and daycares" },
  { id: "caretaker", icon: "🤝", title: "Caretaker", hint: "Apply for care jobs" },
  { id: "institute", icon: "🏫", title: "Institute", hint: "List your school or daycare" },
];

const benefits = {
  parent: ["Save your shortlist of schools and daycares", "Compare fees, ratings and facilities", "Contact institutes directly"],
  caretaker: ["Create your caretaker profile", "Get seen by parents and daycares near you", "Next: add your experience and certificates"],
  institute: ["Get a verified CareScout listing", "Reach parents searching in your area", "Manage enquiries from one dashboard"],
};

function strength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-4
}

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const startRole = ["parent", "caretaker", "institute"].includes(params.get("role")) ? params.get("role") : "parent";

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
    role: startRole, instituteName: "", instituteType: "school",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const setRole = (role) => setFormData((p) => ({ ...p, role }));
  const isCaretaker = formData.role === "caretaker";
  const st = strength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (formData.password !== formData.confirmPassword) return setError("Password and Confirm Password do not match.");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters.");
    if (formData.role === "institute" && !formData.instituteName.trim()) return setError("Please enter your institute name.");

    try {
      setLoading(true);

      let message = "Registration successful! Redirecting to login...";
      if (USE_BACKEND) {
        const res = await axiosClient.post("/auth/register", formData);
        message = res.data?.message || message;
      }

      if (isCaretaker) {
        // Caretaker goes straight to the application form (details carried over)
        setSuccess("Account created! Taking you to your caretaker application...");
        setTimeout(() => navigate("/caretaker-form", {
          state: {
            fromRegister: true,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
        }), 1000);
      } else {
        setSuccess(message);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell width={600}>
      <h3 className="fw-bold text-center mb-1">{isCaretaker ? "Become a caretaker" : "Create your account"}</h3>
      <p className="text-muted text-center mb-3">
        {isCaretaker ? "Join CareScout and get discovered by parents and daycares." : "I am registering as"}
      </p>

      {isCaretaker && (
        <div className="cs-journey">
          <span><b>1</b>Create account</span><i>→</i>
          <span><b>2</b>Complete your profile</span><i>→</i>
          <span><b>3</b>Get discovered</span>
        </div>
      )}

      <div className="cs-rolecards">
        {roles.map((r) => (
          <button type="button" key={r.id} className={"cs-rolecard" + (formData.role === r.id ? " on" : "")} onClick={() => setRole(r.id)}>
            <span className="ico">{r.icon}</span><b>{r.title}</b><small>{r.hint}</small>
          </button>
        ))}
      </div>

      <div className="cs-benefit">
        <b>What you get</b>
        <ul>{benefits[formData.role].map((b) => <li key={b}>{b}</li>)}</ul>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Ayesha Khan" required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Phone number</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XXXXXXXXX" pattern="03\d{9}" title="Format: 03XXXXXXXXX" required />
          </div>
        </div>

        {formData.role === "institute" && (
          <>
            <div className="mb-3">
              <label className="form-label">Institute name</label>
              <input type="text" className="form-control" name="instituteName" value={formData.instituteName} onChange={handleChange} placeholder="e.g. Bright Minds Montessori" required />
            </div>
            <div className="mb-3">
              <label className="form-label d-block">Institute type</label>
              {[["school", "School"], ["daycare", "Daycare"]].map(([v, l]) => (
                <button type="button" key={v} className={"cs-pick" + (formData.instituteType === v ? " on" : "")}
                  onClick={() => setFormData((p) => ({ ...p, instituteType: v }))}>{l}</button>
              ))}
            </div>
          </>
        )}

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Password</label>
            <div className="cs-pw">
              <input type={showPw ? "text" : "password"} className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" required />
              <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? "Hide" : "Show"}</button>
            </div>
            <div className="cs-meter"><i style={{ width: `${st * 25}%`, background: ["#ddd", "#eb4944", "#f6a929", "#4fb286", "#0d4f8b"][st] }} /></div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Confirm password</label>
            <input type={showPw ? "text" : "password"} className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
          </div>
        </div>

        <button type="submit" className="btn-cs w-100 py-2 mt-2" disabled={loading}>
          {loading ? "Creating account..." : isCaretaker ? "Create account and continue" : "Create account"}
        </button>
      </form>

      <p className="text-center mt-3 mb-0">Already have an account? <Link to="/login" className="fw-bold">Log in</Link></p>
    </AuthShell>
  );
}
