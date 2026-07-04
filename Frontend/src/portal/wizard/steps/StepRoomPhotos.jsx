import { WizardImageUploader } from "../WizardImageUploader";
import { REQUEST_NAME_OPTIONS } from "../../utils/requestOptions";

export function StepRoomPhotos({ state, setField, dispatch, requestId }) {
  const attachments = state.attachments.filter((a) => a.category === "ROOM_PHOTO");

  return (
    <div>
      <h2 className="portal-section__title">Room Photos</h2>
      <p className="portal-page-sub">
        Upload multiple angles of the room in daylight if possible, showing the full space
        including corners and the ceiling.
      </p>

      <div className="field field--full">
        <label>Request name</label>
        <select
          value={state.fields.requestName}
          onChange={(e) => setField("requestName", e.target.value)}
        >
          <option value="">Select a request type</option>
          {REQUEST_NAME_OPTIONS.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="field field--full">
        <label>Room type</label>
        <input
          type="text"
          placeholder="e.g. Living Room, Master Bedroom"
          value={state.fields.roomType}
          onChange={(e) => setField("roomType", e.target.value)}
        />
      </div>

      <div className="field field--full">
        <label>Describe your request</label>
        <textarea
          placeholder="Tell us what you'd like to change about this space..."
          value={state.fields.requestDetails}
          onChange={(e) => setField("requestDetails", e.target.value)}
        />
      </div>

      <WizardImageUploader
        requestId={requestId}
        category="ROOM_PHOTO"
        attachments={attachments}
        onAdd={(a) => dispatch({ type: "ADD_ATTACHMENT", attachment: a })}
        onRemove={(id) => dispatch({ type: "REMOVE_ATTACHMENT", attachmentId: id })}
        onUpdateNote={(id, note) => dispatch({ type: "UPDATE_ATTACHMENT_NOTE", attachmentId: id, note })}
      />
    </div>
  );
}
