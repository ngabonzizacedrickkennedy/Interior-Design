import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../portal/auth/AuthContext";
import { ROLE_DEFAULT_ROUTE } from "../portal/auth/roles";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { user } = useAuth();

  const portalRoute = user
    ? ROLE_DEFAULT_ROUTE[user.role] || "/portal/clients"
    : "/portal/login";

  const portalLabel = user
    ? user.fullName?.split(" ")[0] || "My Portal"
    : "Sign In";

  return (
    <header className="header">
      <div className="container header__row">
        <NavLink to="/" className="header__mark" end>
          Space Design Group
        </NavLink>

        <div className="header__right">
          <nav className="header__nav">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link to={portalRoute} className="header__portal-btn">
            {user && (
              <span className="header__portal-dot" aria-hidden="true" />
            )}
            {portalLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
