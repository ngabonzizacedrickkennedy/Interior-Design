import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { MailIcon, ArrowLeftIcon } from "./authIcons";
import "./PortalLogin.css";

export function PortalForgotPassword() {
  const { forgotPassword, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    clearError();
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      // error displayed via context
    }
  }

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
          {sent ? (
            <>
              <h2 className="auth-card__title">Check your email</h2>
              <p className="auth-card__sub">
                If an account exists for <strong>{email}</strong>, we've sent
                a link to reset your password. It expires in 30 minutes.
              </p>

              <p className="auth-card__switch">
                <Link to="/portal/login" className="auth-card__link">
                  ← Back to sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-card__title">Forgot your password?</h2>
              <p className="auth-card__sub">
                Enter your email and we'll send you a link to reset it.
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
                {error && <p className="auth-form__error">{error}</p>}

                <div className="auth-field">
                  <label htmlFor="email">Email address</label>
                  <div className="auth-input">
                    <MailIcon />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="auth-form__submit" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>

              <p className="auth-card__switch">
                Remembered it?{" "}
                <Link to="/portal/login" className="auth-card__link">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
