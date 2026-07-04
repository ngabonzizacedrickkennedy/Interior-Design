import { useEffect, useState } from "react";
import { getMyWallet, getMyWalletTransactions, deposit, invest } from "../../api/actions/wallet";
import { getMyRequests } from "../../api/actions/requests";
import { PaymentMethodPicker } from "../components/PaymentMethodPicker";
import { useToast } from "../../components/toast/ToastContext";
import "../PortalLayout.css";

export function Account() {
  const { showSuccess, showError } = useToast();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [depositForm, setDepositForm] = useState({ amount: "" });
  const [payment, setPayment] = useState({ method: "Bank Transfer", valid: true });
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
      const updated = await deposit({ amount: Number(depositForm.amount), method: payment.method });
      setWallet(updated);
      setDepositForm({ amount: "" });
      const tx = await getMyWalletTransactions();
      setTransactions(tx);
      showSuccess("Deposit successful!");
    } catch (e) {
      setError(e.message);
      showError(e.message || "Deposit failed. Please try again.");
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
      showSuccess("Investment successful!");
    } catch (e) {
      setError(e.message);
      showError(e.message || "Investment failed. Please try again.");
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
          <div className="field field--full" style={{ maxWidth: 220, marginBottom: "1.25rem" }}>
            <label>Amount</label>
            <input type="number" min="0" step="0.01" required value={depositForm.amount}
              onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })} />
          </div>

          <PaymentMethodPicker onChange={setPayment} />

          <button type="submit" className="btn btn-solid" disabled={depositSaving || !payment.valid}>
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
                      {r.requestName || r.roomType || "Request"} — {Number(r.budgetLimit || 0).toLocaleString()}
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
