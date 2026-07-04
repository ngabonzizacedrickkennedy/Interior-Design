import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadNotifications, markNotificationRead } from "../api/actions/notifications";
import { BellIcon } from "./navIcons";

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

function initialsOf(text) {
  if (!text) return "?";
  return text
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PortalHeader({ user, roleLabel, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getUnreadNotifications(user.userId);
        if (!cancelled) setNotifications(data);
      } catch {}
    }
    if (user?.userId) load();
    return () => {
      cancelled = true;
    };
  }, [user?.userId]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  async function handleNotificationClick(n) {
    setNotifOpen(false);
    navigate("/portal/notifications");
    try {
      await markNotificationRead(n.id);
      setNotifications((list) => list.filter((x) => x.id !== n.id));
    } catch {}
  }

  return (
    <header className="portal-header">
      <div className="portal-header__spacer" />

      <div className="portal-header__actions">
        <button
          type="button"
          className="portal-header__icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="portal-header__notif" ref={notifRef}>
          <button
            type="button"
            className="portal-header__icon-btn"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="portal-header__badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="portal-header__dropdown">
              <div className="portal-header__dropdown-title">Notifications</div>
              {notifications.length === 0 ? (
                <p className="portal-header__dropdown-empty">You're all caught up.</p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="portal-header__dropdown-item"
                    onClick={() => handleNotificationClick(n)}
                  >
                    <span className="portal-header__dropdown-msg">{n.messageBody}</span>
                    <span className="portal-header__dropdown-meta">
                      {n.createdAt?.replace("T", " ").slice(0, 16)}
                    </span>
                  </button>
                ))
              )}
              <button
                type="button"
                className="portal-header__dropdown-viewall"
                onClick={() => {
                  setNotifOpen(false);
                  navigate("/portal/notifications");
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="portal-header__profile">
          <span className="portal-header__avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" />
            ) : (
              initialsOf(user?.fullName || user?.email)
            )}
          </span>
          <span className="portal-header__profile-text">
            <span className="portal-header__profile-name">{user?.fullName || user?.email}</span>
            <span className="portal-header__profile-role">{roleLabel}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
