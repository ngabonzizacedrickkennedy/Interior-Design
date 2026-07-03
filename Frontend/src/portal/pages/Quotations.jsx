import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import * as quotationActions from "../../api/actions/quotations";
import { getClientByUser } from "../../api/actions/clients";
import { getRequestsByClient } from "../../api/actions/requests";
import "../PortalLayout.css";

const BADGE = {
  DRAFT: "draft", PENDING_APPROVAL: "pending",
  APPROVED: "approved", CHANGE_REQUESTED: "change",
};

export function Quotations() {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [openId, setOpenId]         = useState(null);
  const [newItem, setNewItem]       = useState({ itemDescription: "", baseCost: "" });

  const isClient  = user?.role === "CLIENT";
  const canEdit   = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    async function load() {
      try {
        if (isClient) {
          const profile = await getClientByUser(user.userId);
          const clientRequests = await getRequestsByClient(profile.id);
          const results = await Promise.allSettled(
            clientRequests.map((r) => quotationActions.getQuotationByRequest(r.id))
          );
          setQuotations(
            results.filter((r) => r.status === "fulfilled").map((r) => r.value)
          );
        } else {
          setQuotations(await quotationActions.getAllQuotations());
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  async function addItem(qId) {
    if (!newItem.itemDescription || !newItem.baseCost) return;
    try {
      const updated = await quotationActions.addLineItem(qId, {
        itemDescription: newItem.itemDescription,
        baseCost: Number(newItem.baseCost),
      });
      setQuotations((q) => q.map((x) => x.id === qId ? updated : x));
      setNewItem({ itemDescription: "", baseCost: "" });
    } catch (e) { setError(e.message); }
  }

  async function removeItem(qId, itemId) {
    try {
      const updated = await quotationActions.removeLineItem(qId, itemId);
      setQuotations((q) => q.map((x) => x.id === qId ? updated : x));
    } catch (e) { setError(e.message); }
  }

  async function doAction(qId, action) {
    try {
      const updated = await action(qId);
      setQuotations((q) => q.map((x) => x.id === qId ? updated : x));
    } catch (e) { setError(e.message); }
  }

  const approved = quotations.filter((q) => q.approvalState === "APPROVED").length;

  return (
    <div>
      <h1 className="portal-page-title">{isClient ? "My Quotations" : "Quotations and Proposals"}</h1>
      <p className="portal-page-sub">
        {isClient
          ? "Review your itemised quotations and approve when ready."
          : "Manage quotations, add line items, and track client approvals."}
      </p>

      {!isClient && (
        <div className="portal-role-banner" style={{ marginBottom: "1.75rem" }}>
          <div className="portal-role-banner__text">
            <h2>Quotation Overview</h2>
            <p>Manage pricing, line items, tax calculations, and client approvals.</p>
          </div>
          <div className="portal-role-banner__stats">
            <div className="portal-role-banner__stat">
              <span className="portal-role-banner__stat-value">{quotations.length}</span>
              <span className="portal-role-banner__stat-label">Total</span>
            </div>
            <div className="portal-role-banner__stat">
              <span className="portal-role-banner__stat-value">{approved}</span>
              <span className="portal-role-banner__stat-label">Approved</span>
            </div>
            <div className="portal-role-banner__stat">
              <span className="portal-role-banner__stat-value">{quotations.length - approved}</span>
              <span className="portal-role-banner__stat-label">Pending</span>
            </div>
          </div>
        </div>
      )}

      {error && <p className="portal-error">{error}</p>}
      {loading && <p className="portal-loading">Loading quotations...</p>}

      {!loading && quotations.map((q) => {
        const open = openId === q.id;
        return (
          <section key={q.id} className="portal-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: open ? "1.25rem" : 0 }}>
              <div>
                <h2 className="portal-section__title" style={{ border: "none", marginBottom: "0.4rem" }}>
                  {q.clientName}
                </h2>
                <span className={`badge badge--${BADGE[q.approvalState] || "draft"}`}>
                  {q.approvalState?.replace("_", " ")}
                </span>
                <span style={{ marginLeft: "0.75rem", fontSize: "0.85rem", color: "var(--color-ink-soft)" }}>
                  {q.lineItems?.length || 0} line items &bull; Total: {q.finalTotal?.toLocaleString()} RWF
                </span>
              </div>
              <button className="btn" style={{ fontSize: "0.8rem" }}
                onClick={() => setOpenId(open ? null : q.id)}>
                {open ? "Collapse" : "Expand"}
              </button>
            </div>

            {open && (
              <>
                <div className="portal-table-wrap">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th style={{ textAlign: "right" }}>Cost (RWF)</th>
                        {canEdit && <th style={{ width: 80 }}></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(q.lineItems || []).map((li) => (
                        <tr key={li.id}>
                          <td>{li.itemDescription}</td>
                          <td style={{ textAlign: "right" }}>{li.baseCost?.toLocaleString()}</td>
                          {canEdit && (
                            <td>
                              <button className="btn" style={{ padding: "0.2rem 0.55rem", fontSize: "0.75rem" }}
                                onClick={() => removeItem(q.id, li.id)}>
                                Remove
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style={{ color: "var(--color-ink-soft)", fontSize: "0.85rem" }}>Tax (18%)</td>
                        <td style={{ textAlign: "right" }}>{q.calculatedTax?.toLocaleString()}</td>
                        {canEdit && <td></td>}
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>Total</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "var(--color-accent)", fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
                          {q.finalTotal?.toLocaleString()} RWF
                        </td>
                        {canEdit && <td></td>}
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {canEdit && q.approvalState !== "APPROVED" && (
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                    <input style={{ flex: 2, minWidth: 160 }} placeholder="Line item description"
                      value={newItem.itemDescription}
                      onChange={(e) => setNewItem({ ...newItem, itemDescription: e.target.value })} />
                    <input type="number" style={{ flex: 1, minWidth: 120 }} placeholder="Cost (RWF)"
                      value={newItem.baseCost}
                      onChange={(e) => setNewItem({ ...newItem, baseCost: e.target.value })} />
                    <button className="btn btn-solid" onClick={() => addItem(q.id)}>Add Item</button>
                  </div>
                )}

                <div className="portal-actions" style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--color-line)" }}>
                  {(isClient || canEdit) && (
                    <button className="btn btn-solid"
                      disabled={q.approvalState === "APPROVED"}
                      onClick={() => doAction(q.id, quotationActions.approveQuotation)}>
                      {q.approvalState === "APPROVED" ? "Approved" : "Approve Quotation"}
                    </button>
                  )}
                  {(isClient || canEdit) && (
                    <button className="btn"
                      disabled={q.approvalState === "CHANGE_REQUESTED"}
                      onClick={() => doAction(q.id, quotationActions.requestQuotationChange)}>
                      Request Changes
                    </button>
                  )}
                  {canEdit && q.approvalState === "DRAFT" && (
                    <button className="btn"
                      onClick={() => doAction(q.id, quotationActions.submitQuotation)}>
                      Send to Client
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        );
      })}

      {!loading && !quotations.length && (
        <p className="portal-empty">
          {isClient ? "No quotations have been prepared for you yet." : "No quotations found."}
        </p>
      )}
    </div>
  );
}
