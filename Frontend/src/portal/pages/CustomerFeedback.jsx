import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import * as feedbackActions from "../../api/actions/feedback";
import { getAllProjects, getProjectsByClient } from "../../api/actions/projects";
import { getClientByUser } from "../../api/actions/clients";
import "../PortalLayout.css";

export function CustomerFeedback() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [projects, setProjects]         = useState([]);
  const [avgRating, setAvgRating]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [submitted, setSubmitted]       = useState(false);
  const [form, setForm] = useState({
    projectId: "", metricRatingScore: 0, feedbackNarrative: "",
  });

  const isClient   = user?.role === "CLIENT";
  const canViewAll = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        if (isClient) {
          const profile = await getClientByUser(user.userId);
          const clientProjects = await getProjectsByClient(profile.id);
          setProjects(clientProjects);
        } else {
          const [all, allProjects, avg] = await Promise.all([
            feedbackActions.getAllFeedback(),
            getAllProjects(),
            feedbackActions.getAverageRating(),
          ]);
          setFeedbackList(all);
          setProjects(allProjects);
          setAvgRating(avg);
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.projectId || form.metricRatingScore === 0) {
      setError("Please select a project and a star rating.");
      return;
    }
    try {
      const created = await feedbackActions.submitFeedback({
        projectId: Number(form.projectId),
        metricRatingScore: form.metricRatingScore,
        feedbackNarrative: form.feedbackNarrative,
      });
      setFeedbackList((f) => [...f, created]);
      setForm({ projectId: "", metricRatingScore: 0, feedbackNarrative: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e) { setError(e.message); }
  }

  const fiveStarCount = feedbackList.filter((f) => f.metricRatingScore === 5).length;

  return (
    <div>
      <h1 className="portal-page-title">
        {isClient ? "Leave Feedback" : "Customer Feedback"}
      </h1>
      <p className="portal-page-sub">
        {isClient
          ? "Rate your experience and help us improve our service."
          : "View satisfaction scores and manage client feedback records."}
      </p>

      {error && <p className="portal-error">{error}</p>}

      {/* Stats bar for PM/Admin */}
      {canViewAll && !loading && (
        <div className="portal-stat-grid" style={{ marginBottom: "1.75rem" }}>
          <div className="portal-stat-card">
            <p className="portal-stat-card__label">Average Rating</p>
            <p className="portal-stat-card__value portal-stat-card__value--accent">
              {avgRating ? Number(avgRating).toFixed(1) : "–"} / 5
            </p>
          </div>
          <div className="portal-stat-card">
            <p className="portal-stat-card__label">Total Responses</p>
            <p className="portal-stat-card__value">{feedbackList.length}</p>
          </div>
          <div className="portal-stat-card">
            <p className="portal-stat-card__label">5-Star Reviews</p>
            <p className="portal-stat-card__value">{fiveStarCount}</p>
          </div>
        </div>
      )}

      {/* Submit form — for CLIENT and also PM/Admin can submit on behalf */}
      <section className="portal-section">
        <h2 className="portal-section__title">
          {isClient ? "Rate Your Experience" : "Submit Feedback on Behalf of Client"}
        </h2>
        {submitted && (
          <p style={{ color: "var(--color-accent)", marginBottom: "1rem", fontWeight: 500 }}>
            Thank you — your feedback has been recorded.
          </p>
        )}
        <form onSubmit={handleSubmit}>
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
              <label>Overall rating</label>
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button"
                    onClick={() => setForm({ ...form, metricRatingScore: star })}
                    style={{
                      fontSize: "1.6rem", background: "none", border: "none",
                      cursor: "pointer", padding: 0,
                      color: star <= form.metricRatingScore ? "var(--color-accent)" : "var(--color-line)",
                      transition: "color 0.1s",
                    }}>
                    &#9733;
                  </button>
                ))}
              </div>
            </div>
            <div className="field field--full">
              <label>Comments</label>
              <textarea rows={4} value={form.feedbackNarrative} required
                placeholder="Tell us about your experience with this project..."
                onChange={(e) => setForm({ ...form, feedbackNarrative: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-solid">Submit Feedback</button>
        </form>
      </section>

      {/* Feedback table — visible to PM/Admin only */}
      {canViewAll && (
        <section className="portal-section">
          <h2 className="portal-section__title">All Feedback Records</h2>
          {loading ? <p className="portal-loading">Loading feedback...</p> : (
            <div className="portal-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Client</th><th>Rating</th>
                    <th>Comments</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((f) => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 500 }}>{f.clientName}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <span style={{ color: "var(--color-accent)" }}>
                          {"★".repeat(f.metricRatingScore)}
                        </span>
                        <span style={{ color: "var(--color-line)" }}>
                          {"★".repeat(5 - f.metricRatingScore)}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--color-ink-soft)", marginLeft: "0.35rem" }}>
                          {f.metricRatingScore}/5
                        </span>
                      </td>
                      <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.feedbackNarrative}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {f.loggedTimestamp?.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                  {!feedbackList.length && (
                    <tr><td colSpan={4} className="portal-empty">No feedback submitted yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
