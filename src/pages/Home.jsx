import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InstituteCard from "../components/InstituteCard";
import { institutes, cities } from "../data/institutes";

export default function Home() {
  const navigate = useNavigate();
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const search = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (type !== "all") p.set("type", type);
    if (city) p.set("city", city);
    navigate(`/explore?${p.toString()}`);
  };

  const top = [...institutes].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <>
      <section className="cs-hero">
        <div className="cs-blob" />
        <div className="container position-relative">
          <h1>Find a school or daycare you can trust.</h1>
          <p className="lead mt-3">Search, filter and compare schools and daycares near you. No account needed, always free.</p>

          <form className="cs-search" onSubmit={search}>
            <div className="cs-seg">
              {[["all", "All"], ["school", "Schools"], ["daycare", "Daycares"]].map(([v, l]) => (
                <button type="button" key={v} className={type === v ? "on" : ""} onClick={() => setType(v)}>{l}</button>
              ))}
            </div>
            <div className="row g-2">
              <div className="col-md-5">
                <input className="form-control" placeholder="Name or area, e.g. Johar Town" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="col-md-4">
                <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">All cities</option>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-3 d-grid">
                <button className="btn-cs py-2" type="submit">Search</button>
              </div>
            </div>
          </form>

          <div className="d-flex gap-5 mt-4 flex-wrap">
            <div><div className="cs-stat">{institutes.length}+</div><small className="text-muted">Listings</small></div>
            <div><div className="cs-stat">{cities.length}</div><small className="text-muted">Cities</small></div>
            <div><div className="cs-stat">Free</div><small className="text-muted">Compare up to 3</small></div>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="container">
          <h2 className="mb-4">What are you looking for?</h2>
          <div className="row g-3">
            <div className="col-md-4"><Link className="cs-cat" to="/explore?type=school"><div className="ico">🏫</div><h4>Schools</h4><p className="text-muted mb-0">Montessori, Cambridge, Matric and more.</p></Link></div>
            <div className="col-md-4"><Link className="cs-cat" to="/explore?type=daycare"><div className="ico">🧸</div><h4>Daycares</h4><p className="text-muted mb-0">Safe, supervised care from 6 months old.</p></Link></div>
            <div className="col-md-4"><Link className="cs-cat" to="/register?role=caretaker"><div className="ico">🤝</div><h4>Caretakers</h4><p className="text-muted mb-0">Offer your care services to parents.</p></Link></div>
          </div>
        </div>
      </section>

      <section className="cs-section pt-0">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h2 className="mb-0">Top rated this month</h2>
            <Link to="/explore" className="fw-bold text-decoration-none">See all</Link>
          </div>
          <div className="row g-3">
            {top.map((i) => (
              <div className="col-md-4" key={i.id}>
                <InstituteCard item={i} selected={false} compareDisabled onToggleCompare={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-section pt-0">
        <div className="container">
          <h2 className="mb-4">How CareScout works</h2>
          <div className="row g-4">
            <div className="col-md-4 cs-step"><h5>Search</h5><p className="text-muted">Type a name, area or city and pick school or daycare.</p></div>
            <div className="col-md-4 cs-step"><h5>Compare</h5><p className="text-muted">Tick up to three listings and see fees, ratings and facilities side by side.</p></div>
            <div className="col-md-4 cs-step"><h5>Decide</h5><p className="text-muted">Create a free account to save your shortlist and contact institutes.</p></div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="cs-cta text-center">
          <h2 className="text-white">Run a school or daycare?</h2>
          <p className="mb-4" style={{ color: "#c6d3dd" }}>List your institute and reach parents looking in your area.</p>
          <Link to="/register" className="btn-cs" style={{ background: "var(--sun)", color: "var(--ink)" }}>Register your institute</Link>
        </div>
      </section>
    </>
  );
}
