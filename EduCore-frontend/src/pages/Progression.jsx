import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import notesApi from "../api/notes";
import presencesApi from "../api/presences";

const barClass = (value) => {
  if (value >= 70) return "good";
  if (value >= 40) return "medium";
  return "low";
};

export default function Progression() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([notesApi.bulletin(), presencesApi.mine()])
      .then(([bulletin, presenceModules]) => {
        const byModule = new Map();

        bulletin.modules.forEach(({ module, moyenne }) => {
          byModule.set(module.id, { module, moyenne, taux_presence: null });
        });

        presenceModules.forEach(({ module, taux_presence }) => {
          const existing = byModule.get(module.id) || { module, moyenne: null, taux_presence: null };
          existing.taux_presence = taux_presence;
          byModule.set(module.id, existing);
        });

        const merged = [...byModule.values()].map((row) => {
          const parts = [];
          if (row.moyenne !== null) parts.push((row.moyenne / 20) * 100);
          if (row.taux_presence !== null) parts.push(row.taux_presence);
          const progression = parts.length ? Math.round(parts.reduce((a, b) => a + b, 0) / parts.length) : 0;
          return { ...row, progression };
        });

        setRows(merged);
      })
      .catch(() => setError("Impossible de charger votre progression."))
      .finally(() => setLoading(false));
  }, []);

  const globalProgression = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + r.progression, 0) / rows.length)
    : null;

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Ma progression</h1>
            <p>Vue d'ensemble de votre avancement par module (notes + assiduité).</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        {loading ? (
          <p>Chargement...</p>
        ) : rows.length === 0 ? (
          <p>Aucune donnée disponible pour le moment.</p>
        ) : (
          <>
            <div className="academic-stats">
              <div className="academic-stat-card">
                <p className="stat-label">Progression globale</p>
                <p className="stat-value">{globalProgression ?? "—"}{globalProgression !== null && "%"}</p>
              </div>
              <div className="academic-stat-card">
                <p className="stat-label">Modules suivis</p>
                <p className="stat-value">{rows.length}</p>
              </div>
            </div>

            <div className="academic-module-card">
              {rows.map(({ module, moyenne, taux_presence, progression }) => (
                <div key={module.id} style={{ marginBottom: 22 }}>
                  <div className="academic-progress-row">
                    <span className="progress-label">{module.nom}</span>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className={`progress-bar-fill ${barClass(progression)}`} style={{ width: `${progression}%` }} />
                    </div>
                    <span className="progress-value">{progression}%</span>
                  </div>
                  <p style={{ margin: "4px 0 0 164px", color: "var(--color-muted)", fontSize: 13 }}>
                    {moyenne !== null ? `Moyenne : ${moyenne}/20` : "Pas encore de note"}
                    {" · "}
                    {taux_presence !== null ? `Présence : ${taux_presence}%` : "Pas encore de séance"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
