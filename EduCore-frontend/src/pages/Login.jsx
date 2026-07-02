import "../styles/auth.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import {
  FaEnvelope,
  FaLock,

} from "react-icons/fa";

const DASHBOARD_PATH = "/dashboard";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate(DASHBOARD_PATH);
    } catch (err) {
      setError(
        err.response?.data?.message || "Une erreur est survenue, veuillez réessayer."
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

        <h2>Connexion</h2>

        <p>
          Connectez-vous à votre compte
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>

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

          <div className="input-group">
            <FaLock />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-forgot">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Pas de compte ?
          </p>

          <Link to="/register">
            Créer un compte
          </Link>

        </div>

      </div>

    </div>
  );
}
