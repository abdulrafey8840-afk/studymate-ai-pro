import { useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Pencil,
  Save,
  X,
  LockKeyhole,
  KeyRound,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import Card from "../components/common/Card";
import "./Settings.css";

function Settings() {
  const savedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [name, setName] = useState(savedUser.name || "");
  const [email, setEmail] = useState(savedUser.email || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setMessage("");
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        name: name.trim(),
        email: email.trim(),
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/me?${params}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Profile update failed.");
      }

      localStorage.setItem("user", JSON.stringify(data));
      setName(data.name);
      setEmail(data.email);
      setEditing(false);
      setMessage("Profile updated successfully!");

      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setName(user.name || "");
    setEmail(user.email || "");
    setEditing(false);
    setError("");
    setMessage("");
  };

  const handlePasswordChange = async () => {
    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Password update failed.");
      }

      setPasswordMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page settings-page">
      <div className="settings-heading">
        <div>
          <span className="eyebrow">PERSONALIZATION</span>
          <h1>Settings</h1>
          <p>Manage your account, profile and security preferences.</p>
        </div>
        <div className="settings-heading-icon">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-main-card">
          <div className="settings-profile-banner">
            <div className="settings-avatar">{initials || "S"}</div>
            <div className="settings-profile-info">
              <span>YOUR ACCOUNT</span>
              <h2>{name || "Student"}</h2>
              <p>{email || "Email not available"}</p>
            </div>
            <div className="settings-verified">
              <ShieldCheck size={15} />
              Verified
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-heading">
              <div className="settings-section-icon">
                <UserRound size={19} />
              </div>
              <div>
                <h3>Personal Information</h3>
                <p>Update your account details</p>
              </div>
            </div>

            <div className="settings-form-grid">
              <label className="settings-field">
                <span>FULL NAME</span>
                <div className="settings-input-wrap">
                  <UserRound size={17} />
                  <input
                    value={name}
                    disabled={!editing}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              </label>

              <label className="settings-field">
                <span>EMAIL ADDRESS</span>
                <div className="settings-input-wrap">
                  <Mail size={17} />
                  <input
                    type="email"
                    value={email}
                    disabled={!editing}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                  />
                </div>
              </label>
            </div>

            {message && (
              <div className="settings-success">
                <CheckCircle2 size={17} />
                {message}
              </div>
            )}

            {error && <div className="settings-error">{error}</div>}

            <div className="settings-actions">
              {!editing ? (
                <button
                  className="settings-primary-btn"
                  onClick={() => {
                    setMessage("");
                    setError("");
                    setEditing(true);
                  }}
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="settings-primary-btn"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    className="settings-secondary-btn"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-section">
            <div className="settings-section-heading">
              <div className="settings-section-icon security-icon">
                <LockKeyhole size={19} />
              </div>
              <div>
                <h3>Security & Password</h3>
                <p>Keep your StudyMate account secure</p>
              </div>
            </div>

            <div className="settings-password-fields">
              <label className="settings-field">
                <span>CURRENT PASSWORD</span>
                <div className="settings-input-wrap">
                  <KeyRound size={17} />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
              </label>

              <label className="settings-field">
                <span>NEW PASSWORD</span>
                <div className="settings-input-wrap">
                  <LockKeyhole size={17} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </label>

              <label className="settings-field">
                <span>CONFIRM NEW PASSWORD</span>
                <div className="settings-input-wrap">
                  <ShieldCheck size={17} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
              </label>
            </div>

            {passwordMessage && (
              <div className="settings-success">
                <CheckCircle2 size={17} />
                {passwordMessage}
              </div>
            )}

            {passwordError && (
              <div className="settings-error">{passwordError}</div>
            )}

            <button
              className="settings-primary-btn password-btn"
              onClick={handlePasswordChange}
              disabled={passwordLoading}
            >
              <LockKeyhole size={16} />
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>

          <div className="settings-security-note">
            <ShieldCheck size={19} />
            <div>
              <strong>Your account is protected</strong>
              <p>Your password is securely hashed before being stored.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;