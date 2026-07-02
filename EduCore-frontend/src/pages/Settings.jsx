import { useState } from "react";
import { FaUserCircle, FaLock, FaSave, FaExclamationTriangle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext.jsx";
import * as authApi from "../api/auth";

import "../styles/settings.css";

const ROLE_LABELS = { admin: "Administrateur", teacher: "Formateur", student: "Stagiaire" };

export default function Settings() {
  const { user, role, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
  });
  const [profileStatus, setProfileStatus] = useState({ loading: false, error: "", success: "" });
  const [resendStatus, setResendStatus] = useState({ loading: false, message: "" });

  const handleResendVerification = async () => {
    setResendStatus({ loading: true, message: "" });
    try {
      const { message } = await authApi.resendVerification();
      setResendStatus({ loading: false, message });
    } catch {
      setResendStatus({ loading: false, message: "Erreur lors de l'envoi de l'email de vérification." });
    }
  };

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: "", success: "" });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    setProfileStatus({ loading: true, error: "", success: "" });
    try {
      const updated = await authApi.updateProfile(profile);
      updateUser(updated);
      setProfileStatus({ loading: false, error: "", success: "Profil mis à jour avec succès !" });
    } catch (err) {
      const message = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : "Erreur lors de la mise à jour du profil.";
      setProfileStatus({ loading: false, error: message, success: "" });
    }
  };

  const handlePasswordSave = async () => {
    setPasswordStatus({ loading: true, error: "", success: "" });
    try {
      await authApi.updatePassword(passwordForm);
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
      setPasswordStatus({ loading: false, error: "", success: "Mot de passe mis à jour avec succès !" });
    } catch (err) {
      const message = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : "Erreur lors de la mise à jour du mot de passe.";
      setPasswordStatus({ loading: false, error: message, success: "" });
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="settings-page">

        <div className="page-header">
          <h1>Paramètres</h1>
          <p>Gérez les informations de votre compte.</p>
        </div>

        {/* PROFILE */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon blue">
              <FaUserCircle />
            </div>
            <div>
              <h2>Profil</h2>
              <p>Vos informations personnelles.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Prénom</label>
              <input type="text" name="prenom" value={profile.prenom} onChange={handleProfileChange} />
            </div>

            <div className="form-group">
              <label>Nom</label>
              <input type="text" name="nom" value={profile.nom} onChange={handleProfileChange} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleProfileChange} />
            </div>

            <div className="form-group">
              <label>Rôle</label>
              <input type="text" value={ROLE_LABELS[role] || role} disabled />
            </div>
          </div>

          {!user?.email_verified_at && (
            <div className="settings-notice">
              <FaExclamationTriangle />
              <span>Votre adresse email n'est pas vérifiée.</span>
              <button type="button" onClick={handleResendVerification} disabled={resendStatus.loading}>
                {resendStatus.loading ? "Envoi..." : "Renvoyer l'email de vérification"}
              </button>
            </div>
          )}
          {resendStatus.message && <p className="settings-success">{resendStatus.message}</p>}

          {profileStatus.error && <p className="settings-error">{profileStatus.error}</p>}
          {profileStatus.success && <p className="settings-success">{profileStatus.success}</p>}

          <div className="save-section">
            <button className="save-btn" onClick={handleProfileSave} disabled={profileStatus.loading}>
              <FaSave />
              {profileStatus.loading ? "Enregistrement..." : "Enregistrer le profil"}
            </button>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon purple">
              <FaLock />
            </div>
            <div>
              <h2>Mot de passe</h2>
              <p>Modifiez votre mot de passe de connexion.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Mot de passe actuel</label>
              <input
                type="password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                name="password"
                value={passwordForm.password}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                name="password_confirmation"
                value={passwordForm.password_confirmation}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          {passwordStatus.error && <p className="settings-error">{passwordStatus.error}</p>}
          {passwordStatus.success && <p className="settings-success">{passwordStatus.success}</p>}

          <div className="save-section">
            <button className="save-btn" onClick={handlePasswordSave} disabled={passwordStatus.loading}>
              <FaSave />
              {passwordStatus.loading ? "Enregistrement..." : "Changer le mot de passe"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
