import { TIMELINE_LABELS } from "../../utils/requestOptions";

export function StepTimeline({ state, setField }) {
  return (
    <div>
      <h2 className="portal-section__title">Timeline</h2>
      <p className="portal-page-sub">
        Are you renovating soon, or just planning ahead? This changes how realistic versus
        aspirational our suggestions can be.
      </p>

      <div className="field__radio-group">
        {Object.entries(TIMELINE_LABELS).map(([value, label]) => (
          <label key={value} className="field__radio-option">
            <input
              type="radio"
              name="timeline"
              value={value}
              checked={state.fields.timeline === value}
              onChange={() => setField("timeline", value)}
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
