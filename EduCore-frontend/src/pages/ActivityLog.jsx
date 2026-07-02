import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import "../styles/academique.css";
import activityLogsApi from "../api/activityLogs";

const ACTION_LABELS = { created: "Créé", updated: "Modifié", deleted: "Supprimé" };
const ACTION_CLASS = { created: "good", updated: "medium", deleted: "low" };

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");

  useEffect(() => {
    setLoading(true);
    activityLogsApi
      .list({ page, per_page: 20, action: action || undefined })
      .then((res) => {
        setLogs(res.data);
        setMeta(res);
        setError("");
      })
      .catch(() => setError("Impossible de charger le journal d'activité."))
      .finally(() => setLoading(false));
  }, [page, action]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Journal d'activité</h1>
            <p>Historique des créations, modifications et suppressions effectuées sur la plateforme.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        <div className="academic-toolbar">
          <div className="field">
            <label>Action</label>
            <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }}>
              <option value="">Toutes</option>
              <option value="created">Créé</option>
              <option value="updated">Modifié</option>
              <option value="deleted">Supprimé</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : logs.length === 0 ? (
          <p>Aucune activité enregistrée.</p>
        ) : (
          <div className="academic-module-card">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Élément</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.created_at).toLocaleString("fr-FR")}</td>
                    <td>{log.user ? `${log.user.prenom} ${log.user.nom}` : "Système"}</td>
                    <td><span className={`moyenne-badge ${ACTION_CLASS[log.action] || "neutral"}`}>{ACTION_LABELS[log.action] || log.action}</span></td>
                    <td>{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {meta && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, padding: "18px 22px 0" }}>
                <p style={{ color: "var(--color-muted)", fontSize: 14 }}>
                  {meta.total} résultat(s) — page {meta.current_page} / {meta.last_page}
                </p>
                <Pagination meta={meta} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
