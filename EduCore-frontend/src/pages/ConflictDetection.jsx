// ConflictDetection.jsx

import "../styles/conflictDetection.css";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import emploisDuTempsApi from "../api/emploisDuTemps";
import {
  FaExclamationTriangle,
  FaClock,
  FaShieldAlt,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaUsers,
  FaRobot,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

function SeanceSummary({ seance }) {
  return (
    <>
      <p><FaDoorOpen /> Salle : {seance.salle?.nom}</p>
      <p><FaChalkboardTeacher /> Enseignant : {seance.formateur?.prenom} {seance.formateur?.nom}</p>
      <p><FaUsers /> Groupe : {seance.groupe?.nom}</p>
      <p><FaClock /> {seance.jour} {seance.heure_debut?.slice(0, 5)} - {seance.heure_fin?.slice(0, 5)} ({seance.module?.nom})</p>
    </>
  );
}

export default function ConflictDetection() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const loadConflicts = () => {
    setLoading(true);
    setError("");
    return emploisDuTempsApi
      .getConflicts()
      .then(setConflicts)
      .catch(() => setError("Impossible d'analyser l'emploi du temps."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConflicts();
  }, []);

  const filteredConflicts = conflicts.filter((c) =>
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const countBySeverity = (s) => conflicts.filter((c) => c.severity === s).length;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setSuggestions("");
    try {
      const { suggestions: text } = await emploisDuTempsApi.analyzeConflicts(conflicts);
      setSuggestions(text);
    } catch {
      setSuggestions("Erreur lors de l'analyse IA.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="dashboard">
            <Sidebar />
    <div className="conflict-page">


      {/* MAIN */}
      <main className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h1>Détection de Conflits</h1>
            <p>Analyse de l'emploi du temps pour détecter les chevauchements</p>
          </div>

          <div className="topbar-actions">
            <button className="scan-btn" onClick={loadConflicts} disabled={loading}>
              <FaSyncAlt />
              {loading ? "Analyse..." : "Analyser"}
            </button>

            <button className="resolve-btn" onClick={handleAnalyze} disabled={analyzing || conflicts.length === 0}>
              <FaRobot />
              {analyzing ? "Analyse IA..." : "Suggestions IA"}
            </button>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card critical">
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>

            <div>
              <h2>{countBySeverity("Critique")}</h2>
              <p>Conflits critiques (salle)</p>
            </div>
          </div>

          <div className="stat-card medium">
            <div className="stat-icon">
              <FaClock />
            </div>

            <div>
              <h2>{countBySeverity("Moyen")}</h2>
              <p>Conflits moyens (enseignant)</p>
            </div>
          </div>

          <div className="stat-card resolved">
            <div className="stat-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h2>{countBySeverity("Faible")}</h2>
              <p>Conflits faibles (groupe)</p>
            </div>
          </div>

          <div className="stat-card ai">
            <div className="stat-icon">
              <FaRobot />
            </div>

            <div>
              <h2>{conflicts.length}</h2>
              <p>Total conflits</p>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher un conflit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* CONFLICTS */}
        <div className="conflicts-container">
          {/* LEFT */}
          <div className="conflicts-list">
            <div className="section-title">
              <h2>Conflits détectés</h2>
            </div>

            {loading && <p>Analyse en cours...</p>}

            {!loading && filteredConflicts.length === 0 && (
              <p>Aucun conflit détecté. L'emploi du temps est cohérent. ✅</p>
            )}

            {filteredConflicts.map((conflict) => (
              <div className="conflict-card" key={conflict.id}>
                <div className="conflict-header">
                  <span className={`badge ${conflict.severity.toLowerCase()}`}>
                    {conflict.severity}
                  </span>

                  <span className="conflict-type">{conflict.type}</span>
                </div>

                <div className="conflict-info">
                  <p style={{ fontWeight: 600 }}>Séance 1 :</p>
                  <SeanceSummary seance={conflict.seance_a} />
                  <p style={{ fontWeight: 600, marginTop: 10 }}>Séance 2 :</p>
                  <SeanceSummary seance={conflict.seance_b} />
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="recommendation-panel">
            <h2>Suggestions IA</h2>

            {!suggestions && !analyzing && (
              <p style={{ color: "#64748b" }}>
                Cliquez sur "Suggestions IA" pour obtenir des recommandations de résolution.
              </p>
            )}

            {analyzing && <p>Génération des suggestions...</p>}

            {suggestions && (
              <div className="recommendation-card">
                <FaRobot className="robot-icon" />
                <div>
                  <p style={{ whiteSpace: "pre-wrap" }}>{suggestions}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}
