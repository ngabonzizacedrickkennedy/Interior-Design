import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { LockIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon } from "./authIcons";
import "./PortalLogin.css";

export function PortalResetPassword() {
  const { resetPassword, loading, error, clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");
    clearError();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    try {
      await resetPassword(token, password);
      setDone(true);
    } catch {
      // error displayed via context
    }
  }

  const displayError = localError || error;

  return (
    <div className="auth-page">
      <Link to="/" className="auth-home-link">
        <ArrowLeftIcon />
        <span>Home</span>
      </Link>

      <div className="auth-page__panel">
        <div className="auth-page__brand">
          <p className="auth-page__brand-name">Space Design Group</p>
          <p className="auth-page__brand-tag">Client &amp; Design Portal</p>
        </div>

        <div className="auth-page__copy">
          <h1>Manage your projects with confidence.</h1>
          <p>
            Track service requests, quotations, and project progress in one
            place.
          </p>
        </div>

        <p className="auth-page__footnote">
          © {new Date().getFullYear()} Space Design Group · All rights reserved
        </p>
      </div>

      <div className="auth-page__content">
        <div className="auth-card">
          {!token ? (
            <>
              <h2 className="auth-card__title">Invalid reset link</h2>
              <p className="auth-card__sub">
                This link is missing its reset token. Request a new one below.
              </p>
              <p className="auth-card__switch">
                <Link to="/portal/forgot-password" className="auth-card__link">
                  Request a new link
                </Link>
              </p>
            </>
          ) : done ? (
            <>
              <h2 className="auth-card__title">Password updated</h2>
              <p className="auth-card__sub">
                Your password has been reset. You can now sign in with your
                new password.
              </p>
              <p className="auth-card__switch">
                <Link to="/portal/login" className="auth-card__link">
                  ← Back to sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-card__title">Set a new password</h2>
              <p className="auth-card__sub">Choose a new password for your account.</p>

              <form className="auth-form" onSubmit={handleSubmit}>
                {displayError && <p className="auth-form__error">{displayError}</p>}

                <div className="auth-field">
                  <label htmlFor="password">New password</label>
                  <div className="auth-input">
                    <LockIcon />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="auth-input__toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <div className="auth-input">
                    <LockIcon />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button type="submit" className="auth-form__submit" disabled={loading}>
                  {loading ? "Updating..." : "Reset password"}
                </button>
              </form>

              <p className="auth-card__switch">
                <Link to="/portal/login" className="auth-card__link">
                  ← Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
