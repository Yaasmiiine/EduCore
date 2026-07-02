import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import notesApi from "../api/notes";
import modulesApi from "../api/modules";
import { useAuth } from "../context/AuthContext.jsx";

const TYPES = ["TP", "Contrôle continu", "Examen", "Devoir"];

const EMPTY_FORM = {
  user_id: "",
  type: TYPES[0],
  valeur: "",
  coefficient: "1",
  commentaire: "",
  date_evaluation: new Date().toISOString().slice(0, 10),
};

export default function Notes() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [modules, setModules] = useState([]);
  const [moduleId, setModuleId] = useState("");
  const [etudiants, setEtudiants] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    modulesApi
      .list()
      .then((data) => {
        const mine = isAdmin ? data : data.filter((m) => m.formateur_id === user?.id);
        setModules(mine);
        if (mine[0]) setModuleId(String(mine[0].id));
      })
      .catch(() => setError("Impossible de charger les modules."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModuleData = () => {
    if (!moduleId) return;
    setLoading(true);
    Promise.all([modulesApi.etudiants(moduleId), notesApi.listForModule(moduleId)])
      .then(([etudiantsData, notesData]) => {
        setEtudiants(etudiantsData);
        setNotes(notesData);
        setError("");
      })
      .catch(() => setError("Impossible de charger les données du module."))
      .finally(() => setLoading(false));
  };

  useEffect(loadModuleData, [moduleId]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
  };

  useEffect(resetForm, [moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (editingId) {
        await notesApi.update(editingId, {
          type: form.type,
          valeur: Number(form.valeur),
          coefficient: Number(form.coefficient),
          commentaire: form.commentaire,
          date_evaluation: form.date_evaluation,
        });
      } else {
        await notesApi.create({
          user_id: Number(form.user_id),
          module_id: Number(moduleId),
          type: form.type,
          valeur: Number(form.valeur),
          coefficient: Number(form.coefficient),
          commentaire: form.commentaire,
          date_evaluation: form.date_evaluation,
        });
      }
      resetForm();
      loadModuleData();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setForm({
      user_id: String(note.user_id),
      type: note.type,
      valeur: String(note.valeur),
      coefficient: String(note.coefficient),
      commentaire: note.commentaire || "",
      date_evaluation: note.date_evaluation.slice(0, 10),
    });
    setFormError("");
  };

  const handleDelete = async (note) => {
    if (!window.confirm(`Supprimer cette note de ${note.stagiaire?.prenom} ${note.stagiaire?.nom} ?`)) return;
    try {
      await notesApi.remove(note.id);
      loadModuleData();
    } catch {
      setError("Impossible de supprimer cette note.");
    }
  };

  const selectedModule = modules.find((m) => String(m.id) === String(moduleId));

  const etudiantName = (id) => {
    const e = etudiants.find((et) => et.id === id);
    return e ? `${e.prenom} ${e.nom}` : "—";
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Notes</h1>
            <p>Saisissez et consultez les notes de vos étudiants, module par module.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        <div className="academic-toolbar">
          <div className="field">
            <label>Module</label>
            <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
              {modules.length === 0 && <option value="">Aucun module</option>}
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.nom} ({m.code})</option>
              ))}
            </select>
          </div>
        </div>

        {moduleId && (
          <form className="academic-form" onSubmit={handleSubmit}>
            {!editingId && (
              <div className="field">
                <label>Étudiant</label>
                <select
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner</option>
                  {etudiants.map((et) => (
                    <option key={et.id} value={et.id}>{et.prenom} {et.nom}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="field">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Note /20</label>
              <input
                type="number" min="0" max="20" step="0.25"
                value={form.valeur}
                onChange={(e) => setForm({ ...form, valeur: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Coefficient</label>
              <input
                type="number" min="0" max="10" step="0.5"
                value={form.coefficient}
                onChange={(e) => setForm({ ...form, coefficient: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={form.date_evaluation}
                onChange={(e) => setForm({ ...form, date_evaluation: e.target.value })}
                required
              />
            </div>

            <div className="field" style={{ flex: 1, minWidth: 200 }}>
              <label>Commentaire (optionnel)</label>
              <textarea
                value={form.commentaire}
                onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
              />
            </div>

            <button className="academic-btn" disabled={saving}>
              {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter la note"}
            </button>

            {editingId && (
              <button type="button" className="academic-btn danger" onClick={resetForm}>
                Annuler
              </button>
            )}

            {formError && <p className="academic-error" style={{ width: "100%" }}>{formError}</p>}
          </form>
        )}

        {loading ? (
          <p>Chargement...</p>
        ) : !moduleId ? (
          <p>Sélectionnez un module.</p>
        ) : notes.length === 0 ? (
          <p>Aucune note pour ce module.</p>
        ) : (
          <div className="academic-module-card">
            <div className="module-card-header">
              <div>
                <h3>{selectedModule?.nom}</h3>
                <p>{notes.length} note(s) enregistrée(s)</p>
              </div>
            </div>

            <table className="academic-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Coef.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id}>
                    <td>{note.stagiaire ? `${note.stagiaire.prenom} ${note.stagiaire.nom}` : etudiantName(note.user_id)}</td>
                    <td>{note.type}</td>
                    <td>{new Date(note.date_evaluation).toLocaleDateString("fr-FR")}</td>
                    <td>{note.valeur}/20</td>
                    <td>{note.coefficient}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="academic-btn small" onClick={() => handleEdit(note)} title="Modifier">
                          <FaEdit />
                        </button>
                        <button className="academic-btn small danger" onClick={() => handleDelete(note)} title="Supprimer">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
