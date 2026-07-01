import "../styles/auth.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import groupesApi from "../api/groupes";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUsers,
} from "react-icons/fa";

export default function Register() {

  const navigate = useNavigate();
  const { register } = useAuth();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groupeId, setGroupeId] = useState("");

  const [groupes, setGroupes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    groupesApi
      .list()
      .then(setGroupes)
      .catch(() => setError("Impossible de charger la liste des groupes."));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!groupeId) {
      setError("Veuillez sélectionner votre groupe.");
      return;
    }

    setLoading(true);

    try {
      await register({ nom, prenom, email, password, groupe_id: groupeId });
      navigate("/dashboard");
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors).flat().join(" ")
        : err.response?.data?.message || "Une erreur est survenue, veuillez réessayer.";
      setError(message);
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

        <h2>Créer un compte</h2>

        <p>
          Rejoignez la plateforme EduCore
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <FaUser />

            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaUser />

            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <div className="input-group">
            <FaUsers />

            <select
              value={groupeId}
              onChange={(e) => setGroupeId(e.target.value)}
              required
            >
              <option value="">Sélectionnez votre groupe</option>
              {groupes.map((groupe) => (
                <option key={groupe.id} value={groupe.id}>
                  {groupe.filiere?.nom} — {groupe.nom} (Année {groupe.annee})
                </option>
              ))}
            </select>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Création..." : "Créer un compte"}
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
