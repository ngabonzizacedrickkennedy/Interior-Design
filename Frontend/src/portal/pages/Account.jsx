import { useEffect, useState } from "react";
import { getMyWallet, getMyWalletTransactions, deposit, invest } from "../../api/actions/wallet";
import { getMyRequests } from "../../api/actions/requests";
import "../PortalLayout.css";

const DEPOSIT_METHODS = ["Bank", "Visa", "Other"];

export function Account() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [depositForm, setDepositForm] = useState({ amount: "", method: "Bank" });
  const [depositSaving, setDepositSaving] = useState(false);

  const [investForm, setInvestForm] = useState({ requestId: "", amount: "" });
  const [investSaving, setInvestSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const w = await getMyWallet();
      const [tx, reqs] = await Promise.all([
        getMyWalletTransactions(),
        getMyRequests(),
      ]);
      setWallet(w);
      setTransactions(tx);
      setRequests(reqs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const investableRequests = requests.filter(
    (r) => r.executionStatus !== "DRAFT" && r.investmentStatus !== "INVESTED"
  );

  function handleSelectRequest(requestId) {
    const selected = requests.find((r) => String(r.id) === requestId);
    setInvestForm({
      requestId,
      amount: selected ? String(selected.budgetLimit || "") : "",
    });
  }

  async function handleDeposit(e) {
    e.preventDefault();
    setDepositSaving(true);
    setError(null);
    try {
      const updated = await deposit({ amount: Number(depositForm.amount), method: depositForm.method });
      setWallet(updated);
      setDepositForm({ amount: "", method: "Bank" });
      const tx = await getMyWalletTransactions();
      setTransactions(tx);
    } catch (e) {
      setError(e.message);
    } finally {
      setDepositSaving(false);
    }
  }

  async function handleInvest(e) {
    e.preventDefault();
    setInvestSaving(true);
    setError(null);
    try {
      const updated = await invest({ requestId: Number(investForm.requestId), amount: Number(investForm.amount) });
      setWallet(updated);
      setInvestForm({ requestId: "", amount: "" });
      const [tx, reqs] = await Promise.all([getMyWalletTransactions(), getMyRequests()]);
      setTransactions(tx);
      setRequests(reqs);
    } catch (e) {
      setError(e.message);
    } finally {
      setInvestSaving(false);
    }
  }

  const investAmountTooHigh =
    wallet && investForm.amount && Number(investForm.amount) > Number(wallet.balance);

  if (loading) return <p className="portal-loading">Loading...</p>;

  return (
    <div>
      <h1 className="portal-page-title">Account</h1>
      <p className="portal-page-sub">Deposit funds and invest them into one of your requests.</p>

      {error && <p className="portal-error">{error}</p>}

      <div className="portal-stat-grid" style={{ marginBottom: "2rem" }}>
        <div className="portal-stat-card">
          <div className="portal-stat-card__label">Wallet Balance</div>
          <div className="portal-stat-card__value portal-stat-card__value--accent">
            {Number(wallet?.balance || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <section className="portal-section">
        <h2 className="portal-section__title">Deposit Funds</h2>
        <form onSubmit={handleDeposit}>
          <div className="portal-form-row">
            <div className="field">
              <label>Amount</label>
              <input type="number" min="0" step="0.01" required value={depositForm.amount}
                onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })} />
            </div>
            <div className="field">
              <label>Method</label>
              <select value={depositForm.method}
                onChange={(e) => setDepositForm({ ...depositForm, method: e.target.value })}>
                {DEPOSIT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-solid" disabled={depositSaving}>
            {depositSaving ? "Depositing..." : "Deposit"}
          </button>
        </form>
      </section>

      <section className="portal-section">
        <h2 className="portal-section__title">Invest in a Request</h2>
        {investableRequests.length === 0 ? (
          <p className="portal-empty">No submitted requests are available to invest in right now.</p>
        ) : (
          <form onSubmit={handleInvest}>
            <div className="portal-form-row">
              <div className="field">
                <label>Request</label>
                <select required value={investForm.requestId}
                  onChange={(e) => handleSelectRequest(e.target.value)}>
                  <option value="">Select a request</option>
                  {investableRequests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roomType || "Request"} #{r.id} — {Number(r.budgetLimit || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Amount</label>
                <input type="number" min="0" step="0.01" required value={investForm.amount}
                  onChange={(e) => setInvestForm({ ...investForm, amount: e.target.value })} />
              </div>
            </div>
            {investAmountTooHigh && (
              <p className="portal-error">This amount exceeds your current wallet balance.</p>
            )}
            <button
              type="submit"
              className="btn btn-solid"
              disabled={investSaving || !investForm.requestId || investAmountTooHigh}
            >
              {investSaving ? "Investing..." : "Invest"}
            </button>
          </form>
        )}
      </section>

      <section className="portal-section">
        <h2 className="portal-section__title">Transaction History</h2>
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Amount</th><th>Method / Request</th><th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge--${t.type === "DEPOSIT" ? "approved" : "progress"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>{Number(t.amount).toLocaleString()}</td>
                  <td>{t.type === "DEPOSIT" ? t.method : `Request #${t.relatedRequestId}`}</td>
                  <td>{Number(t.balanceAfter).toLocaleString()}</td>
                </tr>
              ))}
              {!transactions.length && (
                <tr><td colSpan={5} className="portal-empty">No transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
