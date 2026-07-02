import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import presencesApi from "../api/presences";

const rateClass = (rate) => {
  if (rate === null || rate === undefined) return "";
  if (rate >= 80) return "good";
  if (rate >= 60) return "medium";
  return "low";
};

const STATUT_LABELS = { present: "Présent", absent: "Absent", retard: "Retard" };

export default function PresenceHistory() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    presencesApi
      .mine()
      .then(setModules)
      .catch(() => setError("Impossible de charger vos présences."))
      .finally(() => setLoading(false));
  }, []);

  const totalSeances = modules.reduce((sum, m) => sum + m.total, 0);
  const totalPresent = modules.reduce((sum, m) => sum + m.present + m.retard, 0);
  const globalRate = totalSeances > 0 ? Math.round((totalPresent / totalSeances) * 1000) / 10 : null;

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Mes présences</h1>
            <p>Consultez votre historique d'assiduité par module.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        {loading ? (
          <p>Chargement...</p>
        ) : modules.length === 0 ? (
          <p>Aucune séance enregistrée pour le moment.</p>
        ) : (
          <>
            <div className="academic-stats">
              <div className="academic-stat-card">
                <p className="stat-label">Taux de présence global</p>
                <p className="stat-value">{globalRate ?? "—"}{globalRate !== null && "%"}</p>
              </div>
              <div className="academic-stat-card">
                <p className="stat-label">Séances enregistrées</p>
                <p className="stat-value">{totalSeances}</p>
              </div>
            </div>

            {modules.map(({ module, total, present, retard, absent, taux_presence, presences }) => (
              <div className="academic-module-card" key={module.id}>
                <div className="module-card-header">
                  <div>
                    <h3>{module.nom}</h3>
                    <p>{present} présent(s) · {retard} retard(s) · {absent} absence(s) sur {total} séance(s)</p>
                  </div>
                  <span className={`moyenne-badge ${taux_presence >= 80 ? "good" : taux_presence >= 60 ? "medium" : "low"}`}>
                    {taux_presence}% de présence
                  </span>
                </div>

                <div className="progress-bar" style={{ marginBottom: 18 }}>
                  <div className={`progress-bar-fill ${rateClass(taux_presence)}`} style={{ width: `${taux_presence}%` }} />
                </div>

                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Jour</th>
                      <th>Horaire</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presences.map((p) => (
                      <tr key={p.id}>
                        <td>{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                        <td>{p.emploi_du_temps?.jour}</td>
                        <td>{p.emploi_du_temps?.heure_debut?.slice(0, 5)} - {p.emploi_du_temps?.heure_fin?.slice(0, 5)}</td>
                        <td><span className={`status-pill ${p.statut}`}>{STATUT_LABELS[p.statut] || p.statut}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
