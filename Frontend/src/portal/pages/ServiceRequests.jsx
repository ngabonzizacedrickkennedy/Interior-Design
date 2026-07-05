import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import * as requestActions from "../../api/actions/requests";
import { getAllClients, getClientByUser } from "../../api/actions/clients";
import "../PortalLayout.css";

const STATUSES = ["NEW", "IN_REVIEW", "APPROVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const BADGE_MAP = {
  NEW: "new", IN_REVIEW: "review", APPROVED: "approved",
  IN_PROGRESS: "progress", COMPLETED: "completed", CANCELLED: "cancelled",
};

export function ServiceRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [form, setForm]         = useState({ clientId: "", requestDetails: "", budgetLimit: "" });

  const isClient = user?.role === "CLIENT";
  const canEdit  = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        if (isClient) {
          // CLIENT sees only their own requests
          const clientProfile = await getClientByUser(user.userId);
          const reqs = await requestActions.getRequestsByClient(clientProfile.id);
          setRequests(reqs);
        } else {
          // Staff / PM / Admin see everything
          const [reqs, cls] = await Promise.all([
            requestActions.getAllRequests(),
            user?.role !== "STAFF" ? getAllClients() : Promise.resolve([]),
          ]);
          setRequests(reqs);
          setClients(cls);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const created = await requestActions.createRequest({
        clientId:       Number(form.clientId),
        requestDetails: form.requestDetails,
        budgetLimit:    Number(form.budgetLimit),
      });
      setRequests((r) => [...r, created]);
      setForm({ clientId: "", requestDetails: "", budgetLimit: "" });
    } catch (e) { setError(e.message); }
  }

  async function handleStatusChange(id, executionStatus) {
    try {
      const updated = await requestActions.updateRequestStatus(id, executionStatus);
      setRequests((r) => r.map((x) => x.id === id ? updated : x));
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      <h1 className="portal-page-title">
        {isClient ? "My Service Requests" : "Service Requests"}
      </h1>
      <p className="portal-page-sub">
        {isClient
          ? "View and track the status of your submitted requests."
          : "Manage and review all incoming client service requests."}
      </p>

      {error && <p className="portal-error">{error}</p>}

      {canEdit && (
        <section className="portal-section">
          <h2 className="portal-section__title">Submit New Request</h2>
          <form onSubmit={handleCreate}>
            <div className="portal-form-row">
              <div className="field">
                <label>Client</label>
                <select value={form.clientId} required
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.contactName}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Budget ($)</label>
                <input type="number" min="0" value={form.budgetLimit} required
                  onChange={(e) => setForm({ ...form, budgetLimit: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Request details</label>
                <textarea value={form.requestDetails} required
                  onChange={(e) => setForm({ ...form, requestDetails: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-solid">Submit Request</button>
          </form>
        </section>
      )}

      <section className="portal-section">
        <h2 className="portal-section__title">Request Records</h2>
        {loading ? <p className="portal-loading">Loading...</p> : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  {!isClient && <th>Client</th>}
                  <th>Request Name</th>
                  <th>Budget ($)</th><th>Status</th>
                  {canEdit && <th>Update Status</th>}
                  {!isClient && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    {!isClient && <td>{r.clientName}</td>}
                    <td style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.requestName || r.roomType || "Untitled request"}
                    </td>
                    <td>${r.budgetLimit?.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge--${BADGE_MAP[r.executionStatus] || "draft"}`}>
                        {r.executionStatus?.replace("_", " ")}
                      </span>
                    </td>
                    {canEdit && (
                      <td>
                        <select value={r.executionStatus} style={{ fontSize: "0.8rem" }}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}>
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                          ))}
                        </select>
                      </td>
                    )}
                    {!isClient && (
                      <td>
                        <button type="button" className="btn" style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
                          onClick={() => navigate(`/portal/requests/${r.id}`)}>
                          View
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {!requests.length && (
                  <tr>
                    <td colSpan={isClient ? 3 : 4 + (canEdit ? 1 : 0) + 1} className="portal-empty">
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
