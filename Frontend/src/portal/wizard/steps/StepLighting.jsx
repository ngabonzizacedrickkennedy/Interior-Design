import { WINDOW_DIRECTION_LABELS, LIGHT_LEVEL_LABELS } from "../../utils/requestOptions";

export function StepLighting({ state, setField }) {
  return (
    <div>
      <h2 className="portal-section__title">Lighting Conditions</h2>
      <p className="portal-page-sub">
        Which direction windows face, how much natural light the room gets, and what artificial
        lighting currently exists — this affects color and material choices significantly.
      </p>

      <div className="portal-form-row">
        <div className="field">
          <label>Window direction</label>
          <select value={state.fields.windowDirection}
            onChange={(e) => setField("windowDirection", e.target.value)}>
            <option value="">Select...</option>
            {Object.entries(WINDOW_DIRECTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Natural light level</label>
          <select value={state.fields.naturalLightLevel}
            onChange={(e) => setField("naturalLightLevel", e.target.value)}>
            <option value="">Select...</option>
            {Object.entries(LIGHT_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field field--full">
        <label>Existing artificial lighting</label>
        <textarea
          placeholder="e.g. One ceiling fixture, two floor lamps, no dimmer switches..."
          value={state.fields.artificialLightingNotes}
          onChange={(e) => setField("artificialLightingNotes", e.target.value)}
        />
      </div>
    </div>
  );
}
