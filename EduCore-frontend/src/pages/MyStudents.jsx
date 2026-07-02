import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import formateurApi from "../api/formateur";

const badgeClass = (value, goodMin, medMin) => {
  if (value === null || value === undefined) return "neutral";
  if (value >= goodMin) return "good";
  if (value >= medMin) return "medium";
  return "low";
};

export default function MyStudents() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    formateurApi
      .mesEtudiants()
      .then(setEtudiants)
      .catch(() => setError("Impossible de charger vos étudiants."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Mes étudiants</h1>
            <p>Les stagiaires inscrits dans les filières où vous enseignez.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        {loading ? (
          <p>Chargement...</p>
        ) : etudiants.length === 0 ? (
          <p>Aucun étudiant trouvé.</p>
        ) : (
          <>
            <div className="academic-stats">
              <div className="academic-stat-card">
                <p className="stat-label">Étudiants</p>
                <p className="stat-value">{etudiants.length}</p>
              </div>
            </div>

            <div className="academic-module-card">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Groupe</th>
                    <th>Email</th>
                    <th>Moyenne (mes modules)</th>
                    <th>Présence (mes séances)</th>
                  </tr>
                </thead>
                <tbody>
                  {etudiants.map((e) => (
                    <tr key={e.id}>
                      <td>{e.prenom} {e.nom}</td>
                      <td>{e.groupe?.nom || "—"}</td>
                      <td>
                        <a href={`mailto:${e.email}`} style={{ color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <FaEnvelope /> {e.email}
                        </a>
                      </td>
                      <td>
                        <span className={`moyenne-badge ${badgeClass(e.moyenne, 14, 10)}`}>
                          {e.moyenne !== null ? `${e.moyenne}/20` : "Aucune note"}
                        </span>
                      </td>
                      <td>
                        <span className={`moyenne-badge ${badgeClass(e.taux_presence, 80, 60)}`}>
                          {e.taux_presence !== null ? `${e.taux_presence}%` : "Aucune séance"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
