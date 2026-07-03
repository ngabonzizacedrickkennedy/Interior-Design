import { useEffect, useState } from "react";
import { buildAssessmentSpeech, isSpeechSupported, speak, stopSpeaking } from "../utils/speech";

export function AssessmentResultPanel({ assessment, onRemain, onAdjust }) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  if (!assessment) return null;
  const isPendingDecision = assessment.verdict === "INSUFFICIENT" && assessment.status === "PENDING";

  function handleToggleSpeak() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    speak(buildAssessmentSpeech(assessment), {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    });
  }

  return (
    <div className="portal-detail-panel">
      {isSpeechSupported() && (
        <button type="button" className="btn assessment-speak-btn" onClick={handleToggleSpeak}>
          {speaking ? "Stop" : "Listen to Recommendation"}
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
          <button type="button" className="btn btn-solid" onClick={onAdjust}>Adjust Budget</button>
          <button type="button" className="btn" onClick={onRemain}>Remain</button>
        </div>
      )}
    </div>
  );
}
