import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests, withdrawRequest } from "../../api/actions/requests";
import { StatTile } from "../components/StatTile";
import { RequestCard } from "../components/RequestCard";
import { deriveDisplayStatus } from "../utils/requestStatus";
import { clearWizardProgress } from "../wizard/wizardStepStorage";
import "../PortalLayout.css";
import "./dashboard.css";

export function ClientDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getMyRequests();
      setRequests(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(id) {
    if (!confirm("Withdraw this request? This cannot be undone.")) return;
    try {
      await withdrawRequest(id);
      clearWizardProgress(id);
      setRequests((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  const total = requests.length;
  const assessed = requests.filter((r) => ["ASSESSED", "INVESTED"].includes(deriveDisplayStatus(r))).length;
  const pending = requests.filter((r) => deriveDisplayStatus(r) === "NOT_ASSESSED").length;
  const invested = requests.filter((r) => deriveDisplayStatus(r) === "INVESTED").length;

  return (
    <div>
      <h1 className="portal-page-title">Your Dashboard</h1>
      <p className="portal-page-sub">
        Track every interior design request you've submitted, from first draft to funded project.
      </p>

      {error && <p className="portal-error">{error}</p>}

      <div className="portal-stat-grid" style={{ marginBottom: "2rem" }}>
        <StatTile label="Total Submitted" value={total} />
        <StatTile label="Assessed" value={assessed} accent />
        <StatTile label="Pending Assessment" value={pending} />
        <StatTile label="Invested" value={invested} accent />
      </div>

      <div className="portal-actions" style={{ marginBottom: "1.5rem" }}>
        <Link to="/portal/requests/new" className="btn btn-solid">+ New Request</Link>
      </div>

      {loading ? (
        <p className="portal-loading">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="portal-empty">You haven't submitted any requests yet.</p>
      ) : (
        <div className="request-card-grid">
          {requests.map((r) => (
            <RequestCard key={r.id} request={r} onWithdraw={handleWithdraw} />
          ))}
        </div>
      )}
    </div>
  );
}
