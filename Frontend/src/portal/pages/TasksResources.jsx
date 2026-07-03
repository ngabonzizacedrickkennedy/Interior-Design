import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import * as taskActions from "../../api/actions/tasks";
import { getAllProjects } from "../../api/actions/projects";
import "../PortalLayout.css";

export function TasksResources() {
  const { user } = useAuth();
  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState("ALL");
  const [form, setForm] = useState({ projectId: "", taskTitle: "", deadlineDate: "" });

  const isStaff   = user?.role === "STAFF";
  const canCreate = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        const [t, p] = await Promise.all([
          isStaff ? taskActions.getTasksByDesigner(user.userId) : taskActions.getAllTasks(),
          getAllProjects(),
        ]);
        setTasks(t);
        setProjects(p);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const created = await taskActions.createTask({
        projectId: Number(form.projectId),
        taskTitle: form.taskTitle,
        deadlineDate: form.deadlineDate || null,
      });
      setTasks((t) => [...t, created]);
      setForm({ projectId: "", taskTitle: "", deadlineDate: "" });
    } catch (e) { setError(e.message); }
  }

  async function handleToggle(id) {
    try {
      const updated = await taskActions.toggleTaskCompletion(id);
      setTasks((t) => t.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  function isOverdue(task) {
    return !task.isCompleted && task.deadlineDate && new Date(task.deadlineDate) < new Date();
  }

  const filtered = tasks.filter((t) => {
    if (filter === "DONE")    return t.isCompleted;
    if (filter === "PENDING") return !t.isCompleted;
    if (filter === "OVERDUE") return isOverdue(t);
    return true;
  });

  const done     = tasks.filter((t) => t.isCompleted).length;
  const overdue  = tasks.filter((t) => isOverdue(t)).length;

  return (
    <div>
      <h1 className="portal-page-title">{isStaff ? "My Tasks" : "Tasks and Resources"}</h1>
      <p className="portal-page-sub">
        {isStaff
          ? "Tasks currently assigned to you."
          : "Assign, track, and manage all project tasks."}
      </p>

      <div className="portal-stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Total Tasks</p>
          <p className="portal-stat-card__value">{tasks.length}</p>
        </div>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Completed</p>
          <p className="portal-stat-card__value portal-stat-card__value--accent">{done}</p>
        </div>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Pending</p>
          <p className="portal-stat-card__value">{tasks.length - done}</p>
        </div>
        {overdue > 0 && (
          <div className="portal-stat-card" style={{ borderLeft: "3px solid #ef4444" }}>
            <p className="portal-stat-card__label" style={{ color: "#ef4444" }}>Overdue</p>
            <p className="portal-stat-card__value" style={{ color: "#ef4444" }}>{overdue}</p>
          </div>
        )}
      </div>

      {error && <p className="portal-error">{error}</p>}

      {canCreate && (
        <section className="portal-section">
          <h2 className="portal-section__title">Create Task</h2>
          <form onSubmit={handleCreate}>
            <div className="portal-form-row">
              <div className="field">
                <label>Project</label>
                <select value={form.projectId} required
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.clientName}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Task title</label>
                <input value={form.taskTitle} required
                  onChange={(e) => setForm({ ...form, taskTitle: e.target.value })} />
              </div>
              <div className="field">
                <label>Deadline</label>
                <input type="date" value={form.deadlineDate}
                  onChange={(e) => setForm({ ...form, deadlineDate: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-solid">Create Task</button>
          </form>
        </section>
      )}

      <section className="portal-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 className="portal-section__title" style={{ border: "none", margin: 0 }}>Task Reports</h2>
          <div className="portal-actions">
            {["ALL", "PENDING", "DONE", "OVERDUE"].map((f) => (
              <button key={f} className={`btn${filter === f ? " btn-solid" : ""}`}
                style={{ fontSize: "0.78rem", padding: "0.3rem 0.8rem" }}
                onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {loading ? <p className="portal-loading">Loading tasks...</p> : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Task</th>
                  <th>Assigned To</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className={isOverdue(t) ? "is-overdue" : ""}>
                    <td>
                      <input type="checkbox" checked={t.isCompleted}
                        onChange={() => handleToggle(t.id)} />
                    </td>
                    <td style={{
                      textDecoration: t.isCompleted ? "line-through" : "none",
                      color: t.isCompleted ? "var(--color-ink-soft)" : "var(--color-ink)",
                      fontWeight: isOverdue(t) ? 600 : 400,
                    }}>
                      {t.taskTitle}
                      {isOverdue(t) && (
                        <span style={{ marginLeft: "0.5rem", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600 }}>
                          OVERDUE
                        </span>
                      )}
                    </td>
                    <td>
                      {t.assignedDesignerName || (
                        <span style={{ color: "var(--color-ink-soft)" }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ color: isOverdue(t) ? "#ef4444" : "var(--color-ink-soft)" }}>
                      {t.deadlineDate || <span style={{ color: "var(--color-line)" }}>No date</span>}
                    </td>
                    <td>
                      <span className={`badge badge--${t.isCompleted ? "completed" : isOverdue(t) ? "cancelled" : "pending"}`}>
                        {t.isCompleted ? "Done" : isOverdue(t) ? "Overdue" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={5} className="portal-empty">
                    {filter !== "ALL" ? `No ${filter.toLowerCase()} tasks.` : "No tasks found."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
