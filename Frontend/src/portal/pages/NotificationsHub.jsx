import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import * as notifActions from "../../api/actions/notifications";
import { getAllUsers } from "../../api/actions/admin";
import "../PortalLayout.css";

const CHANNELS = ["IN_APP", "EMAIL", "SMS"];
const CHANNEL_BADGE = { EMAIL: "review", SMS: "pending", IN_APP: "active" };

export function NotificationsHub() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [form, setForm] = useState({ recipientUserId: "", dispatchChannel: "IN_APP", messageBody: "" });

  const canSend = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        const notifs = await notifActions.getNotificationsByUser(user.userId);
        setNotifications(notifs);
        if (canSend) {
          const allUsers = await getAllUsers();
          setUsers(allUsers.filter((u) => u.id !== user.userId));
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  async function handleSend(e) {
    e.preventDefault();
    if (!form.recipientUserId) return;
    try {
      await notifActions.sendNotification({
        recipientUserId: Number(form.recipientUserId),
        dispatchChannel: form.dispatchChannel,
        messageBody:     form.messageBody,
      });
      setForm({ recipientUserId: "", dispatchChannel: "IN_APP", messageBody: "" });
    } catch (e) { setError(e.message); }
  }

  async function markRead(id) {
    try {
      const updated = await notifActions.markNotificationRead(id);
      setNotifications((n) => n.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.wasRead);
    for (const n of unread) await markRead(n.id);
  }

  const unreadCount = notifications.filter((n) => !n.wasRead).length;

  return (
    <div>
      <h1 className="portal-page-title">Notifications</h1>
      <p className="portal-page-sub">
        {unreadCount > 0
          ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
          : "All notifications are read."}
      </p>

      {error && <p className="portal-error">{error}</p>}

      {/* Send panel — PM and Admin only */}
      {canSend && (
        <section className="portal-section">
          <h2 className="portal-section__title">Send Notification</h2>
          <form onSubmit={handleSend}>
            <div className="portal-form-row">
              <div className="field">
                <label>Recipient</label>
                <select value={form.recipientUserId} required
                  onChange={(e) => setForm({ ...form, recipientUserId: e.target.value })}>
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.role?.replace("_", " ")})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Channel</label>
                <select value={form.dispatchChannel}
                  onChange={(e) => setForm({ ...form, dispatchChannel: e.target.value })}>
                  {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field field--full">
                <label>Message</label>
                <textarea rows={3} value={form.messageBody} required
                  placeholder="Enter notification message..."
                  onChange={(e) => setForm({ ...form, messageBody: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-solid">Send Notification</button>
          </form>
        </section>
      )}

      {/* Notification feed */}
      <section className="portal-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 className="portal-section__title" style={{ border: "none", margin: 0 }}>
            My Notifications
          </h2>
          {unreadCount > 0 && (
            <button className="btn" style={{ fontSize: "0.8rem" }} onClick={markAllRead}>
              Mark all read
            </button>
          )}
        </div>

        {loading ? <p className="portal-loading">Loading notifications...</p> : (
          <div>
            {notifications.length === 0 && (
              <p className="portal-empty">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="notif-card">
                <div className={`notif-card__dot${n.wasRead ? " notif-card__dot--read" : ""}`} />
                <div className="notif-card__body">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <span className={`badge badge--${CHANNEL_BADGE[n.dispatchChannel] || "draft"}`}
                      style={{ fontSize: "0.7rem" }}>
                      {n.dispatchChannel}
                    </span>
                    {!n.wasRead && (
                      <span style={{ fontSize: "0.7rem", color: "var(--color-accent)", fontWeight: 600 }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="notif-card__msg">{n.messageBody}</p>
                  <p className="notif-card__meta">
                    {n.createdAt?.replace("T", " ").slice(0, 16)}
                  </p>
                </div>
                {!n.wasRead && (
                  <button className="btn" style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem", flexShrink: 0 }}
                    onClick={() => markRead(n.id)}>
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
