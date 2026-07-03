export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text, { onStart, onEnd } = {}) {
  if (!isSpeechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

export function buildAssessmentSpeech(assessment) {
  if (!assessment) return "";
  const verdictText =
    assessment.verdict === "SUFFICIENT"
      ? "Good news. Your budget is sufficient for what you're asking for."
      : "Your current budget may not be enough for what you're asking for.";
  const min = Math.round(assessment.recommendedBudgetMin || 0).toLocaleString();
  const max = Math.round(assessment.recommendedBudgetMax || 0).toLocaleString();
  const rangeText = `We recommend a budget between ${min} and ${max}.`;
  return [verdictText, rangeText, assessment.reasoning].filter(Boolean).join(" ");
}
