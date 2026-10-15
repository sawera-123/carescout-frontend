import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

// Centered card on a blue background, used by Login and Register.
// All styles are inside this file, so it looks right even without theme.css.
export default function AuthShell({ children, width = 460 }) {
  return (
    <div className="cs-authbg">
      <style>{CSS}</style>

      <span className="orb o1" /><span className="orb o2" /><span className="orb o3" />
      {["🏠", "🎓", "❤️", "⭐", "🧸", "📚"].map((e, i) => (
        <span key={i} className={`cs-float f${i + 1}`} aria-hidden="true">{e}</span>
      ))}
      <svg className="cs-wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,64 C240,140 480,0 720,48 C960,96 1200,150 1440,60 L1440,160 L0,160 Z" fill="#fff" />
      </svg>

      <Link to="/" className="cs-backhome">← Back to home</Link>

      <div className="cs-authcol" style={{ maxWidth: width }}>
        <div className="cs-authcard">
          <div className="text-center mb-3">
            <img src={logo} className="cs-authlogo" alt="CareScout" />
            <div className="cs-tag mt-2">Discover · Verify · Care</div>
          </div>
          {children}
        </div>
        <div className="cs-trust">
          <span>🔒 Secure</span><span>✔ Free for parents</span><span>🏫 Verified listings</span>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.cs-authbg{--ink:#0b2545;--navy:#0b2f57;--blue:#0d4f8b;--blue-dark:#0a3d6b;--sky:#e8f1fa;--line:#d9e5f1;--muted:#5a6f86;--gold:#f6a929;
  min-height:100vh;display:flex;align-items:center;justify-content:center;padding:4rem 1rem 3rem;position:relative;overflow:hidden;color:var(--ink);
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Ccircle cx='3' cy='3' r='2' fill='%23ffffff' fill-opacity='.10'/%3E%3C/svg%3E"),
    linear-gradient(145deg,#082647 0%,#0d3d6b 42%,#115c7c 100%);}
.cs-authbg .orb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;animation:cs-drift 14s ease-in-out infinite;}
.cs-authbg .o1{width:420px;height:420px;background:#1a9bb8;opacity:.55;left:-120px;top:-100px;}
.cs-authbg .o2{width:360px;height:360px;background:#f6a929;opacity:.38;right:-110px;top:8%;animation-delay:-5s;}
.cs-authbg .o3{width:460px;height:460px;background:#2f7fe0;opacity:.45;right:12%;bottom:-220px;animation-delay:-9s;}
@keyframes cs-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
.cs-wave{position:absolute;left:0;right:0;bottom:0;width:100%;height:120px;opacity:.07;pointer-events:none;}
.cs-float{position:absolute;font-size:3rem;opacity:.22;pointer-events:none;user-select:none;animation:cs-bob 7s ease-in-out infinite;}
.cs-float.f1{top:10%;left:8%}.cs-float.f2{top:16%;right:11%;animation-delay:-2s}.cs-float.f3{bottom:14%;left:11%;animation-delay:-4s}
.cs-float.f4{bottom:10%;right:9%;animation-delay:-1s}.cs-float.f5{top:48%;left:3%;animation-delay:-3s}.cs-float.f6{top:44%;right:3%;animation-delay:-5s}
@keyframes cs-bob{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-18px) rotate(4deg)}}
@media(prefers-reduced-motion:reduce){.cs-float,.orb{animation:none}}
@media(max-width:700px){.cs-float{display:none}}

.cs-backhome{position:absolute;top:1.2rem;left:1.5rem;color:#fff;text-decoration:none;font-weight:700;z-index:3;opacity:.92;}
.cs-backhome:hover{color:var(--gold);}
.cs-authcol{position:relative;z-index:2;width:100%;}
.cs-authcard{position:relative;overflow:hidden;background:rgba(255,255,255,.97);border:1px solid rgba(255,255,255,.7);border-radius:28px;padding:2.2rem 2rem 1.7rem;box-shadow:0 40px 90px -30px rgba(0,0,0,.65);}
.cs-authcard::before{content:"";position:absolute;left:0;right:0;top:0;height:6px;background:linear-gradient(90deg,#0d3d6b,#178197,#f6a929);}
@media(max-width:520px){.cs-authcard{padding:1.8rem 1.2rem 1.4rem}}
.cs-authlogo{width:92px;height:92px;filter:drop-shadow(0 8px 14px rgba(13,61,107,.35));}
.cs-tag{letter-spacing:.22em;font-size:.68rem;font-weight:700;color:var(--muted);text-transform:uppercase;}
.cs-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:.4rem 1.2rem;margin-top:1.1rem;color:#d3e3f5;font-size:.85rem;font-weight:600;}

.cs-authcard h3{font-family:'Bricolage Grotesque','Nunito Sans',sans-serif;letter-spacing:-.02em;color:var(--navy);}
.cs-authcard a{color:var(--blue);}
.cs-authcard .form-label{font-weight:700;font-size:.9rem;color:var(--navy);}
.cs-authcard .form-control,.cs-authcard .form-select{border:1.5px solid var(--line);border-radius:12px;padding:.72rem 1rem;background:#fff;}
.cs-authcard .form-control:focus,.cs-authcard .form-select:focus{border-color:var(--blue);box-shadow:0 0 0 .22rem rgba(13,79,139,.16);}
.cs-authcard .btn-cs{background:linear-gradient(135deg,#0d4f8b,#178197);color:#fff;border:0;border-radius:999px;padding:.7rem 1.3rem;font-weight:800;box-shadow:0 12px 22px -12px rgba(13,79,139,.8);}
.cs-authcard .btn-cs:hover{filter:brightness(1.08);color:#fff;}
.cs-authcard .btn-cs:disabled{opacity:.65}

.cs-roles{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.2rem;}
.cs-role{border:2px solid var(--line);background:#fff;border-radius:14px;padding:.6rem .3rem;text-align:center;font-weight:700;font-size:.85rem;cursor:pointer;color:var(--ink);transition:all .15s;}
.cs-role:hover{border-color:var(--blue);}
.cs-role.on{border-color:var(--blue);background:var(--sky);color:var(--blue);}
.cs-role span{display:block;font-size:1.4rem;}
.cs-rolecards{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin-bottom:1rem;}
.cs-rolecard{border:2px solid var(--line);background:#fff;border-radius:16px;padding:.8rem .5rem;text-align:center;cursor:pointer;transition:all .15s;color:var(--ink);}
.cs-rolecard:hover{border-color:var(--blue);transform:translateY(-2px);}
.cs-rolecard.on{border-color:var(--blue);background:var(--sky);box-shadow:0 10px 20px -14px rgba(13,79,139,.8);}
.cs-rolecard .ico{font-size:1.6rem;display:block;}
.cs-rolecard b{display:block;font-size:.95rem;}
.cs-rolecard small{color:var(--muted);font-size:.74rem;line-height:1.2;display:block;}
.cs-benefit{background:var(--sky);border-radius:14px;padding:.8rem 1rem;margin-bottom:1.2rem;font-size:.88rem;}
.cs-benefit ul{margin:.3rem 0 0;padding-left:1.1rem;color:var(--muted);}
.cs-journey{display:flex;align-items:center;justify-content:center;gap:.4rem;flex-wrap:wrap;margin-bottom:1.1rem;font-size:.8rem;font-weight:700;color:var(--muted);}
.cs-journey b{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--gold);color:var(--ink);font-size:.75rem;margin-right:.3rem;}
.cs-journey i{font-style:normal;opacity:.5;}
.cs-pick{border:1.5px solid var(--line);background:#fff;border-radius:999px;padding:.4rem 1rem;font-weight:700;font-size:.9rem;margin:0 .4rem .5rem 0;color:var(--ink);}
.cs-pick.on{background:var(--blue);border-color:var(--blue);color:#fff;}
.cs-pw{position:relative;}
.cs-pw button{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:none;color:var(--muted);font-weight:700;font-size:.8rem;}
.cs-meter{height:5px;border-radius:5px;background:var(--line);overflow:hidden;margin-top:.4rem;}
.cs-meter i{display:block;height:100%;transition:width .2s,background .2s;}
`;
