import { useNavigate, Link } from "react-router-dom";
import { deriveDisplayStatus, DISPLAY_STATUS_LABELS, DISPLAY_STATUS_BADGE } from "../utils/requestStatus";
import { TIMELINE_LABELS } from "../utils/requestOptions";

export function RequestCard({ request, onWithdraw }) {
  const navigate = useNavigate();
  const attachments = request.attachments || [];
  const roomPhotos = attachments.filter((a) => a.category === "ROOM_PHOTO");
  const cover = roomPhotos[0] || attachments[0] || null;
  const strip = attachments.filter((a) => a.id !== cover?.id).slice(0, 3);
  const overflowCount = attachments.length - 1 - strip.length;

  const displayStatus = deriveDisplayStatus(request);
  const isDraft = request.executionStatus === "DRAFT";
  const canWithdraw = (request.executionStatus === "DRAFT" || request.executionStatus === "NEW")
    && request.investmentStatus !== "INVESTED";

  const title = [request.roomType, request.requestDetails?.split("\n")[0]].filter(Boolean).join(" — ") || "Untitled request";

  function goToDetail() {
    navigate(`/portal/requests/${request.id}`);
  }

  return (
    <div className="request-card">
      <div className="request-card__media" onClick={goToDetail} role="button" tabIndex={0}>
        {cover ? (
          <>
            <img className="request-card__cover" src={cover.url} alt="" />
            {strip.length > 0 && (
              <div className="request-card__strip">
                {strip.map((a, idx) => (
                  <div key={a.id} className="request-card__strip-item">
                    <img src={a.url} alt="" />
                    {idx === strip.length - 1 && overflowCount > 0 && (
                      <div className="request-card__overflow">+{overflowCount}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="request-card__cover request-card__cover--empty">No photos yet</div>
        )}
      </div>

      <div className="request-card__body">
        <span className={`badge badge--${DISPLAY_STATUS_BADGE[displayStatus]}`}>
          {DISPLAY_STATUS_LABELS[displayStatus]}
        </span>
        {request.requestName && (
          <span className="request-card__id">{request.requestName}</span>
        )}

        <p className="request-card__title">{title}</p>

        <div className="request-card__stats">
          <div className="request-card__stat">
            <span className="request-card__stat-label">Budget</span>
            <span className="request-card__stat-value">
              {request.budgetMin || request.budgetMax
                ? `${Number(request.budgetMin || 0).toLocaleString()} – ${Number(request.budgetMax || 0).toLocaleString()}`
                : Number(request.budgetLimit || 0).toLocaleString()}
            </span>
          </div>
          <div className="request-card__stat">
            <span className="request-card__stat-label">Timeline</span>
            <span className="request-card__stat-value">{TIMELINE_LABELS[request.timeline] || "—"}</span>
          </div>
        </div>

        {isDraft && (
          <div className="request-card__hint">
            This request is unfinished — pick up right where you left off.
          </div>
        )}

        {displayStatus === "NOT_ASSESSED" && (
          <div className="request-card__hint">
            AI assessment may still be pending —{" "}
            <Link to={`/portal/assessments?requestId=${request.id}`}>complete it below</Link>
          </div>
        )}

        {displayStatus === "NOT_ASSESSED" && (
          <button
            type="button"
            className="btn btn-solid request-card__assess-btn"
            onClick={() => navigate(`/portal/assessments?requestId=${request.id}`)}
          >
            Complete AI Assessment
          </button>
        )}

        <div className="portal-actions">
          <button type="button" className="btn" onClick={goToDetail}>View</button>
          {isDraft && (
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => navigate(`/portal/requests/new?draftId=${request.id}`)}
            >
              Continue
            </button>
          )}
          {canWithdraw && (
            <button type="button" className="btn request-card__withdraw" onClick={() => onWithdraw(request.id)}>
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
