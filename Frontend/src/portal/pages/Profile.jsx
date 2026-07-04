import { useEffect, useRef, useState } from "react";
import { uploadMyAvatar, updateMyProfile } from "../../api/actions/users";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../../components/toast/ToastContext";
import "../PortalLayout.css";

const ROLE_LABELS = {
  CLIENT:          "Client",
  STAFF:           "Designer",
  PROJECT_MANAGER: "Project Manager",
  ADMIN:           "Administrator",
};

function initialsOf(text) {
  if (!text) return "?";
  return text.trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function Profile() {
  const { user, patchUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user?.fullName]);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAvatarUploading(true);
    setError(null);
    try {
      const profile = await uploadMyAvatar(file);
      patchUser({ avatarUrl: profile.avatarUrl || null });
      showSuccess("Profile photo updated!");
    } catch (err) {
      setError(err.message);
      showError(err.message || "Failed to upload photo. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  }

  const isDirty = fullName.trim().length > 0 && fullName.trim() !== (user?.fullName || "").trim();

  async function handleSaveName(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const profile = await updateMyProfile(fullName);
      patchUser({ fullName: profile.fullName });
      setSaved(true);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
      showError(err.message || "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="portal-page-title">Profile</h1>
      <p className="portal-page-sub">Manage your photo and personal details.</p>

      {error && <p className="portal-error">{error}</p>}

      <section className="portal-section">
        <h2 className="portal-section__title">Profile Picture</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <span className="account-avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" />
            ) : (
              initialsOf(user?.fullName || user?.email)
            )}
          </span>
          <div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              className="btn"
              disabled={avatarUploading}
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarUploading ? "Uploading..." : "Change photo"}
            </button>
            <p style={{ fontSize: "0.78rem", color: "var(--color-ink-soft)", marginTop: "0.5rem" }}>
              JPG or PNG, uploaded straight to your account's cloud storage.
            </p>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <h2 className="portal-section__title">Personal Details</h2>
        <form onSubmit={handleSaveName}>
          <div className="portal-form-row">
            <div className="field">
              <label>Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setSaved(false); }}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={user?.email || ""} disabled />
            </div>
            <div className="field">
              <label>Role</label>
              <input type="text" value={ROLE_LABELS[user?.role] || user?.role || ""} disabled />
            </div>
          </div>
          {saved && <p style={{ color: "var(--color-accent)", fontSize: "0.85rem", marginBottom: "1rem" }}>Saved.</p>}
          <button
            type="submit"
            className={"btn" + (isDirty ? " btn-solid" : "")}
            disabled={saving || !isDirty}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
}
