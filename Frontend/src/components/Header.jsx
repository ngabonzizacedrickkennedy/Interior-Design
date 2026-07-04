import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../portal/auth/AuthContext";
import { ROLE_DEFAULT_ROUTE } from "../portal/auth/roles";
import { useTheme } from "../theme/ThemeContext";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

          <button
            type="button"
            className="header__theme-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

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
