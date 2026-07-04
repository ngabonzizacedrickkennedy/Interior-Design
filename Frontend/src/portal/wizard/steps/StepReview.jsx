import {
  STYLE_PREFERENCE_LABELS,
  TIMELINE_LABELS,
  WINDOW_DIRECTION_LABELS,
  LIGHT_LEVEL_LABELS,
} from "../../utils/requestOptions";

export function StepReview({ state }) {
  const f = state.fields;
  const countByCategory = (category) => state.attachments.filter((a) => a.category === category).length;

  return (
    <div>
      <h2 className="portal-section__title">Review Your Request</h2>
      <p className="portal-page-sub">
        Double-check everything below, then submit.
      </p>

      <div className="portal-detail-panel">
        <dl>
          <dt>Request name</dt><dd>{f.requestName || "—"}</dd>
          <dt>Room type</dt><dd>{f.roomType || "—"}</dd>
          <dt>Description</dt><dd>{f.requestDetails || "—"}</dd>
          <dt>Dimensions</dt>
          <dd>{f.lengthMeters || "?"}m x {f.widthMeters || "?"}m, ceiling {f.ceilingHeightMeters || "?"}m</dd>
          <dt>Budget range</dt><dd>{f.budgetMin || "?"} – {f.budgetMax || "?"}</dd>
          <dt>Style preferences</dt>
          <dd>{f.styleTags.length ? f.styleTags.map((t) => STYLE_PREFERENCE_LABELS[t] || t).join(", ") : "—"}</dd>
          <dt>Space usage</dt>
          <dd>
            {[
              f.worksFromHome && "Works from home",
              f.entertainsOften && "Entertains often",
              f.hasKids && "Has kids",
              f.hasPets && "Has pets",
            ].filter(Boolean).join(", ") || "—"}
          </dd>
          <dt>Lighting</dt>
          <dd>
            {WINDOW_DIRECTION_LABELS[f.windowDirection] || "—"} facing,{" "}
            {LIGHT_LEVEL_LABELS[f.naturalLightLevel] || "—"} natural light
          </dd>
          <dt>Timeline</dt><dd>{TIMELINE_LABELS[f.timeline] || "—"}</dd>
          <dt>Avoid</dt><dd>{f.avoidNotes || "—"}</dd>
          <dt>Location</dt><dd>{f.sourcingLocation || "—"}</dd>
          <dt>Photos uploaded</dt>
          <dd>
            {countByCategory("ROOM_PHOTO")} room photo(s), {countByCategory("FLOOR_PLAN")} floor
            plan/sketch, {countByCategory("STYLE_REFERENCE")} style reference(s),{" "}
            {countByCategory("EXISTING_FURNITURE")} existing furniture photo(s)
          </dd>
        </dl>
      </div>
    </div>
  );
}
