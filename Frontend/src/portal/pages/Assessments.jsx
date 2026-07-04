import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMyRequests } from "../../api/actions/requests";
import { triggerAssessment, remainAssessment } from "../../api/actions/assessments";
import { deriveDisplayStatus } from "../utils/requestStatus";
import { buildAssessmentSpeech, speak } from "../utils/speech";
import { AssessmentResultPanel } from "../components/AssessmentResultPanel";
import "../PortalLayout.css";
import "./assessments.css";

export function Assessments() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("not_assessed");
  const [assessingId, setAssessingId] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (searchParams.get("requestId")) setTab("not_assessed");
  }, [searchParams]);

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

  async function handleAssess(id) {
    setAssessingId(id);
    setError(null);
    try {
      const assessment = await triggerAssessment(id);
      await load();
      setTab("assessed");
      speak(buildAssessmentSpeech(assessment));
    } catch (e) {
      setError(e.message);
    } finally {
      setAssessingId(null);
    }
  }

  async function handleRemain(requestId, assessmentId) {
    try {
      await remainAssessment(requestId, assessmentId);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const notAssessed = requests.filter((r) => deriveDisplayStatus(r) === "NOT_ASSESSED");
  const assessed = requests.filter((r) => ["ASSESSED", "INVESTED"].includes(deriveDisplayStatus(r)));
  const highlightId = Number(searchParams.get("requestId")) || null;

  return (
    <div>
      <h1 className="portal-page-title">Assessments</h1>
      <p className="portal-page-sub">
        Our AI already analyzed your uploaded photos, references, and description when you
        submitted this request, and sent its estimate straight to our team. Assess again any
        time to review the recommendation.
      </p>

      {error && <p className="portal-error">{error}</p>}

      <div className="gallery-tabs" style={{ marginBottom: "1.5rem" }}>
        <button type="button" className={"gallery-tab" + (tab === "not_assessed" ? " is-active" : "")}
          onClick={() => setTab("not_assessed")}>
          Not Yet Assessed ({notAssessed.length})
        </button>
        <button type="button" className={"gallery-tab" + (tab === "assessed" ? " is-active" : "")}
          onClick={() => setTab("assessed")}>
          Assessed ({assessed.length})
        </button>
      </div>

      {loading ? (
        <p className="portal-loading">Loading...</p>
      ) : tab === "not_assessed" ? (
        notAssessed.length === 0 ? (
          <p className="portal-empty">Everything is assessed. Nice.</p>
        ) : (
          notAssessed.map((r) => (
            <section
              key={r.id}
              className={"portal-section" + (r.id === highlightId ? " is-highlighted" : "")}
            >
              <h2 className="portal-section__title">{r.requestName || r.roomType || "Request"}</h2>
              <p className="portal-page-sub" style={{ marginBottom: "1rem" }}>
                {(r.requestDetails || "No description yet.").slice(0, 160)}
              </p>
              <button
                type="button"
                className="btn btn-solid"
                disabled={assessingId === r.id}
                onClick={() => handleAssess(r.id)}
              >
                {assessingId === r.id ? "Analyzing... this can take a couple of minutes" : "Assess"}
              </button>
            </section>
          ))
        )
      ) : assessed.length === 0 ? (
        <p className="portal-empty">No assessed requests yet.</p>
      ) : (
        assessed.map((r) => (
          <section key={r.id} className="portal-section">
            <h2 className="portal-section__title">{r.requestName || r.roomType || "Request"}</h2>
            <AssessmentResultPanel
              assessment={r.latestAssessment}
              onRemain={() => handleRemain(r.id, r.latestAssessment.id)}
            />
          </section>
        ))
      )}
    </div>
  );
}
