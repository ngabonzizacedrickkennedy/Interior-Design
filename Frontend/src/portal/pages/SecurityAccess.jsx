import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import * as adminActions from "../../api/actions/admin";
import "../PortalLayout.css";

const ROLES   = ["CLIENT", "STAFF", "PROJECT_MANAGER", "ADMIN"];
const RBADGE  = { CLIENT: "draft", STAFF: "review", PROJECT_MANAGER: "progress", ADMIN: "approved" };

export function SecurityAccess() {
  const { user } = useAuth();
  const [users, setUsers]     = useState([]);
  const [audit, setAudit]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState("");

  // ADMIN-only guard
  if (user?.role !== "ADMIN") {
    return (
      <div className="portal-access-denied">
        <h2>Access Restricted</h2>
        <p>This section is only available to system administrators.</p>
      </div>
    );
  }

  useEffect(() => {
    async function load() {
      try {
        const [u, a] = await Promise.all([
          adminActions.getAllUsers(),
          adminActions.getAuditTrail(),
        ]);
        setUsers(u);
        setAudit(a);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  async function handleRoleChange(id, role) {
    try {
      const updated = await adminActions.changeUserRole(id, role);
      setUsers((u) => u.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  async function handleToggle(id) {
    try {
      const updated = await adminActions.toggleUserEnabled(id);
      setUsers((u) => u.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  const filteredUsers = users.filter((u) =>
    !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount  = users.filter((u) => u.role === "ADMIN").length;
  const activeCount = users.filter((u) => u.enabled).length;

  return (
    <div>
      <h1 className="portal-page-title">Security and Access Control</h1>
      <p className="portal-page-sub">Manage user accounts, assign roles, and review the system audit trail.</p>

      <div className="portal-role-banner" style={{ marginBottom: "1.75rem" }}>
        <div className="portal-role-banner__text">
          <h2>System Overview</h2>
          <p>Full administrative access — manage all user permissions and access tiers.</p>
        </div>
        <div className="portal-role-banner__stats">
          <div className="portal-role-banner__stat">
            <span className="portal-role-banner__stat-value">{users.length}</span>
            <span className="portal-role-banner__stat-label">Total Users</span>
          </div>
          <div className="portal-role-banner__stat">
            <span className="portal-role-banner__stat-value">{activeCount}</span>
            <span className="portal-role-banner__stat-label">Active</span>
          </div>
          <div className="portal-role-banner__stat">
            <span className="portal-role-banner__stat-value">{adminCount}</span>
            <span className="portal-role-banner__stat-label">Admins</span>
          </div>
        </div>
      </div>

      {error && <p className="portal-error">{error}</p>}

      <section className="portal-section">
        <h2 className="portal-section__title">User Management</h2>
        <div className="portal-search-bar">
          <input placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {loading ? <p className="portal-loading">Loading users...</p> : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th>
                  <th>Role</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.fullName}</td>
                    <td style={{ color: "var(--color-ink-soft)" }}>{u.email}</td>
                    <td>
                      <span className={`badge badge--${RBADGE[u.role] || "draft"}`}>
                        {u.role?.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge--${u.enabled ? "active" : "cancelled"}`}>
                        {u.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      <div className="portal-actions">
                        <select value={u.role} style={{ fontSize: "0.8rem" }}
                          disabled={u.id === user.userId}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r.replace("_", " ")}</option>
                          ))}
                        </select>
                        <button className="btn"
                          style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
                          disabled={u.id === user.userId}
                          onClick={() => handleToggle(u.id)}>
                          {u.enabled ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredUsers.length && (
                  <tr><td colSpan={5} className="portal-empty">No users match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="portal-section">
        <h2 className="portal-section__title">System Audit Trail</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--color-ink-soft)", marginBottom: "1rem" }}>
          Read-only record of all significant system actions.
        </p>
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr><th>Timestamp</th><th>Operator</th><th>Action Taken</th></tr>
            </thead>
            <tbody>
              {audit.map((a) => (
                <tr key={a.id}>
                  <td style={{ whiteSpace: "nowrap", fontFamily: "monospace", fontSize: "0.82rem", color: "var(--color-ink-soft)" }}>
                    {a.timestampLogged?.replace("T", " ").slice(0, 16)}
                  </td>
                  <td style={{ fontWeight: 500 }}>{a.operatorName}</td>
                  <td>{a.historicalAction}</td>
                </tr>
              ))}
              {!audit.length && (
                <tr><td colSpan={3} className="portal-empty">No audit entries recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
