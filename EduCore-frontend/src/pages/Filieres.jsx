// Filieres.jsx

import { useEffect, useMemo, useState } from "react";

import "../styles/filieres.css";

import Sidebar from "../components/Sidebar";
import filieresApi from "../api/filieres";

import {
  FaSearch,
  FaPlus,
  FaGraduationCap,
  FaUsers,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const EMPTY_FORM = { nom: "", code: "", description: "" };

export default function Filieres() {
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadFilieres = () => {
    setLoading(true);
    return filieresApi
      .list()
      .then(setFilieres)
      .catch(() => setError("Impossible de charger les filières."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFilieres();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (filiere) => {
    setEditingId(filiere.id);
    setForm({ nom: filiere.nom, code: filiere.code, description: filiere.description || "" });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (editingId) {
        await filieresApi.update(editingId, form);
      } else {
        await filieresApi.create(form);
      }
      setShowModal(false);
      await loadFilieres();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (filiere) => {
    if (!window.confirm(`Supprimer la filière "${filiere.nom}" ?`)) return;
    try {
      await filieresApi.remove(filiere.id);
      setFilieres((prev) => prev.filter((f) => f.id !== filiere.id));
    } catch {
      setError("Impossible de supprimer cette filière.");
    }
  };

  const filteredFilieres = useMemo(
    () =>
      filieres.filter((f) =>
        `${f.nom} ${f.code}`.toLowerCase().includes(search.toLowerCase())
      ),
    [filieres, search]
  );

  const totalGroupes = filieres.reduce((sum, f) => sum + (f.groupes?.length || 0), 0);

  return (
  <div className="dashboard">

    <Sidebar />
    {/* MODAL */}

{showModal && (

  <div className="modal-overlay">

    <div className="modal">

      <div className="modal-header">

        <h2>{editingId ? "Modifier la filière" : "Ajouter une filière"}</h2>

        <button
          className="close-btn"
          onClick={() => setShowModal(false)}
        >
          ×
        </button>

      </div>

      {formError && <p style={{ color: "#dc2626" }}>{formError}</p>}

      <form className="modal-form" onSubmit={handleSubmit}>

        <div className="form-group">

          <label>Nom de la filière</label>

          <input
            type="text"
            placeholder="Ex: Développement Digital"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />

        </div>

        <div className="form-group">

          <label>Code</label>

          <input
            type="text"
            placeholder="Ex: DEV101"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />

        </div>

        <div className="form-group full">

          <label>Description</label>

          <textarea
            rows="4"
            placeholder="Description de la filière..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="submit-btn"
            disabled={saving}
          >
            {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter"}
          </button>

        </div>

      </form>

    </div>

  </div>

)}

    <main className="filieres-page">

      {/* HEADER */}
      <div className="filieres-header">

        <div>
          <h1>Filières</h1>

          <p>
            Gérez les filières de votre établissement.
          </p>
        </div>

        <button
            className="add-filiere-btn"
            onClick={openCreateModal}
        >
          <FaPlus />
          Ajouter une filière
        </button>

      </div>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {/* STATS */}
      <div className="filieres-stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            <FaGraduationCap />
          </div>

          <div>
            <h2>{filieres.length}</h2>
            <p>Total filières</p>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon purple">
            <FaUsers />
          </div>

          <div>
            <h2>{totalGroupes}</h2>
            <p>Total groupes</p>
          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="filieres-table-container">

        {/* SEARCH */}
        <div className="table-top">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Rechercher une filière..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        {/* TABLE */}
        {loading ? (
          <p style={{ padding: 24 }}>Chargement...</p>
        ) : (
        <table className="filieres-table">

          <thead>

            <tr>
              <th>Nom de la filière</th>
              <th>Code</th>
              <th>Description</th>
              <th>Nombre de groupes</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredFilieres.map((filiere) => (

              <tr key={filiere.id}>

                <td className="filiere-name">
                  {filiere.nom}
                </td>

                <td>{filiere.code}</td>

                <td>{filiere.description}</td>

                <td>{filiere.groupes?.length || 0}</td>

                <td>

                  <div className="actions">

                    <button className="edit-btn" onClick={() => openEditModal(filiere)}>
                      <FaEdit />
                    </button>

                    <button className="delete-btn" onClick={() => handleDelete(filiere)}>
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
        )}

      </div>

    </main>

  </div>
);

}
