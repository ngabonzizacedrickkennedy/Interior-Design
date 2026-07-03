export function StepSpaceUsage({ state, setField }) {
  return (
    <div>
      <h2 className="portal-section__title">How You Use the Space</h2>
      <p className="portal-page-sub">
        Function shapes layout more than aesthetics do — tell us how this room actually gets used.
      </p>

      <div className="field__radio-group">
        <label className="field__radio-option">
          <input type="checkbox" checked={state.fields.worksFromHome}
            onChange={(e) => setField("worksFromHome", e.target.checked)} />
          I work from home here
        </label>
        <label className="field__radio-option">
          <input type="checkbox" checked={state.fields.entertainsOften}
            onChange={(e) => setField("entertainsOften", e.target.checked)} />
          I entertain guests often
        </label>
        <label className="field__radio-option">
          <input type="checkbox" checked={state.fields.hasKids}
            onChange={(e) => setField("hasKids", e.target.checked)} />
          I have kids
        </label>
        <label className="field__radio-option">
          <input type="checkbox" checked={state.fields.hasPets}
            onChange={(e) => setField("hasPets", e.target.checked)} />
          I have pets
        </label>
      </div>

      <div className="field field--full" style={{ marginTop: "1.5rem" }}>
        <label>Specific storage needs</label>
        <textarea
          placeholder="e.g. Need storage for board games, winter coats, home office supplies..."
          value={state.fields.storageNeeds}
          onChange={(e) => setField("storageNeeds", e.target.value)}
        />
      </div>
    </div>
  );
}
