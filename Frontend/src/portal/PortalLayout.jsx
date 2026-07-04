import { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import { NAV_ICONS, HomeIcon, UserCircleIcon, PaletteIcon } from "./navIcons";
import { PortalHeader } from "./PortalHeader";
import { SIDEBAR_COLORS, SIDEBAR_COLOR_STORAGE_KEY } from "./sidebarColors";
import { useToast } from "../components/toast/ToastContext";
import "./PortalLayout.css";

const ROLE_MENUS = {
  CLIENT: [
    { to: "dashboard",     label: "Dashboard" },
    { to: "requests",      label: "My Requests" },
    { to: "assessments",   label: "Assessments" },
    { to: "account",       label: "Account" },
    { to: "quotations",    label: "My Quotations" },
    { to: "projects",      label: "My Projects" },
    { to: "feedback",      label: "Feedback" },
    { to: "notifications", label: "Notifications" },
  ],
  STAFF: [
    { to: "tasks",         label: "My Tasks" },
    { to: "requests",      label: "Requests" },
    { to: "projects",      label: "Projects" },
    { to: "design-files",  label: "Design Files" },
    { to: "notifications", label: "Notifications" },
  ],
  PROJECT_MANAGER: [
    { to: "clients",       label: "Client Management" },
    { to: "requests",      label: "Service Requests" },
    { to: "quotations",    label: "Quotations" },
    { to: "projects",      label: "Project Management" },
    { to: "tasks",         label: "Tasks and Resources" },
    { to: "design-files",  label: "Design Portfolio" },
    { to: "feedback",      label: "Customer Feedback" },
    { to: "analytics",     label: "Analytics" },
    { to: "notifications", label: "Notifications" },
  ],
  ADMIN: [
    { to: "clients",       label: "Client Management" },
    { to: "requests",      label: "Service Requests" },
    { to: "quotations",    label: "Quotations" },
    { to: "projects",      label: "Project Management" },
    { to: "tasks",         label: "Tasks and Resources" },
    { to: "design-files",  label: "Design Portfolio" },
    { to: "feedback",      label: "Customer Feedback" },
    { to: "analytics",     label: "Analytics Dashboard" },
    { to: "notifications", label: "Notifications" },
    { to: "security",      label: "Security and Access" },
  ],
};

const ROLE_LABELS = {
  CLIENT:          "Client",
  STAFF:           "Designer",
  PROJECT_MANAGER: "Project Manager",
  ADMIN:           "Administrator",
};

export function PortalLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [sidebarColor, setSidebarColor] = useState(
    () => (typeof window !== "undefined" && window.localStorage.getItem(SIDEBAR_COLOR_STORAGE_KEY)) || SIDEBAR_COLORS[0].value
  );
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) setColorPickerOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return <Navigate to="/portal/login" replace />;

  const menu = ROLE_MENUS[user.role] || ROLE_MENUS.CLIENT;
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  function handleLogout() {
    logout();
    showSuccess("You've been logged out.");
    navigate("/portal/login", { replace: true });
  }

  function handlePickSidebarColor(color) {
    setSidebarColor(color);
    window.localStorage.setItem(SIDEBAR_COLOR_STORAGE_KEY, color);
    setColorPickerOpen(false);
  }

  return (
    <div className="portal-layout">
      <aside className="portal-sidebar" style={{ "--sidebar-bg": sidebarColor }}>
        <div className="portal-sidebar__header">
          <span className="portal-sidebar__brand">Space Design Group</span>
          <span className="portal-sidebar__sub">Management Portal</span>
        </div>

        <div className="portal-sidebar__toolbar">
          <Link to="/" className="portal-sidebar__tool" title="Back to website" aria-label="Back to website">
            <HomeIcon />
          </Link>
          <Link to="profile" className="portal-sidebar__tool" title="Edit profile" aria-label="Edit profile">
            <UserCircleIcon />
          </Link>

          <div className="portal-sidebar__spacer" />

          <div className="portal-sidebar__color-picker" ref={colorPickerRef}>
            <button
              type="button"
              className="portal-sidebar__tool"
              title="Sidebar colour"
              aria-label="Change sidebar colour"
              onClick={() => setColorPickerOpen((v) => !v)}
            >
              <PaletteIcon />
            </button>

            {colorPickerOpen && (
              <div className="portal-sidebar__color-popover" role="group" aria-label="Sidebar colour">
                {SIDEBAR_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={"portal-sidebar__swatch" + (c.value === sidebarColor ? " is-selected" : "")}
                    style={{ background: c.value }}
                    title={c.name}
                    aria-label={`Sidebar colour: ${c.name}`}
                    onClick={() => handlePickSidebarColor(c.value)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="portal-sidebar__nav" aria-label="Portal modules">
          <ul>
            {menu.map((item) => {
              const ItemIcon = NAV_ICONS[item.to];
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      "portal-sidebar__link" + (isActive ? " is-active" : "")
                    }
                  >
                    {ItemIcon && (
                      <span className="portal-sidebar__link-icon">
                        <ItemIcon />
                      </span>
                    )}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="portal-sidebar__footer">
          <div className="portal-sidebar__user">
            <span className="portal-sidebar__user-name">
              {user.fullName || user.email}
            </span>
            <span className="portal-sidebar__user-role">{roleLabel}</span>
          </div>
          <button type="button" className="portal-sidebar__logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="portal-content">
        <PortalHeader user={user} roleLabel={roleLabel} theme={theme} onToggleTheme={toggleTheme} />
        <Outlet />
      </main>
    </div>
  );
}
