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

export function ProjectManagement() {
  const { user } = useAuth();
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [newMilestone, setNewMilestone] = useState({});

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

      {loading ? <p className="portal-loading">Loading projects...</p> : (
        projects.map((p) => (
          <section key={p.id} className="portal-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h2 className="portal-section__title" style={{ border: "none", marginBottom: "0.25rem" }}>
                  {p.clientName}
                </h2>
                <span className={`badge badge--${STATUS_BADGE[p.operationalStatus] || "draft"}`}>
                  {p.operationalStatus}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-accent)", lineHeight: 1 }}>
                  {p.visualProgressPercent}%
                </div>
                <div style={{ width: 140, height: 6, background: "var(--color-line)", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ width: p.visualProgressPercent + "%", height: "100%",
                    background: "var(--color-accent)", borderRadius: 999, transition: "width .4s" }} />
                </div>
                {canEdit && (
                  <select style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}
                    value={p.operationalStatus}
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}>
                    {["NOT_READY", "PENDING", "READY", "PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"].map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem" }}>
              {(p.milestones || []).map((m, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.45rem 0", borderBottom: "1px solid var(--color-line)" }}>
                  <input
                    type="checkbox"
                    checked={m.isAchieved}
                    disabled={isClient}
                    onChange={() => {
                      const updated = p.milestones.map((x, idx) =>
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
              {!p.milestones?.length && (
                <li style={{ color: "var(--color-ink-soft)", fontSize: "0.875rem" }}>
                  No milestones added yet.
                </li>
              )}
            </ul>

            {canEdit && (
              <form onSubmit={(e) => handleAddMilestone(e, p.id, p.milestones || [])}
                style={{ display: "flex", gap: "0.5rem" }}>
                <input style={{ flex: 1 }} placeholder="Add a milestone..."
                  value={newMilestone[p.id] || ""}
                  onChange={(e) => setNewMilestone((m) => ({ ...m, [p.id]: e.target.value }))} />
                <button type="submit" className="btn btn-solid">Add</button>
              </form>
            )}
          </section>
        ))
      )}

      {!loading && !projects.length && (
        <p className="portal-empty">
          {isClient ? "You have no active projects yet." : "No projects found."}
        </p>
      )}
    </div>
  );
}
