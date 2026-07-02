import "../styles/auth.css";

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import * as authApi from "../api/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token || !email) {
      setError("Ce lien de réinitialisation est invalide.");
      return;
    }

    setLoading(true);
    try {
      const { message } = await authApi.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(" ")
          : err.response?.data?.message || "Une erreur est survenue, veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logoblack.png" alt="EduCore Logo" className="logo-icon" />
          <h1>
            Edu<span>Core</span>
          </h1>
        </div>

        <h2>Nouveau mot de passe</h2>

        <p>Choisissez un nouveau mot de passe pour {email || "votre compte"}.</p>

        {!token || !email ? (
          <div className="auth-error">
            Ce lien de réinitialisation est invalide ou incomplet. Redemandez un
            lien depuis la page "Mot de passe oublié".
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}
