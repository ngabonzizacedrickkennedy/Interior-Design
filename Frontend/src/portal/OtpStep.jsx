import { useState } from "react";

export function OtpStep({ email, loading, error, onVerify, onBack }) {
  const [code, setCode] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onVerify(code);
  }

  return (
    <>
      <h2 className="auth-card__title">Check your email</h2>
      <p className="auth-card__sub">
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below to
        continue.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="auth-form__error">{error}</p>}

        <div className="auth-field">
          <label htmlFor="otp">Verification code</label>
          <div className="auth-input">
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              autoFocus
            />
          </div>
        </div>

        <button
          type="submit"
          className="auth-form__submit"
          disabled={loading || code.length !== 6}
        >
          {loading ? "Verifying..." : "Verify and continue"}
        </button>
      </form>

      <p className="auth-card__switch">
        <button type="button" className="auth-card__link-btn" onClick={onBack}>
          ← Use a different account
        </button>
      </p>
    </>
  );
}
