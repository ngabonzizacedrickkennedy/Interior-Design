import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAnalyticsSnapshot } from "../../api/actions/analytics";
import "../PortalLayout.css";

export function AnalyticsDashboard() {
  const { user }      = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // PM/ADMIN only
  if (user?.role !== "PROJECT_MANAGER" && user?.role !== "ADMIN") {
    return (
      <div className="portal-access-denied">
        <h2>Access Restricted</h2>
        <p>Analytics are available to Project Managers and Administrators only.</p>
      </div>
    );
  }

  function load() {
    setLoading(true);
    getAnalyticsSnapshot()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p className="portal-loading">Computing analytics snapshot...</p>;
  if (error)   return <p className="portal-error">{error}</p>;
  if (!data)   return null;

  const taskPct  = data.totalTasks ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0;
  const reqPct   = data.totalRequests ? Math.round((data.approvedRequests / data.totalRequests) * 100) : 0;
  const quotePct = data.totalQuotations ? Math.round((data.approvedQuotations / data.totalQuotations) * 100) : 0;

  const kpis = [
    { label: "Total Clients",       value: data.totalClients,           accent: false },
    { label: "Active Projects",      value: data.activeProjects,         accent: true  },
    { label: "Avg Project Progress", value: `${data.averageProjectProgress?.toFixed(0)}%`, accent: true },
    { label: "Task Completion",      value: `${taskPct}%`,               accent: true  },
    { label: "Total Requests",       value: data.totalRequests,          accent: false },
    { label: "Approved Requests",    value: data.approvedRequests,       accent: false },
    { label: "Approved Quotations",  value: data.approvedQuotations,     accent: false },
    { label: "Avg Client Rating",    value: data.averageFeedbackRating
        ? `${Number(data.averageFeedbackRating).toFixed(1)} / 5` : "N/A", accent: true },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
        <div>
          <h1 className="portal-page-title">Analytics Dashboard</h1>
          <p className="portal-page-sub" style={{ margin: 0 }}>
            Live metrics computed from all active system data.
          </p>
        </div>
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      <div className="portal-stat-grid" style={{ marginBottom: "1.75rem" }}>
        {kpis.map((k) => (
          <div key={k.label} className="portal-stat-card">
            <p className="portal-stat-card__label">{k.label}</p>
            <p className={`portal-stat-card__value${k.accent ? " portal-stat-card__value--accent" : ""}`}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <section className="portal-section">
        <h2 className="portal-section__title">Performance Rates</h2>

        {[
          { label: "Task Completion Rate",      value: taskPct,  total: `${data.completedTasks} of ${data.totalTasks} tasks completed` },
          { label: "Request Approval Rate",     value: reqPct,   total: `${data.approvedRequests} of ${data.totalRequests} requests approved` },
          { label: "Quotation Approval Rate",   value: quotePct, total: `${data.approvedQuotations} of ${data.totalQuotations} quotations approved` },
          { label: "Average Project Progress",  value: Math.round(data.averageProjectProgress || 0), total: `${data.totalProjects} total projects` },
        ].map((bar) => (
          <div key={bar.label} style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.4rem" }}>
              <span style={{ fontWeight: 500 }}>{bar.label}</span>
              <span style={{ color: "var(--color-ink-soft)" }}>{bar.total}</span>
            </div>
            <div style={{ height: 8, background: "var(--color-line)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                width: `${bar.value}%`, height: "100%",
                background: "var(--color-accent)", borderRadius: 999,
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-ink-soft)", marginTop: "0.25rem" }}>
              {bar.value}%
            </div>
          </div>
        ))}
      </section>

      <section className="portal-section">
        <h2 className="portal-section__title">Service Delivery Summary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-ink-soft)", fontWeight: 600 }}>
              Requests
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
              {data.totalRequests} total &bull; {data.approvedRequests} approved &bull; {data.totalRequests - data.approvedRequests} pending
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-ink-soft)", fontWeight: 600 }}>
              Projects
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
              {data.totalProjects} total &bull; {data.activeProjects} active &bull; {data.totalProjects - data.activeProjects} other
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-ink-soft)", fontWeight: 600 }}>
              Tasks
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
              {data.totalTasks} total &bull; {data.completedTasks} done &bull; {data.totalTasks - data.completedTasks} pending
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-ink-soft)", fontWeight: 600 }}>
              Client Satisfaction
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
              {data.averageFeedbackRating
                ? `${Number(data.averageFeedbackRating).toFixed(1)} / 5 average rating`
                : "No feedback recorded yet"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
