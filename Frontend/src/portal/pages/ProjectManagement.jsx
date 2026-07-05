import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import * as projectActions from "../../api/actions/projects";
import { getClientByUser } from "../../api/actions/clients";
import "../PortalLayout.css";

const STATUS_BADGE = {
  NOT_READY: "not-ready", PENDING: "pending", READY: "ready",
  PLANNING: "pending", ACTIVE: "active", ON_HOLD: "review",
  COMPLETED: "completed", CANCELLED: "cancelled",
};

const FINISHED_STATUSES = ["COMPLETED", "CANCELLED"];
const ALL_STATUSES = ["NOT_READY", "PENDING", "READY", "PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];

export function ProjectManagement() {
  const { user } = useAuth();
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [newMilestone, setNewMilestone] = useState({});
  const [openId, setOpenId]         = useState(null);
  const [tab, setTab]               = useState("ACTIVE");

  const isClient = user?.role === "CLIENT";
  const canEdit  = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        if (isClient) {
          const clientProfile = await getClientByUser(user.userId);
          const p = await projectActions.getProjectsByClient(clientProfile.id);
          setProjects(p);
        } else {
          const p = await projectActions.getAllProjects();
          setProjects(p);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleToggleMilestone(projectId, updatedMilestones) {
    try {
      const result = await projectActions.updateMilestones(projectId, updatedMilestones);
      setProjects((p) => p.map((x) => x.id === projectId ? result : x));
    } catch (e) { setError(e.message); }
  }

  async function handleAddMilestone(e, projectId, currentMilestones) {
    e.preventDefault();
    const name = (newMilestone[projectId] || "").trim();
    if (!name) return;
    const updated = [...currentMilestones, { name, isAchieved: false }];
    try {
      const result = await projectActions.updateMilestones(projectId, updated);
      setProjects((p) => p.map((x) => x.id === projectId ? result : x));
      setNewMilestone((m) => ({ ...m, [projectId]: "" }));
    } catch (e) { setError(e.message); }
  }

  async function handleStatusChange(id, operationalStatus) {
    try {
      const result = await projectActions.updateProjectStatus(id, operationalStatus);
      setProjects((p) => p.map((x) => x.id === id ? result : x));
    } catch (e) { setError(e.message); }
  }

  const activeProjects   = projects.filter((p) => !FINISHED_STATUSES.includes(p.operationalStatus));
  const visibleProjects  = tab === "ACTIVE" ? activeProjects : projects;

  return (
    <div>
      <h1 className="portal-page-title">
        {isClient ? "My Projects" : "Project Management"}
      </h1>
      <p className="portal-page-sub">
        {isClient
          ? "Track the progress of your active projects and milestones."
          : "Monitor active projects, update milestones, and track progress."}
      </p>

      {error && <p className="portal-error">{error}</p>}

      <div className="portal-stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Active Projects</p>
          <p className="portal-stat-card__value">{activeProjects.length}</p>
        </div>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Total Projects</p>
          <p className="portal-stat-card__value">{projects.length}</p>
        </div>
      </div>

      <div className="gallery-tabs" style={{ marginBottom: "1.5rem" }}>
        <button type="button" className={"gallery-tab" + (tab === "ACTIVE" ? " is-active" : "")}
          onClick={() => setTab("ACTIVE")}>
          Active ({activeProjects.length})
        </button>
        <button type="button" className={"gallery-tab" + (tab === "ALL" ? " is-active" : "")}
          onClick={() => setTab("ALL")}>
          All Projects ({projects.length})
        </button>
      </div>

      {loading ? <p className="portal-loading">Loading projects...</p> : (
        visibleProjects.map((p) => {
          const open = openId === p.id;
          const milestones = p.milestones || [];
          const achievedCount = milestones.filter((m) => m.isAchieved).length;

          return (
            <section key={p.id} className="portal-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 className="portal-section__title" style={{ border: "none", marginBottom: "0.4rem" }}>
                    {p.requestName || p.clientName || "Untitled project"}
                  </h2>
                  <span className={`badge badge--${STATUS_BADGE[p.operationalStatus] || "draft"}`}>
                    {p.operationalStatus?.replace(/_/g, " ")}
                  </span>
                  <span style={{ marginLeft: "0.75rem", fontSize: "0.85rem", color: "var(--color-ink-soft)" }}>
                    {achievedCount} of {milestones.length} milestones complete
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-accent)", lineHeight: 1 }}>
                    {p.visualProgressPercent}%
                  </div>
                  <div style={{ width: 120, height: 6, background: "var(--color-line)", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: p.visualProgressPercent + "%", height: "100%",
                      background: "var(--color-accent)", borderRadius: 999, transition: "width .4s" }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <button type="button" className="btn" style={{ fontSize: "0.8rem" }}
                  onClick={() => setOpenId(open ? null : p.id)}>
                  {open ? "Collapse" : "View Tasks"}
                </button>
              </div>

              {open && (
                <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-line)" }}>
                  {!isClient && (
                    <p style={{ fontSize: "0.875rem", color: "var(--color-ink-soft)", marginTop: 0, marginBottom: "1.25rem" }}>
                      Client: <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>{p.clientName}</span>
                    </p>
                  )}

                  {canEdit && (
                    <div className="field" style={{ maxWidth: 240, marginBottom: "1.25rem" }}>
                      <label>Project Status</label>
                      <select value={p.operationalStatus}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}>
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem" }}>
                    {milestones.map((m, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.45rem 0", borderBottom: "1px solid var(--color-line)" }}>
                        <input
                          type="checkbox"
                          checked={m.isAchieved}
                          disabled={isClient}
                          onChange={() => {
                            const updated = milestones.map((x, idx) =>
                              idx === i ? { ...x, isAchieved: !x.isAchieved } : x
                            );
                            handleToggleMilestone(p.id, updated);
                          }}
                        />
                        <span style={{
                          flex: 1,
                          textDecoration: m.isAchieved ? "line-through" : "none",
                          color: m.isAchieved ? "var(--color-ink-soft)" : "var(--color-ink)",
                        }}>
                          {m.name}
                        </span>
                      </li>
                    ))}
                    {!milestones.length && (
                      <li style={{ color: "var(--color-ink-soft)", fontSize: "0.875rem" }}>
                        No milestones added yet.
                      </li>
                    )}
                  </ul>

                  {canEdit && (
                    <form onSubmit={(e) => handleAddMilestone(e, p.id, milestones)}
                      style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={{ flex: 1 }} placeholder="Add a milestone..."
                        value={newMilestone[p.id] || ""}
                        onChange={(e) => setNewMilestone((m) => ({ ...m, [p.id]: e.target.value }))} />
                      <button type="submit" className="btn btn-solid">Add</button>
                    </form>
                  )}
                </div>
              )}
            </section>
          );
        })
      )}

      {!loading && !visibleProjects.length && (
        <p className="portal-empty">
          {isClient
            ? "You have no active projects yet."
            : tab === "ACTIVE" ? "No active projects right now." : "No projects found."}
        </p>
      )}
    </div>
  );
}
