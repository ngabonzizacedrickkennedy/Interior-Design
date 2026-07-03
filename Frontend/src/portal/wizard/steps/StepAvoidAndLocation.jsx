export function StepAvoidAndLocation({ state, setField }) {
  return (
    <div>
      <h2 className="portal-section__title">Must-Avoid & Location</h2>
      <p className="portal-page-sub">
        Allergies, personal dislikes, or anything that's a hard no — plus your location so
        suggestions are things you can actually source.
      </p>

      <div className="field field--full">
        <label>Colors/materials to avoid</label>
        <textarea
          placeholder="e.g. No dark wood, avoid red accents, allergic to wool rugs..."
          value={state.fields.avoidNotes}
          onChange={(e) => setField("avoidNotes", e.target.value)}
        />
      </div>

      <div className="field field--full">
        <label>Your location</label>
        <input
          type="text"
          placeholder="e.g. Kigali, Rwanda"
          value={state.fields.sourcingLocation}
          onChange={(e) => setField("sourcingLocation", e.target.value)}
        />
      </div>
    </div>
  );
}
