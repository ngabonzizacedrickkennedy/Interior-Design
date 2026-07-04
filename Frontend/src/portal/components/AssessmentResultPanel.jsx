import { useEffect, useState } from "react";
import { isSpeechSupported, isVoiceMuted, setVoiceMuted, stopSpeaking } from "../utils/speech";

export function AssessmentResultPanel({ assessment, onRemain }) {
  const [muted, setMuted] = useState(isVoiceMuted());

  useEffect(() => () => stopSpeaking(), []);

  if (!assessment) return null;
  const isPendingDecision = assessment.verdict === "INSUFFICIENT" && assessment.status === "PENDING";

  function handleToggleMute() {
    const next = !muted;
    setVoiceMuted(next);
    setMuted(next);
  }

  return (
    <div className="portal-detail-panel">
      {isSpeechSupported() && (
        <button type="button" className="btn assessment-speak-btn" onClick={handleToggleMute}>
          {muted ? "Unmute AI Voice" : "Mute AI Voice"}
        </button>
      )}

      <dl>
        <dt>Verdict</dt>
        <dd>
          <span className={`badge badge--${assessment.verdict === "SUFFICIENT" ? "completed" : "pending"}`}>
            {assessment.verdict === "SUFFICIENT" ? "Budget Sufficient" : "Budget Insufficient"}
          </span>
        </dd>
        <dt>Recommended budget</dt>
        <dd>
          {Number(assessment.recommendedBudgetMin || 0).toLocaleString()} –{" "}
          {Number(assessment.recommendedBudgetMax || 0).toLocaleString()}
        </dd>
        <dt>Reasoning</dt><dd>{assessment.reasoning}</dd>
        <dt>Style summary</dt><dd>{assessment.styleSummary}</dd>
        <dt>Room condition</dt><dd>{assessment.roomConditionSummary}</dd>
      </dl>

      {isPendingDecision && (
        <div className="portal-actions" style={{ marginTop: "1rem" }}>
          <button type="button" className="btn" onClick={onRemain}>Remain</button>
        </div>
      )}
      {assessment.verdict === "INSUFFICIENT" && (
        <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--color-ink-soft)" }}>
          This estimate has been sent to our team, who will follow up with a quotation if your budget needs adjusting.
        </p>
      )}
    </div>
  );
}
