import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { ROLE_DEFAULT_ROUTE } from "./auth/roles";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon } from "./authIcons";
import { OtpStep } from "./OtpStep";
import "./PortalLogin.css";

export function PortalLogin() {
  const { login, verifyOtp, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToDashboard(role) {
    const route = ROLE_DEFAULT_ROUTE[role] || "/portal/clients";
    navigate(route, { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const result = await login(form.email, form.password);
      if (result.otpRequired) {
        setPendingEmail(result.email);
      } else {
        goToDashboard(result.role);
      }
    } catch {
      // error displayed via context
    }
  }

  async function handleVerify(code) {
    try {
      const user = await verifyOtp(pendingEmail, code);
      goToDashboard(user.role);
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
          {pendingEmail ? (
            <OtpStep
              email={pendingEmail}
              loading={loading}
              error={error}
              onVerify={handleVerify}
              onBack={() => {
                clearError();
                setPendingEmail(null);
              }}
            />
          ) : (
            <>
              <h2 className="auth-card__title">Welcome back</h2>
              <p className="auth-card__sub">Sign in to your Space Design Group account</p>

              <form className="auth-form" onSubmit={handleSubmit}>
                {error && <p className="auth-form__error">{error}</p>}

                <div className="auth-field">
                  <label htmlFor="email">Email address</label>
                  <div className="auth-input">
                    <MailIcon />
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <div className="auth-field__row">
                    <label htmlFor="password">Password</label>
                    <Link to="/portal/forgot-password" className="auth-field__forgot">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="auth-input">
                    <LockIcon />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      autoComplete="current-password"
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

                <button type="submit" className="auth-form__submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="auth-card__switch">
                Don't have an account?{" "}
                <Link to="/portal/register" className="auth-card__link">
                  Create account
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
