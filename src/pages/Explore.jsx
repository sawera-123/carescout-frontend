import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InstituteCard from "../components/InstituteCard";
import { institutes, cities } from "../data/institutes";

export default function Explore() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [type, setType] = useState(params.get("type") || "all");
  const [city, setCity] = useState(params.get("city") || "");
  const [maxFee, setMaxFee] = useState(30000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("rating");
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return institutes
      .filter((i) => (type === "all" || i.type === type)
        && (!city || i.city === city)
        && i.fee <= maxFee && i.rating >= minRating
        && (!s || `${i.name} ${i.area} ${i.city}`.toLowerCase().includes(s)))
      .sort((a, b) => sort === "rating" ? b.rating - a.rating : sort === "fee-low" ? a.fee - b.fee : b.fee - a.fee);
  }, [q, type, city, maxFee, minRating, sort]);

  const toggle = (id) => setCompare((c) => c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c);
  const picked = institutes.filter((i) => compare.includes(i.id));
  const reset = () => { setQ(""); setType("all"); setCity(""); setMaxFee(30000); setMinRating(0); };

  return (
    <div className="container py-4" style={{ paddingBottom: compare.length ? "6rem" : undefined }}>
      <h2 className="fw-bold mb-3">Explore schools and daycares</h2>
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="cs-filters">
            <label className="form-label fw-semibold">Search</label>
            <input className="form-control mb-3" placeholder="Name or area" value={q} onChange={(e) => setQ(e.target.value)} />
            <label className="form-label fw-semibold">Type</label>
            <select className="form-select mb-3" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">Schools and daycares</option>
              <option value="school">Schools</option>
              <option value="daycare">Daycares</option>
            </select>
            <label className="form-label fw-semibold">City</label>
            <select className="form-select mb-3" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <label className="form-label fw-semibold">Max monthly fee: Rs {maxFee.toLocaleString()}</label>
            <input type="range" className="form-range mb-3" min="5000" max="30000" step="1000" value={maxFee} onChange={(e) => setMaxFee(+e.target.value)} />
            <label className="form-label fw-semibold">Minimum rating</label>
            <select className="form-select mb-3" value={minRating} onChange={(e) => setMinRating(+e.target.value)}>
              <option value="0">Any</option><option value="4">4.0+</option><option value="4.5">4.5+</option>
            </select>
            <button className="btn-cs-outline w-100" onClick={reset}>Clear filters</button>
          </div>
        </aside>

        <section className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">{results.length} result{results.length !== 1 && "s"}</span>
            <select className="form-select w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rating">Top rated</option>
              <option value="fee-low">Fee: low to high</option>
              <option value="fee-high">Fee: high to low</option>
            </select>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-5">
              <h4>No matches</h4>
              <p className="text-muted">Try a higher fee limit or clear the filters.</p>
              <button className="btn-cs" onClick={reset}>Clear filters</button>
            </div>
          ) : (
            <div className="row g-3">
              {results.map((i) => (
                <div className="col-md-6 col-xl-4" key={i.id}>
                  <InstituteCard item={i} selected={compare.includes(i.id)} compareDisabled={compare.length >= 3} onToggleCompare={toggle} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {compare.length > 0 && (
        <div className="cs-bar">
          <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>{compare.length} selected (max 3): {picked.map((p) => p.name).join(", ")}</span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-light rounded-pill" onClick={() => setCompare([])}>Clear</button>
              <button className="btn-cs" disabled={compare.length < 2} onClick={() => setShowCompare(true)}>
                {compare.length < 2 ? "Pick one more" : "Compare now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompare && <CompareModal items={picked} onClose={() => setShowCompare(false)} />}
    </div>
  );
}

function CompareModal({ items, onClose }) {
  const minFee = Math.min(...items.map((i) => i.fee));
  const maxRating = Math.max(...items.map((i) => i.rating));
  const rows = [
    ["Type", (i) => (i.type === "school" ? "School" : "Daycare")],
    ["Location", (i) => `${i.area}, ${i.city}`],
    ["Monthly fee", (i) => `Rs ${i.fee.toLocaleString()}`, (i) => i.fee === minFee],
    ["Rating", (i) => `★ ${i.rating}`, (i) => i.rating === maxRating],
    ["Age group", (i) => i.ageGroup],
    ["Curriculum", (i) => i.curriculum],
    ["Established", (i) => i.established],
    ["Verified", (i) => (i.verified ? "Yes" : "Not yet")],
    ["Facilities", (i) => i.facilities.join(", ")],
  ];
  return (
    <div className="cs-modal-bg" onClick={onClose}>
      <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between mb-3">
          <h3 className="mb-0">Compare</h3>
          <button className="btn-close" onClick={onClose} aria-label="Close" />
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th></th>{items.map((i) => <th key={i.id} style={{ width: "auto", color: "var(--ink)" }}>{i.name}</th>)}</tr></thead>
            <tbody>
              {rows.map(([label, get, best]) => (
                <tr key={label}>
                  <th>{label}</th>
                  {items.map((i) => <td key={i.id} className={best && best(i) ? "cs-best" : ""}>{get(i)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <small className="text-muted">Green marks the lowest fee and highest rating.</small>
      </div>
    </div>
  );
}
