export default function InstituteCard({ item, selected, onToggleCompare, compareDisabled }) {
  const initials = item.name.split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className="cs-card">
      <div className="cs-cover" style={{ background: `linear-gradient(135deg, ${item.color[0]}, ${item.color[1]})` }}>
        {initials}
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="mb-1">{item.name}</h5>
          <span className="cs-rating">★ {item.rating}</span>
        </div>
        <div className="text-muted small mb-2">{item.area}, {item.city}{item.verified && " · ✔ Verified"}</div>
        <div className="mb-2">
          <span className={"cs-chip " + item.type}>{item.type === "school" ? "School" : "Daycare"}</span>
          <span className="cs-chip">{item.curriculum}</span>
          <span className="cs-chip">{item.ageGroup}</span>
        </div>
        <p className="small text-muted mb-3">{item.tagline}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong>Rs {item.fee.toLocaleString()}<span className="text-muted fw-normal small"> / month</span></strong>
          <label className="small fw-semibold d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
            <input type="checkbox" className="form-check-input m-0" checked={selected}
              disabled={!selected && compareDisabled} onChange={() => onToggleCompare(item.id)} />
            Compare
          </label>
        </div>
      </div>
    </div>
  );
}
