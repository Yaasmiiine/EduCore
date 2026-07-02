import "../styles/auth.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import * as authApi from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { message } = await authApi.forgotPassword(email);
      setSuccess(message);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue, veuillez réessayer.");
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

        <h2>Mot de passe oublié</h2>

        <p>
          Indiquez votre email, nous vous enverrons un lien pour réinitialiser
          votre mot de passe.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}
