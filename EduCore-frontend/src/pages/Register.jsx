import "../styles/auth.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  
} from "react-icons/fa";

export default function Register() {

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    navigate("/login");
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

        <h2>Créer un compte</h2>

        <p>
          Rejoignez la plateforme EduCore
        </p>

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <FaUser />

            <input
              type="text"
              placeholder="Nom complet"
            />
          </div>

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
            Créer un compte
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Vous avez déjà un compte ?
          </p>

          <Link to="/login">
            Connexion
          </Link>

        </div>

      </div>

    </div>
  );
}