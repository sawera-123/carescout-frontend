import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SERVICES = ["Babysitting", "Newborn Care", "Elderly Care", "Special Needs Care", "Tutoring", "Housekeeping"];
const LANGUAGES = ["Urdu", "English", "Punjabi", "Sindhi", "Pashto"];
const CITIES = ["Lahore", "Islamabad", "Karachi", "Rawalpindi", "Faisalabad"];

const BACKGROUNDS = [
  { id: "fresher", icon: "🌱", title: "Fresher", text: "New to caregiving, no formal training" },
  { id: "experienced", icon: "💼", title: "Experienced", text: "I have worked as a caretaker before" },
  { id: "trained", icon: "🎓", title: "Trained / Certified", text: "I have a caregiving course or certificate" },
];

const emptyCert = () => ({ title: "", issuingOrganization: "", file: null });
const Req = () => <span className="text-danger">*</span>;

export default function CaretakerForm() {
  const loc = useLocation();
  const { user } = useAuth() || {};
  const prefill = loc.state || {};
  const [first, ...rest] = (prefill.fullName || user?.fullName || "").split(" ");

  const [formData, setFormData] = useState({
    caretakerType: "individual", instituteName: "",
    firstName: first || "", lastName: rest.join(" "), gender: "", dateOfBirth: "", cnic: "", city: "", address: "",
    background: "fresher", experienceYears: prefill.experienceYears || "",
    availabilityType: "full-time", rateAmount: "", rateFrequency: "hourly", bio: "",
  });
  const [services, setServices] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [certs, setCerts] = useState([emptyCert()]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const errRef = useRef(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => { if (error && errRef.current) errRef.current.scrollIntoView({ behavior: "smooth", block: "center" }); }, [error]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [submitted]);

  // The form is only for caretakers who just registered (or a logged-in caretaker)
  const allowed = loc.state?.fromRegister || user?.role === "caretaker";
  if (!allowed) return <Navigate to="/register?role=caretaker" replace />;

  const needsDocs = formData.background !== "fresher";
  const set = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggle = (v, list, setList) => setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const setCnic = (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 13);
    const out = d.length > 12 ? `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}` : d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    setFormData((p) => ({ ...p, cnic: out }));
  };

  const pickPhoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return setError("Profile photo must be under 2MB.");
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(f); setPreview(URL.createObjectURL(f));
  };

  const setCert = (i, field, value) => setCerts((c) => c.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)));
  const pickCertFile = (i, f) => {
    if (f && f.size > 5 * 1024 * 1024) return setError("Each document must be under 5MB.");
    setError(""); setCert(i, "file", f);
  };

  const validate = () => {
    const f = formData;
    if (f.caretakerType === "institute" && !f.instituteName.trim()) return "Please enter the institute name.";
    if (!f.firstName.trim() || !f.lastName.trim()) return "Please enter your first and last name.";
    if (!f.gender) return "Please select your gender.";
    if (!f.dateOfBirth) return "Please enter your date of birth.";
    if (!/^\d{5}-\d{7}-\d{1}$/.test(f.cnic)) return "CNIC must be in the format XXXXX-XXXXXXX-X.";
    if (!f.city) return "Please select your city.";
    if (needsDocs && f.experienceYears === "") return "Please enter your years of experience.";
    if (services.length === 0) return "Please select at least one service.";
    if (languages.length === 0) return "Please select at least one language.";
    if (!f.rateAmount) return "Please enter your expected rate.";
    if (needsDocs && certs.some((c) => !c.title.trim() || !c.issuingOrganization.trim() || !c.file))
      return "Please fill the title, issuer and upload a file for every document.";
    return "";
  };

  const submit = (e) => {
    e.preventDefault();
    const m = validate();
    setError(m);
    if (m) return;
    // TODO: send as FormData to the backend later
    console.log("Caretaker application:", {
      ...formData,
      experienceYears: needsDocs ? formData.experienceYears : "0",
      services, languages, photo,
      certificates: needsDocs ? certs : [],
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="ct-page">
        <style>{CSS}</style>
        <div className="ct-hero"><h1>Application submitted</h1><p>Thank you, {formData.firstName}!</p></div>
        <div className="ct-wrap">
          <div className="ct-card text-center">
            <div style={{ fontSize: "3rem" }}>🎉</div>
            <h3 className="fw-bold">We have received your application</h3>
            <p className="text-muted">Our team will review your profile and contact you within 48 hours.</p>
            <Link to="/login" className="ct-btn me-2">Log in</Link>
            <Link to="/" className="ct-btn-outline">Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page">
      <style>{CSS}</style>

      <div className="ct-hero">
        <span className="ct-badge">✓ Account created</span>
        <h1>Complete your caretaker profile</h1>
        <p>{first ? `Welcome, ${first}! ` : ""}Parents and daycares will see this profile, so tell them who you are.</p>
      </div>

      <form className="ct-wrap" onSubmit={submit} noValidate>

        {/* 1 */}
        <section className="ct-card">
          <h4><span className="ct-ico">🧭</span>How do you work?</h4>
          <div className="row g-3">
            {[["individual", "🙋", "Independent caretaker", "I work on my own with families."],
              ["institute", "🏢", "Through an institute", "I am provided by a school, daycare or agency."]].map(([v, ico, t, d]) => (
              <div className="col-md-6" key={v}>
                <div className={"ct-choice" + (formData.caretakerType === v ? " on" : "")} role="button" tabIndex={0}
                  onClick={() => setFormData((p) => ({ ...p, caretakerType: v }))}
                  onKeyDown={(e) => e.key === "Enter" && setFormData((p) => ({ ...p, caretakerType: v }))}>
                  <div className="fs-2">{ico}</div><h6 className="mb-1">{t}</h6><small className="text-muted">{d}</small>
                </div>
              </div>
            ))}
          </div>
          {formData.caretakerType === "institute" && (
            <div className="mt-3">
              <label className="form-label">Institute name <Req /></label>
              <input className="form-control" name="instituteName" value={formData.instituteName} onChange={set} placeholder="e.g. Bright Minds Daycare" />
            </div>
          )}
        </section>

        {/* 2 */}
        <section className="ct-card">
          <h4><span className="ct-ico">👤</span>Personal details</h4>
          <div className="d-flex align-items-center gap-3 mb-4">
            {preview ? <img src={preview} alt="Preview" className="ct-avatar" /> : <div className="ct-avatar ct-avatar-empty">👤</div>}
            <div>
              <label className="ct-btn-outline" style={{ cursor: "pointer" }}>
                {preview ? "Change photo" : "Upload photo"}
                <input type="file" accept="image/*" hidden onChange={pickPhoto} />
              </label>
              {preview && <button type="button" className="btn btn-link text-danger" onClick={() => { setPhoto(null); setPreview(null); }}>Remove</button>}
              <div className="form-text">JPG or PNG, up to 2MB</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3"><label className="form-label">First name <Req /></label><input className="form-control" name="firstName" value={formData.firstName} onChange={set} placeholder="e.g. Sara" /></div>
            <div className="col-md-6 mb-3"><label className="form-label">Last name <Req /></label><input className="form-control" name="lastName" value={formData.lastName} onChange={set} placeholder="e.g. Ahmed" /></div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3"><label className="form-label">Gender <Req /></label>
              <select className="form-select" name="gender" value={formData.gender} onChange={set}>
                <option value="">Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
              </select></div>
            <div className="col-md-4 mb-3"><label className="form-label">Date of birth <Req /></label>
              <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={set} max={new Date().toISOString().split("T")[0]} /></div>
            <div className="col-md-4 mb-3"><label className="form-label">CNIC <Req /></label>
              <input className="form-control" value={formData.cnic} onChange={setCnic} placeholder="XXXXX-XXXXXXX-X" inputMode="numeric" /></div>
          </div>
          <div className="row">
            <div className="col-md-5 mb-1"><label className="form-label">City <Req /></label>
              <select className="form-select" name="city" value={formData.city} onChange={set}>
                <option value="">Select city</option>{CITIES.map((c) => <option key={c}>{c}</option>)}
              </select></div>
            <div className="col-md-7 mb-1"><label className="form-label">Address</label>
              <input className="form-control" name="address" value={formData.address} onChange={set} placeholder="Street, area" /></div>
          </div>
        </section>

        {/* 3 */}
        <section className="ct-card">
          <h4><span className="ct-ico">⭐</span>Your experience and services</h4>

          <label className="form-label d-block">Your background <Req /></label>
          <div className="row g-3 mb-3">
            {BACKGROUNDS.map((b) => (
              <div className="col-md-4" key={b.id}>
                <div className={"ct-choice" + (formData.background === b.id ? " on" : "")} role="button" tabIndex={0}
                  onClick={() => setFormData((p) => ({ ...p, background: b.id }))}
                  onKeyDown={(e) => e.key === "Enter" && setFormData((p) => ({ ...p, background: b.id }))}>
                  <div className="fs-3">{b.icon}</div><h6 className="mb-1">{b.title}</h6><small className="text-muted">{b.text}</small>
                </div>
              </div>
            ))}
          </div>

          {needsDocs && (
            <div className="mb-3">
              <label className="form-label">Years of experience <Req /></label>
              <input type="number" min="0" max="50" className="form-control" style={{ maxWidth: 200 }} name="experienceYears" value={formData.experienceYears} onChange={set} placeholder="e.g. 3" />
            </div>
          )}

          <div className="mb-3"><label className="form-label d-block">Services offered <Req /></label>
            {SERVICES.map((s) => <button type="button" key={s} className={"ct-pick" + (services.includes(s) ? " on" : "")} onClick={() => toggle(s, services, setServices)}>{s}</button>)}</div>

          <div className="mb-3"><label className="form-label d-block">Languages spoken <Req /></label>
            {LANGUAGES.map((l) => <button type="button" key={l} className={"ct-pick" + (languages.includes(l) ? " on" : "")} onClick={() => toggle(l, languages, setLanguages)}>{l}</button>)}</div>

          <div className="row">
            <div className="col-md-4 mb-3"><label className="form-label">Availability</label>
              <select className="form-select" name="availabilityType" value={formData.availabilityType} onChange={set}>
                <option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="hourly">Hourly</option>
              </select></div>
            <div className="col-md-4 mb-3"><label className="form-label">Expected rate (PKR) <Req /></label>
              <input type="number" min="0" className="form-control" name="rateAmount" value={formData.rateAmount} onChange={set} placeholder="e.g. 500" /></div>
            <div className="col-md-4 mb-3"><label className="form-label">Rate per</label>
              <select className="form-select" name="rateFrequency" value={formData.rateFrequency} onChange={set}>
                <option value="hourly">Hour</option><option value="daily">Day</option><option value="monthly">Month</option>
              </select></div>
          </div>

          <label className="form-label">Short bio <span className="text-muted small">({formData.bio.length}/600)</span></label>
          <textarea className="form-control" rows="4" name="bio" maxLength="600" value={formData.bio} onChange={set} placeholder="Tell parents about yourself and your caregiving style..." />
        </section>

        {/* 4: only for Experienced / Trained */}
        {needsDocs && (
          <section className="ct-card">
            <h4><span className="ct-ico">📄</span>{formData.background === "trained" ? "Your certificates" : "Proof of experience"}</h4>
            <p className="text-muted">
              {formData.background === "trained"
                ? "Upload your training or course certificates so parents can trust your profile."
                : "Upload an experience letter or any certificate from a previous employer."}
            </p>
            {certs.map((c, i) => (
              <div className="ct-doc" key={i}>
                <div className="d-flex justify-content-between mb-2">
                  <strong>Document {i + 1}</strong>
                  {certs.length > 1 && <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setCerts(certs.filter((_, x) => x !== i))}>Remove</button>}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-2"><label className="form-label">Title <Req /></label>
                    <input className="form-control" value={c.title} onChange={(e) => setCert(i, "title", e.target.value)}
                      placeholder={formData.background === "trained" ? "e.g. Child First Aid Certificate" : "e.g. Experience Letter"} /></div>
                  <div className="col-md-6 mb-2"><label className="form-label">Issued by <Req /></label>
                    <input className="form-control" value={c.issuingOrganization} onChange={(e) => setCert(i, "issuingOrganization", e.target.value)} placeholder="e.g. Red Crescent / Previous employer" /></div>
                </div>
                <label className="form-label">Upload file (PDF or image) <Req /></label>
                <input type="file" accept=".pdf,image/*" className="form-control" onChange={(e) => pickCertFile(i, e.target.files[0])} />
                {c.file && <div className="form-text text-success">✓ {c.file.name}</div>}
              </div>
            ))}
            <button type="button" className="ct-btn-outline" onClick={() => setCerts([...certs, emptyCert()])}>+ Add another document</button>
            <div className="form-text mt-2">PDF or image, up to 5MB each</div>
          </section>
        )}

        <div ref={errRef}>{error && <div className="alert alert-danger">⚠️ {error}</div>}</div>
        <button type="submit" className="ct-btn w-100 py-3" style={{ fontSize: "1.05rem" }}>Submit application</button>
        <p className="text-center text-muted small mt-3">Our team reviews every application within 48 hours.</p>
      </form>
    </div>
  );
}

const CSS = `
.ct-page{--ink:#10263a;--teal:#0f766e;--teal-d:#0a5a54;--mint:#e6f4f1;--sun:#ffb84d;--line:#dbe6e3;--muted:#5d7080;
  min-height:100vh;color:var(--ink);padding-bottom:3rem;
  background:radial-gradient(circle at 92% 38%,rgba(255,184,77,.20),transparent 28%),radial-gradient(circle at 4% 75%,rgba(15,118,110,.14),transparent 30%),#f3f9f8;}
.ct-hero{position:relative;overflow:hidden;color:#fff;text-align:center;padding:3.5rem 1rem 7.5rem;
  background:radial-gradient(circle at 85% 15%,rgba(255,184,77,.45),transparent 32%),radial-gradient(circle at 8% 95%,rgba(239,111,94,.35),transparent 30%),
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Ccircle cx='3' cy='3' r='2' fill='%23ffffff' fill-opacity='.10'/%3E%3C/svg%3E"),
  linear-gradient(160deg,#0a5a54 0%,#10263a 100%);}
.ct-hero::after{content:"";position:absolute;right:-110px;bottom:-130px;width:360px;height:360px;border-radius:50%;border:2px solid rgba(255,255,255,.18);box-shadow:0 0 0 40px rgba(255,255,255,.05);}
.ct-hero h1{font-size:clamp(1.9rem,4vw,2.8rem);font-weight:800;position:relative;z-index:1;margin:.8rem 0 .5rem;}
.ct-hero p{color:#dbe8ef;max-width:52ch;margin:0 auto;position:relative;z-index:1;}
.ct-badge{display:inline-block;background:var(--sun);color:var(--ink);border-radius:999px;font-weight:800;font-size:.8rem;padding:.25rem .8rem;position:relative;z-index:1;}
.ct-wrap{max-width:820px;margin:-4.8rem auto 0;padding:0 1rem;position:relative;z-index:2;}
.ct-card{background:#fff;border-radius:24px;border:1px solid var(--line);box-shadow:0 24px 50px -30px rgba(16,38,58,.45);padding:1.8rem;margin-bottom:1.4rem;}
.ct-card h4{display:flex;align-items:center;gap:.7rem;font-weight:800;margin-bottom:1.2rem;}
.ct-ico{width:38px;height:38px;border-radius:12px;background:var(--mint);display:grid;place-items:center;font-size:1.2rem;}
.ct-page .form-control,.ct-page .form-select{border:1.5px solid var(--line);border-radius:12px;padding:.7rem 1rem;background:#fff;}
.ct-page .form-control:focus,.ct-page .form-select:focus{border-color:var(--teal);box-shadow:0 0 0 .22rem rgba(15,118,110,.15);}
.ct-choice{border:2px solid var(--line);border-radius:18px;padding:1.1rem;cursor:pointer;height:100%;background:#fff;transition:border-color .15s;}
.ct-choice:hover{border-color:var(--teal);}
.ct-choice.on{border-color:var(--teal);background:var(--mint);}
.ct-pick{border:1.5px solid var(--line);background:#fff;border-radius:999px;padding:.4rem 1rem;font-weight:700;font-size:.9rem;margin:0 .4rem .5rem 0;color:var(--ink);}
.ct-pick.on{background:var(--teal);border-color:var(--teal);color:#fff;}
.ct-avatar{width:96px;height:96px;border-radius:50%;object-fit:cover;border:4px solid var(--mint);}
.ct-avatar-empty{display:grid;place-items:center;background:var(--mint);font-size:2rem;}
.ct-doc{border:1.5px dashed #b9cfca;border-radius:16px;padding:1rem;margin-bottom:1rem;background:#f7fbfa;}
.ct-btn{background:var(--teal);color:#fff;border:0;border-radius:999px;padding:.6rem 1.4rem;font-weight:700;text-decoration:none;display:inline-block;}
.ct-btn:hover{background:var(--teal-d);color:#fff;}
.ct-btn-outline{background:#fff;color:var(--teal-d);border:2px solid var(--teal);border-radius:999px;padding:.5rem 1.2rem;font-weight:700;text-decoration:none;display:inline-block;}
.ct-btn-outline:hover{background:var(--mint);color:var(--teal-d);}
`;
