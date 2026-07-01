import "../styles/auth.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  
} from "react-icons/fa";

export default function Login() {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP LOGIN
    localStorage.setItem("role", "admin");

    navigate("/dashboard");
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

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <FaEnvelope />

            <input
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="input-group">
            <FaLock />

            <input
              type="password"
              placeholder="Mot de passe"
            />
          </div>

          <button className="auth-btn">
            Se connecter
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