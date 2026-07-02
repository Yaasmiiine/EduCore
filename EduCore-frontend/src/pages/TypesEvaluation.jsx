import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import typesEvaluationApi from "../api/typesEvaluation";

const EMPTY_FORM = { nom: "", coefficient_defaut: "1" };

export default function TypesEvaluation() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    typesEvaluationApi
      .list()
      .then(setTypes)
      .catch(() => setError("Impossible de charger les types d'évaluation."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = { nom: form.nom, coefficient_defaut: Number(form.coefficient_defaut) };
      if (editingId) {
        await typesEvaluationApi.update(editingId, payload);
      } else {
        await typesEvaluationApi.create(payload);
      }
      resetForm();
      load();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (type) => {
    setEditingId(type.id);
    setForm({ nom: type.nom, coefficient_defaut: String(type.coefficient_defaut) });
    setFormError("");
  };

  const handleDelete = async (type) => {
    if (!window.confirm(`Supprimer le type "${type.nom}" ?`)) return;
    try {
      await typesEvaluationApi.remove(type.id);
      load();
    } catch {
      setError("Impossible de supprimer ce type d'évaluation.");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Types d'évaluation</h1>
            <p>Gérez les types de notes et leur coefficient par défaut, utilisés lors de la saisie des notes.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        <form className="academic-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nom</label>
            <input
              type="text"
              placeholder="Ex : Contrôle continu"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Coefficient par défaut</label>
            <input
              type="number" min="0" max="10" step="0.5"
              value={form.coefficient_defaut}
              onChange={(e) => setForm({ ...form, coefficient_defaut: e.target.value })}
              required
            />
          </div>

          <button className="academic-btn" disabled={saving}>
            {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter"}
          </button>

          {editingId && (
            <button type="button" className="academic-btn danger" onClick={resetForm}>
              Annuler
            </button>
          )}

          {formError && <p className="academic-error" style={{ width: "100%" }}>{formError}</p>}
        </form>

        {loading ? (
          <p>Chargement...</p>
        ) : types.length === 0 ? (
          <p>Aucun type d'évaluation défini.</p>
        ) : (
          <div className="academic-module-card">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Coefficient par défaut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {types.map((t) => (
                  <tr key={t.id}>
                    <td>{t.nom}</td>
                    <td>{t.coefficient_defaut}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="academic-btn small" onClick={() => handleEdit(t)} title="Modifier">
                          <FaEdit />
                        </button>
                        <button className="academic-btn small danger" onClick={() => handleDelete(t)} title="Supprimer">
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
