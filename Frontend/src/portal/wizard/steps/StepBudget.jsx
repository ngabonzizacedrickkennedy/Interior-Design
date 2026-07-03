export function StepBudget({ state, setField }) {
  return (
    <div>
      <h2 className="portal-section__title">Budget Range</h2>
      <p className="portal-page-sub">
        Designers tailor furniture and material suggestions completely differently for a $500
        budget versus a $5,000 one — give us your real range.
      </p>
      <div className="portal-form-row">
        <div className="field">
          <label>Minimum budget</label>
          <input type="number" min="0" value={state.fields.budgetMin}
            onChange={(e) => setField("budgetMin", e.target.value)} />
        </div>
        <div className="field">
          <label>Maximum budget</label>
          <input type="number" min="0" value={state.fields.budgetMax}
            onChange={(e) => setField("budgetMax", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
