import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { ROLE_DEFAULT_ROUTE } from "./auth/roles";
import { MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon } from "./authIcons";
import { OtpStep } from "./OtpStep";
import { useToast } from "../components/toast/ToastContext";
import "./PortalLogin.css";

const ROLES = [
  { value: "CLIENT", label: "Client" },
  { value: "STAFF",  label: "Designer" },
];

export function PortalRegister() {
  const { register, verifyOtp, loading, error, clearError } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [form, setForm] = useState({
    fullName:        "",
    email:           "",
    password:        "",
    confirmPassword: "",
    role:            "CLIENT",
  });
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);

  function goToDashboard(role) {
    const route = ROLE_DEFAULT_ROUTE[role] || "/portal/requests";
    navigate(route, { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match.");
      showError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      showError("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await register(form.fullName, form.email, form.password, form.role);
      if (result.otpRequired) {
        setPendingEmail(result.email);
      } else {
        showSuccess("Account created successfully!");
        goToDashboard(result.role);
      }
    } catch (err) {
      showError(err.message || "Registration failed. Please try again.");
    }
  }

  async function handleVerify(code) {
    try {
      const user = await verifyOtp(pendingEmail, code);
      showSuccess("Account created successfully!");
      goToDashboard(user.role);
    } catch (err) {
      showError(err.message || "Verification failed. Please try again.");
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
          <h2 className="auth-card__title">Create your account</h2>
          <p className="auth-card__sub">Choose your role to access the right workspace</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {displayError && <p className="auth-form__error">{displayError}</p>}

            <div className="auth-field">
              <label>I am registering as</label>
              <div className="auth-role-group" role="radiogroup" aria-label="I am registering as">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={
                      "auth-role-option" +
                      (form.role === r.value ? " is-selected" : "")
                    }
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                    <span className="auth-role-option__dot" />
                    <span className="auth-role-option__label">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="fullName">Full name</label>
              <div className="auth-input">
                <UserIcon />
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email address</label>
              <div className="auth-input">
                <MailIcon />
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <div className="auth-input">
                <LockIcon />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="new-password"
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
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="auth-input">
                <LockIcon />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-input__toggle"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-form__submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-card__switch">
            Already have an account?{" "}
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
