import { useEffect, useMemo, useState } from "react";
import { FaTrash, FaChevronDown, FaChevronUp, FaDownload } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import devoirsApi from "../api/devoirs";
import modulesApi from "../api/modules";
import groupesApi from "../api/groupes";
import { useAuth } from "../context/AuthContext.jsx";

const EMPTY_FORM = { module_id: "", groupe_id: "", titre: "", description: "", date_limite: "" };

const isLate = (dateLimite) => new Date(dateLimite) < new Date();

export default function DevoirsManage() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [modules, setModules] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [devoirs, setDevoirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [expandedId, setExpandedId] = useState(null);
  const [soumissions, setSoumissions] = useState([]);
  const [soumissionsLoading, setSoumissionsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const loadDevoirs = () => {
    setLoading(true);
    devoirsApi
      .list()
      .then(setDevoirs)
      .catch(() => setError("Impossible de charger les devoirs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    modulesApi
      .list()
      .then((data) => {
        const mine = isAdmin ? data : data.filter((m) => m.formateur_id === user?.id);
        setModules(mine);
        if (mine[0]) setForm((f) => ({ ...f, module_id: String(mine[0].id) }));
      })
      .catch(() => setError("Impossible de charger les modules."));
    groupesApi.list().then(setGroupes).catch(() => setError("Impossible de charger les groupes."));
    loadDevoirs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedModule = modules.find((m) => String(m.id) === String(form.module_id));

  const groupesForModule = useMemo(() => {
    if (!selectedModule) return [];
    return groupes.filter((g) => g.filiere_id === selectedModule.filiere_id);
  }, [groupes, selectedModule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await devoirsApi.create({ ...form, groupe_id: form.groupe_id || null });
      setForm((f) => ({ ...f, titre: "", description: "", date_limite: "" }));
      loadDevoirs();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (devoir) => {
    if (!window.confirm(`Supprimer le devoir "${devoir.titre}" ?`)) return;
    try {
      await devoirsApi.remove(devoir.id);
      loadDevoirs();
    } catch {
      setError("Impossible de supprimer ce devoir.");
    }
  };

  const toggleExpand = (devoir) => {
    if (expandedId === devoir.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(devoir.id);
    setSoumissionsLoading(true);
    devoirsApi
      .soumissions(devoir.id)
      .then(setSoumissions)
      .catch(() => setError("Impossible de charger les soumissions."))
      .finally(() => setSoumissionsLoading(false));
  };

  const handleDownload = async (soumission) => {
    setDownloadingId(soumission.id);
    try {
      const blob = await devoirsApi.telechargerSoumission(soumission.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = soumission.nom_fichier;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Impossible de télécharger ce fichier.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Devoirs</h1>
            <p>Publiez des devoirs et consultez les soumissions de vos étudiants.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        <form className="academic-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Module</label>
            <select
              value={form.module_id}
              onChange={(e) => setForm({ ...form, module_id: e.target.value, groupe_id: "" })}
              required
            >
              {modules.length === 0 && <option value="">Aucun module</option>}
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Groupe</label>
            <select value={form.groupe_id} onChange={(e) => setForm({ ...form, groupe_id: e.target.value })}>
              <option value="">Toute la filière</option>
              {groupesForModule.map((g) => (
                <option key={g.id} value={g.id}>{g.nom}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Titre</label>
            <input
              type="text"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Date limite</label>
            <input
              type="datetime-local"
              value={form.date_limite}
              onChange={(e) => setForm({ ...form, date_limite: e.target.value })}
              required
            />
          </div>

          <div className="field" style={{ flex: 1, minWidth: 220 }}>
            <label>Description (optionnel)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button className="academic-btn" disabled={saving || !form.module_id}>
            {saving ? "Publication..." : "Publier le devoir"}
          </button>

          {formError && <p className="academic-error" style={{ width: "100%" }}>{formError}</p>}
        </form>

        {loading ? (
          <p>Chargement...</p>
        ) : devoirs.length === 0 ? (
          <p>Aucun devoir publié pour le moment.</p>
        ) : (
          devoirs.map((devoir) => (
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
                <span className={`moyenne-badge ${isLate(devoir.date_limite) ? "low" : "good"}`}>
                  {isLate(devoir.date_limite) ? "Date limite dépassée" : "En cours"}
                </span>
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: expandedId === devoir.id ? 14 : 0 }}>
                <button className="academic-btn small" onClick={() => toggleExpand(devoir)}>
                  {expandedId === devoir.id ? <FaChevronUp /> : <FaChevronDown />} {devoir.soumissions_count ?? 0} soumission(s)
                </button>
                <button className="academic-btn small danger" onClick={() => handleDelete(devoir)}>
                  <FaTrash /> Supprimer
                </button>
              </div>

              {expandedId === devoir.id && (
                soumissionsLoading ? (
                  <p>Chargement...</p>
                ) : soumissions.length === 0 ? (
                  <p>Aucune soumission pour ce devoir.</p>
                ) : (
                  <table className="academic-table">
                    <thead>
                      <tr>
                        <th>Étudiant</th>
                        <th>Groupe</th>
                        <th>Fichier</th>
                        <th>Soumis le</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {soumissions.map((s) => (
                        <tr key={s.id}>
                          <td>{s.stagiaire?.prenom} {s.stagiaire?.nom}</td>
                          <td>{s.stagiaire?.groupe?.nom || "—"}</td>
                          <td>{s.nom_fichier}</td>
                          <td>{new Date(s.created_at).toLocaleString("fr-FR")}</td>
                          <td>
                            <button
                              className="academic-btn small"
                              onClick={() => handleDownload(s)}
                              disabled={downloadingId === s.id}
                            >
                              <FaDownload /> {downloadingId === s.id ? "..." : "Télécharger"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
