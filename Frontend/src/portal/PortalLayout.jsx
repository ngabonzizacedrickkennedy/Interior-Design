import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { NAV_ICONS } from "./navIcons";
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
  const navigate = useNavigate();

  if (!user) return <Navigate to="/portal/login" replace />;

  const menu = ROLE_MENUS[user.role] || ROLE_MENUS.CLIENT;
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  function handleLogout() {
    logout();
    navigate("/portal/login", { replace: true });
  }

  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-sidebar__header">
          <span className="portal-sidebar__brand">Space Design Group</span>
          <span className="portal-sidebar__sub">Management Portal</span>
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
        <Outlet />
      </main>
    </div>
  );
}
