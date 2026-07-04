import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRequestById } from "../../api/actions/requests";
import { deriveDisplayStatus, DISPLAY_STATUS_LABELS, DISPLAY_STATUS_BADGE } from "../utils/requestStatus";
import {
  ATTACHMENT_CATEGORIES,
  STYLE_PREFERENCE_LABELS,
  TIMELINE_LABELS,
  WINDOW_DIRECTION_LABELS,
  LIGHT_LEVEL_LABELS,
} from "../utils/requestOptions";
import "../PortalLayout.css";
import "./dashboard.css";

const CATEGORY_ORDER = ["ROOM_PHOTO", "FLOOR_PLAN", "STYLE_REFERENCE", "EXISTING_FURNITURE"];

export function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ROOM_PHOTO");

  useEffect(() => {
    async function load() {
      try {
        const data = await getRequestById(id);
        setRequest(data);
        const firstNonEmpty = CATEGORY_ORDER.find(
          (c) => data.attachments?.some((a) => a.category === c)
        );
        if (firstNonEmpty) setActiveCategory(firstNonEmpty);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="portal-loading">Loading...</p>;
  if (error) return <p className="portal-error">{error}</p>;
  if (!request) return null;

  const displayStatus = deriveDisplayStatus(request);
  const attachmentsInCategory = (request.attachments || []).filter((a) => a.category === activeCategory);

  return (
    <div>
      <Link to="/portal/dashboard" className="btn" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
        ← Back to Dashboard
      </Link>

      <h1 className="portal-page-title">
        {request.requestName || request.roomType || "Request"}
      </h1>
      <span className={`badge badge--${DISPLAY_STATUS_BADGE[displayStatus]}`}>
        {DISPLAY_STATUS_LABELS[displayStatus]}
      </span>

      <section className="portal-section" style={{ marginTop: "1.5rem" }}>
        <h2 className="portal-section__title">Request Details</h2>
        <div className="portal-detail-panel">
          <dl>
            <dt>Description</dt><dd>{request.requestDetails || "—"}</dd>
            <dt>Dimensions</dt>
            <dd>{request.lengthMeters || "?"}m x {request.widthMeters || "?"}m, ceiling {request.ceilingHeightMeters || "?"}m</dd>
            <dt>Spatial notes</dt><dd>{request.spatialNotes || "—"}</dd>
            <dt>Budget range</dt>
            <dd>{Number(request.budgetMin || 0).toLocaleString()} – {Number(request.budgetMax || 0).toLocaleString()}</dd>
            <dt>Current working budget</dt><dd>{Number(request.budgetLimit || 0).toLocaleString()}</dd>
            <dt>Style preferences</dt>
            <dd>{(request.styleTags || []).map((t) => STYLE_PREFERENCE_LABELS[t] || t).join(", ") || "—"}</dd>
            <dt>Space usage</dt>
            <dd>
              {[
                request.worksFromHome && "Works from home",
                request.entertainsOften && "Entertains often",
                request.hasKids && "Has kids",
                request.hasPets && "Has pets",
              ].filter(Boolean).join(", ") || "—"}
              {request.storageNeeds ? ` — ${request.storageNeeds}` : ""}
            </dd>
            <dt>Lighting</dt>
            <dd>
              {WINDOW_DIRECTION_LABELS[request.windowDirection] || "—"} facing,{" "}
              {LIGHT_LEVEL_LABELS[request.naturalLightLevel] || "—"} natural light
              {request.artificialLightingNotes ? ` — ${request.artificialLightingNotes}` : ""}
            </dd>
            <dt>Timeline</dt><dd>{TIMELINE_LABELS[request.timeline] || "—"}</dd>
            <dt>Avoid</dt><dd>{request.avoidNotes || "—"}</dd>
            <dt>Location</dt><dd>{request.sourcingLocation || "—"}</dd>
            {request.investmentStatus === "INVESTED" && (
              <>
                <dt>Invested amount</dt><dd>{Number(request.investedAmount || 0).toLocaleString()}</dd>
              </>
            )}
          </dl>
        </div>
      </section>

      {request.latestAssessment && (
        <section className="portal-section">
          <h2 className="portal-section__title">Latest AI Assessment</h2>
          <div className="portal-detail-panel">
            <dl>
              <dt>Verdict</dt><dd>{request.latestAssessment.verdict}</dd>
              <dt>Recommended budget</dt>
              <dd>
                {Number(request.latestAssessment.recommendedBudgetMin || 0).toLocaleString()} –{" "}
                {Number(request.latestAssessment.recommendedBudgetMax || 0).toLocaleString()}
              </dd>
              <dt>Reasoning</dt><dd>{request.latestAssessment.reasoning}</dd>
              <dt>Style summary</dt><dd>{request.latestAssessment.styleSummary}</dd>
              <dt>Room condition</dt><dd>{request.latestAssessment.roomConditionSummary}</dd>
            </dl>
          </div>
        </section>
      )}

      <section className="portal-section">
        <h2 className="portal-section__title">Uploaded Images</h2>
        <div className="gallery-tabs">
          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              type="button"
              className={"gallery-tab" + (activeCategory === category ? " is-active" : "")}
              onClick={() => setActiveCategory(category)}
            >
              {ATTACHMENT_CATEGORIES[category]} ({(request.attachments || []).filter((a) => a.category === category).length})
            </button>
          ))}
        </div>

        {attachmentsInCategory.length === 0 ? (
          <p className="portal-empty">No images in this category.</p>
        ) : (
          <div className="gallery-grid">
            {attachmentsInCategory.map((a) => (
              <div key={a.id} className="gallery-item">
                <img src={a.url} alt={a.originalFileName || ""} />
                {a.note && <div className="gallery-item__note">{a.note}</div>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
