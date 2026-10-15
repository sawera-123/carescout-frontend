import { Link } from "react-router-dom";
import icon from "../assets/logo-icon.png";

export default function Logo({ light = false, size = 42, to = "/", onClick }) {
  return (
    <Link to={to} className="cs-brand" onClick={onClick}>
      <img src={icon} width={size} height={size} alt="CareScout logo" />
      <span className={"cs-wordmark" + (light ? " light" : "")}>Care<b>Scout</b></span>
    </Link>
  );
}
