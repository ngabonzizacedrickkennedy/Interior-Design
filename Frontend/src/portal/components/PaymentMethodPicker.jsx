import { useEffect, useState } from "react";
import { VisaIcon, MastercardIcon, PaypalIcon, BankIcon } from "./paymentIcons";
import "./PaymentMethodPicker.css";

const METHODS = [
  { id: "Visa",           label: "Visa",           Icon: VisaIcon,       kind: "card",   brand: "visa" },
  { id: "Mastercard",     label: "Mastercard",     Icon: MastercardIcon, kind: "card",   brand: "mastercard" },
  { id: "PayPal",         label: "PayPal",         Icon: PaypalIcon,     kind: "paypal" },
  { id: "Bank Transfer",  label: "Bank Transfer",  Icon: BankIcon,       kind: "bank" },
];

function formatCardNumber(digits) {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidFor(method, card, paypalEmail) {
  if (method.kind === "card") {
    const digits = card.number;
    return (
      card.name.trim().length > 1 &&
      digits.length >= 13 && digits.length <= 16 &&
      /^\d{2}\/\d{2}$/.test(card.expiry) &&
      /^\d{3,4}$/.test(card.cvv)
    );
  }
  if (method.kind === "paypal") {
    return /\S+@\S+\.\S+/.test(paypalEmail);
  }
  return true;
}

export function PaymentMethodPicker({ onChange }) {
  const [methodId, setMethodId] = useState(METHODS[3].id);
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [paypalEmail, setPaypalEmail] = useState("");

  const selected = METHODS.find((m) => m.id === methodId);

  useEffect(() => {
    onChange?.({ method: methodId, valid: isValidFor(selected, card, paypalEmail) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodId, card, paypalEmail]);

  return (
    <div className="payment-picker">
      <div className="payment-picker__methods">
        {METHODS.map((m) => (
          <button
            type="button"
            key={m.id}
            className={"payment-picker__method" + (methodId === m.id ? " is-selected" : "")}
            onClick={() => setMethodId(m.id)}
          >
            <m.Icon />
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {selected.kind === "card" && (
        <div className="payment-picker__panel">
          <div className={`payment-card-preview payment-card-preview--${selected.brand}`}>
            <div className="payment-card-preview__chip" />
            <div className="payment-card-preview__number">
              {card.number ? formatCardNumber(card.number) : "•••• •••• •••• ••••"}
            </div>
            <div className="payment-card-preview__row">
              <span>{card.name || "CARD HOLDER"}</span>
              <span>{card.expiry || "MM/YY"}</span>
            </div>
          </div>

          <div className="portal-form-row">
            <div className="field field--full">
              <label>Cardholder name</label>
              <input
                type="text"
                placeholder="As shown on card"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
              />
            </div>
            <div className="field field--full">
              <label>Card number</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(card.number)}
                onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
              />
            </div>
            <div className="field">
              <label>Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
              />
            </div>
            <div className="field">
              <label>CVV</label>
              <input
                type="password"
                inputMode="numeric"
                placeholder="•••"
                maxLength={4}
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              />
            </div>
          </div>
          <p className="payment-picker__note">
            This is a simulated payment step — card details stay on this screen and are never sent anywhere.
          </p>
        </div>
      )}

      {selected.kind === "paypal" && (
        <div className="payment-picker__panel">
          <div className="field field--full">
            <label>PayPal email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
            />
          </div>
        </div>
      )}

      {selected.kind === "bank" && (
        <div className="payment-picker__panel payment-picker__bank-details">
          <div className="payment-picker__bank-row">
            <span>Account name</span>
            <strong>Space Design Group Ltd</strong>
          </div>
          <div className="payment-picker__bank-row">
            <span>Account number</span>
            <strong>•••• •••• 4821</strong>
          </div>
          <div className="payment-picker__bank-row">
            <span>SWIFT / BIC</span>
            <strong>SDGLGB2L</strong>
          </div>
          <p className="payment-picker__note">
            Transfer from your own bank using the details above, then confirm the deposit below —
            funds land in your wallet once received.
          </p>
        </div>
      )}
    </div>
  );
}
