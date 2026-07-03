import { WizardImageUploader } from "../WizardImageUploader";
import { STYLE_PREFERENCE_LABELS } from "../../utils/requestOptions";

export function StepStylePreferences({ state, setField, dispatch, requestId }) {
  const attachments = state.attachments.filter((a) => a.category === "STYLE_REFERENCE");

  function toggleTag(tag) {
    const tags = state.fields.styleTags.includes(tag)
      ? state.fields.styleTags.filter((t) => t !== tag)
      : [...state.fields.styleTags, tag];
    setField("styleTags", tags);
  }

  return (
    <div>
      <h2 className="portal-section__title">Style Preferences</h2>
      <p className="portal-page-sub">
        Pick any named styles that match your taste, and upload reference photos (Pinterest
        boards, Instagram saves, magazine clippings) of looks you like.
      </p>

      <div className="wizard-tag-grid">
        {Object.entries(STYLE_PREFERENCE_LABELS).map(([value, label]) => (
          <label
            key={value}
            className={"wizard-tag" + (state.fields.styleTags.includes(value) ? " is-selected" : "")}
          >
            <input
              type="checkbox"
              checked={state.fields.styleTags.includes(value)}
              onChange={() => toggleTag(value)}
              hidden
            />
            {label}
          </label>
        ))}
      </div>

      <WizardImageUploader
        requestId={requestId}
        category="STYLE_REFERENCE"
        attachments={attachments}
        onAdd={(a) => dispatch({ type: "ADD_ATTACHMENT", attachment: a })}
        onRemove={(id) => dispatch({ type: "REMOVE_ATTACHMENT", attachmentId: id })}
        onUpdateNote={(id, note) => dispatch({ type: "UPDATE_ATTACHMENT_NOTE", attachmentId: id, note })}
      />
    </div>
  );
}
