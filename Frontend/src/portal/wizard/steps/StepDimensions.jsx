import { WizardImageUploader } from "../WizardImageUploader";

export function StepDimensions({ state, setField, dispatch, requestId }) {
  const attachments = state.attachments.filter((a) => a.category === "FLOOR_PLAN");

  return (
    <div>
      <h2 className="portal-section__title">Room Dimensions</h2>
      <p className="portal-page-sub">
        Length, width, ceiling height, plus the locations of doors, windows, and fixed features
        (fireplace, built-in shelving, pillars).
      </p>

      <div className="portal-form-row">
        <div className="field">
          <label>Length (meters)</label>
          <input type="number" min="0" step="0.1" value={state.fields.lengthMeters}
            onChange={(e) => setField("lengthMeters", e.target.value)} />
        </div>
        <div className="field">
          <label>Width (meters)</label>
          <input type="number" min="0" step="0.1" value={state.fields.widthMeters}
            onChange={(e) => setField("widthMeters", e.target.value)} />
        </div>
        <div className="field">
          <label>Ceiling height (meters)</label>
          <input type="number" min="0" step="0.1" value={state.fields.ceilingHeightMeters}
            onChange={(e) => setField("ceilingHeightMeters", e.target.value)} />
        </div>
      </div>

      <div className="field field--full">
        <label>Doors, windows, and fixed features</label>
        <textarea
          placeholder="e.g. Door on the north wall, two windows facing east, fireplace on the south wall..."
          value={state.fields.spatialNotes}
          onChange={(e) => setField("spatialNotes", e.target.value)}
        />
      </div>

      <p className="portal-page-sub">Optional: upload a rough sketch or floor plan photo.</p>
      <WizardImageUploader
        requestId={requestId}
        category="FLOOR_PLAN"
        attachments={attachments}
        onAdd={(a) => dispatch({ type: "ADD_ATTACHMENT", attachment: a })}
        onRemove={(id) => dispatch({ type: "REMOVE_ATTACHMENT", attachmentId: id })}
        onUpdateNote={(id, note) => dispatch({ type: "UPDATE_ATTACHMENT_NOTE", attachmentId: id, note })}
      />
    </div>
  );
}
