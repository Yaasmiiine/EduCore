import { useEffect, useState } from "react";
import { FaUpload, FaCheckCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import devoirsApi from "../api/devoirs";

const isLate = (dateLimite) => new Date(dateLimite) < new Date();

export default function DevoirsStudent() {
  const [devoirs, setDevoirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  const loadDevoirs = () => {
    setLoading(true);
    devoirsApi
      .list()
      .then(setDevoirs)
      .catch(() => setError("Impossible de charger les devoirs."))
      .finally(() => setLoading(false));
  };

  useEffect(loadDevoirs, []);

  const handleSubmit = async (devoir, file) => {
    if (!file) return;
    setSubmittingId(devoir.id);
    setError("");
    try {
      await devoirsApi.soumettre(devoir.id, file);
      loadDevoirs();
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'envoyer votre fichier.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Devoirs</h1>
            <p>Consultez les devoirs de vos modules et déposez vos fichiers.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        {loading ? (
          <p>Chargement...</p>
        ) : devoirs.length === 0 ? (
          <p>Aucun devoir pour le moment.</p>
        ) : (
          devoirs.map((devoir) => {
            const late = isLate(devoir.date_limite);
            return (
              <div className="academic-module-card" key={devoir.id}>
                <div className="module-card-header">
                  <div>
                    <h3>{devoir.titre}</h3>
                    <p>
                      {devoir.module?.nom} · {devoir.groupe?.nom || "Toute la filière"} · Date limite :{" "}
                      {new Date(devoir.date_limite).toLocaleString("fr-FR")}
                    </p>
                    {devoir.description && <p style={{ marginTop: 6 }}>{devoir.description}</p>}
                  </div>
                  <span className={`moyenne-badge ${late ? "low" : "good"}`}>
                    {late ? "Date limite dépassée" : "En cours"}
                  </span>
                </div>

                {devoir.ma_soumission ? (
                  <p style={{ color: "var(--color-success)", display: "flex", alignItems: "center", gap: 8 }}>
                    <FaCheckCircle /> Soumis : {devoir.ma_soumission.nom_fichier} le{" "}
                    {new Date(devoir.ma_soumission.created_at).toLocaleString("fr-FR")}
                  </p>
                ) : (
                  <p style={{ color: "var(--color-muted)" }}>Aucune soumission pour le moment.</p>
                )}

                {!late && (
                  <label className="academic-btn small" style={{ display: "inline-flex", cursor: "pointer", marginTop: 10 }}>
                    <FaUpload /> {submittingId === devoir.id ? "Envoi..." : devoir.ma_soumission ? "Remplacer mon fichier" : "Soumettre un fichier"}
                    <input
                      type="file"
                      style={{ display: "none" }}
                      disabled={submittingId === devoir.id}
                      onChange={(e) => handleSubmit(devoir, e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
