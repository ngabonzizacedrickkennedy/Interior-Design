import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import * as docActions from "../../api/actions/documents";
import { getAllProjects } from "../../api/actions/projects";
import "../PortalLayout.css";

const APPROVAL_BADGE = { PENDING: "pending", APPROVED: "approved", REJECTED: "cancelled" };

export function DesignPortfolio() {
  const { user } = useAuth();
  const [docs, setDocs]         = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [form, setForm] = useState({ projectId: "", fileStorageUrl: "" });
  const [fileLabel, setFileLabel] = useState("No file chosen");
  const [showForm, setShowForm]   = useState(false);

  const canUpload   = user?.role === "STAFF" || user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";
  const canApprove  = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        const [d, p] = await Promise.all([
          docActions.getAllDocuments(),
          getAllProjects(),
        ]);
        setDocs(d);
        setProjects(p);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (f) { setFileLabel(f.name); setForm((p) => ({ ...p, fileStorageUrl: `/uploads/${f.name}` })); }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!form.projectId || !form.fileStorageUrl) return;
    try {
      const created = await docActions.uploadDocument({
        projectId: Number(form.projectId),
        fileStorageUrl: form.fileStorageUrl,
      });
      setDocs((d) => [...d, created]);
      setForm({ projectId: "", fileStorageUrl: "" });
      setFileLabel("No file chosen");
      setShowForm(false);
    } catch (e) { setError(e.message); }
  }

  async function handleApprove(id) {
    try {
      const updated = await docActions.approveDocument(id);
      setDocs((d) => d.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  async function handleReject(id) {
    try {
      const updated = await docActions.rejectDocument(id);
      setDocs((d) => d.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  async function handleNewVersion(id) {
    try {
      const updated = await docActions.incrementDocumentVersion(id);
      setDocs((d) => d.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  // Group by project
  const grouped = docs.reduce((acc, d) => {
    const key = projects.find((p) => p.id === d.projectId)?.clientName || `Project ${d.projectId}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(d);
    return acc;
  }, {});

  const pending  = docs.filter((d) => d.approvalBadgeStatus === "PENDING").length;
  const approved = docs.filter((d) => d.approvalBadgeStatus === "APPROVED").length;

  return (
    <div>
      <h1 className="portal-page-title">Design Portfolio</h1>
      <p className="portal-page-sub">Upload design files, manage document versions, and track approvals.</p>

      <div className="portal-stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Total Documents</p>
          <p className="portal-stat-card__value">{docs.length}</p>
        </div>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Approved</p>
          <p className="portal-stat-card__value portal-stat-card__value--accent">{approved}</p>
        </div>
        <div className="portal-stat-card">
          <p className="portal-stat-card__label">Awaiting Review</p>
          <p className="portal-stat-card__value">{pending}</p>
        </div>
      </div>

      {error && <p className="portal-error">{error}</p>}

      {canUpload && (
        <div style={{ marginBottom: "1rem" }}>
          <button className="btn btn-solid" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "+ Upload Design File"}
          </button>
        </div>
      )}

      {showForm && canUpload && (
        <section className="portal-section">
          <h2 className="portal-section__title">Upload Design File</h2>
          <form onSubmit={handleUpload}>
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
                <label>File</label>
                <input type="file" onChange={handleFileChange} />
                <small style={{ color: "var(--color-ink-soft)", display: "block", marginTop: "0.25rem" }}>
                  {fileLabel}
                </small>
              </div>
            </div>
            <button type="submit" className="btn btn-solid">Upload</button>
          </form>
        </section>
      )}

      {loading ? <p className="portal-loading">Loading documents...</p> : (
        Object.entries(grouped).length === 0
          ? <p className="portal-empty">No design files uploaded yet.</p>
          : Object.entries(grouped).map(([projectName, files]) => (
              <section key={projectName} className="portal-section">
                <h2 className="portal-section__title">{projectName}</h2>
                <div className="portal-table-wrap">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>File</th><th>Version</th>
                        <th>Status</th>{canApprove && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((d) => (
                        <tr key={d.id}>
                          <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                            {d.fileStorageUrl?.split("/").pop() || d.fileStorageUrl}
                          </td>
                          <td>
                            <span style={{
                              background: "var(--color-bg-alt)",
                              border: "1px solid var(--color-line)",
                              borderRadius: 999,
                              padding: "0.15rem 0.6rem",
                              fontSize: "0.8rem", fontWeight: 600,
                            }}>
                              v{d.fileVersion}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge--${APPROVAL_BADGE[d.approvalBadgeStatus] || "draft"}`}>
                              {d.approvalBadgeStatus}
                            </span>
                          </td>
                          {canApprove && (
                            <td>
                              <div className="portal-actions">
                                <button className="btn"
                                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}
                                  disabled={d.approvalBadgeStatus === "APPROVED"}
                                  onClick={() => handleApprove(d.id)}>
                                  Approve
                                </button>
                                <button className="btn"
                                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}
                                  disabled={d.approvalBadgeStatus === "REJECTED"}
                                  onClick={() => handleReject(d.id)}>
                                  Reject
                                </button>
                                {canUpload && (
                                  <button className="btn"
                                    style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}
                                    onClick={() => handleNewVersion(d.id)}>
                                    + Version
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
      )}
    </div>
  );
}
