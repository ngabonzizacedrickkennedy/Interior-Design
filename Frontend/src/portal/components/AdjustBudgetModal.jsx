import { useState } from "react";

export function AdjustBudgetModal({ defaultAmount, onCancel, onSubmit }) {
  const [amount, setAmount] = useState(defaultAmount ? String(defaultAmount) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(Number(amount));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="portal-section__title">Adjust Your Budget</h2>
        {error && <p className="portal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="field field--full">
            <label>New budget amount</label>
            <input type="number" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="portal-actions" style={{ marginTop: "1rem" }}>
            <button type="button" className="btn" onClick={onCancel} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-solid" disabled={saving}>
              {saving ? "Saving..." : "Save New Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
