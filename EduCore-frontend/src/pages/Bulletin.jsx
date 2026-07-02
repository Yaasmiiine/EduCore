import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import notesApi from "../api/notes";

const moyenneClass = (moyenne) => {
  if (moyenne === null || moyenne === undefined) return "neutral";
  if (moyenne >= 14) return "good";
  if (moyenne >= 10) return "medium";
  return "low";
};

export default function Bulletin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    notesApi
      .bulletin()
      .then(setData)
      .catch(() => setError("Impossible de charger le bulletin."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Mon bulletin</h1>
            <p>Consultez vos notes et vos moyennes par module.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        {loading ? (
          <p>Chargement...</p>
        ) : !data || data.modules.length === 0 ? (
          <p>Aucune note enregistrée pour le moment.</p>
        ) : (
          <>
            <div className="academic-stats">
              <div className="academic-stat-card">
                <p className="stat-label">Moyenne générale</p>
                <p className="stat-value">{data.moyenne_generale ?? "—"}{data.moyenne_generale !== null && "/20"}</p>
              </div>
              <div className="academic-stat-card">
                <p className="stat-label">Modules notés</p>
                <p className="stat-value">{data.modules.length}</p>
              </div>
            </div>

            {data.modules.map(({ module, notes, moyenne }) => (
              <div className="academic-module-card" key={module.id}>
                <div className="module-card-header">
                  <div>
                    <h3>{module.nom}</h3>
                    <p>{module.filiere?.nom}</p>
                  </div>
                  <span className={`moyenne-badge ${moyenneClass(moyenne)}`}>
                    Moyenne : {moyenne ?? "—"}{moyenne !== null && "/20"}
                  </span>
                </div>

                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Note</th>
                      <th>Coefficient</th>
                      <th>Commentaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((note) => (
                      <tr key={note.id}>
                        <td>{note.type}</td>
                        <td>{new Date(note.date_evaluation).toLocaleDateString("fr-FR")}</td>
                        <td>{note.valeur}/20</td>
                        <td>{note.coefficient}</td>
                        <td>{note.commentaire || "—"}</td>
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
