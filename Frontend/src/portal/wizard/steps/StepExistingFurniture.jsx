import { WizardImageUploader } from "../WizardImageUploader";

export function StepExistingFurniture({ state, dispatch, requestId }) {
  const attachments = state.attachments.filter((a) => a.category === "EXISTING_FURNITURE");

  return (
    <div>
      <h2 className="portal-section__title">Existing Furniture to Keep</h2>
      <p className="portal-page-sub">
        Photos of anything staying (that heirloom cabinet, a couch you just bought) so the
        designer works around it rather than against it. Leave this empty if nothing is staying.
      </p>

      <WizardImageUploader
        requestId={requestId}
        category="EXISTING_FURNITURE"
        attachments={attachments}
        onAdd={(a) => dispatch({ type: "ADD_ATTACHMENT", attachment: a })}
        onRemove={(id) => dispatch({ type: "REMOVE_ATTACHMENT", attachmentId: id })}
        onUpdateNote={(id, note) => dispatch({ type: "UPDATE_ATTACHMENT_NOTE", attachmentId: id, note })}
      />
    </div>
  );
}
