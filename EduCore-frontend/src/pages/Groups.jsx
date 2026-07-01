import { useEffect, useMemo, useState } from "react";
import "../styles/groups.css";
import Sidebar from "../components/Sidebar";
import groupesApi from "../api/groupes";
import filieresApi from "../api/filieres";
import usersApi from "../api/users";

import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const EMPTY_FORM = { nom: "", filiere_id: "", annee: "1" };

export default function Groups() {
  const [groupes, setGroupes] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("");

  const loadAll = () => {
    setLoading(true);
    return Promise.all([groupesApi.list(), filieresApi.list(), usersApi.list()])
      .then(([groupesData, filieresData, usersData]) => {
        setGroupes(groupesData);
        setFilieres(filieresData);
        setUsers(usersData);
        setError("");
      })
      .catch(() => setError("Impossible de charger les groupes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (groupe) => {
    setEditingId(groupe.id);
    setForm({ nom: groupe.nom, filiere_id: groupe.filiere_id, annee: String(groupe.annee) });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = { ...form, annee: Number(form.annee) };
    try {
      if (editingId) {
        await groupesApi.update(editingId, payload);
      } else {
        await groupesApi.create(payload);
      }
      setShowModal(false);
      await loadAll();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (groupe) => {
    if (!window.confirm(`Supprimer le groupe "${groupe.nom}" ?`)) return;
    try {
      await groupesApi.remove(groupe.id);
      setGroupes((prev) => prev.filter((g) => g.id !== groupe.id));
    } catch {
      setError("Impossible de supprimer ce groupe.");
    }
  };

  const effectif = (groupeId) => users.filter((u) => u.groupe_id === groupeId).length;

  const filteredGroupes = useMemo(() => {
    return groupes.filter((g) => {
      const matchesSearch = g.nom.toLowerCase().includes(search.toLowerCase());
      const matchesFiliere = !filiereFilter || String(g.filiere_id) === filiereFilter;
      return matchesSearch && matchesFiliere;
    });
  }, [groupes, search, filiereFilter]);

  return (
    <div className="dashboard">

      <Sidebar />

      <main className="groups-page">

        {/* HEADER */}
        <div className="groups-header">

          <div>
            <h1>Groupes</h1>

            <p>
              Gérez tous les groupes de la plateforme
            </p>
          </div>

          <button
            className="add-group-btn"
            onClick={openCreateModal}
          >
            <FaPlus />
            Ajouter un groupe
          </button>

        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        {/* TOP */}
        <div className="groups-top">

          <div className="search-filter">

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Rechercher un groupe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <select value={filiereFilter} onChange={(e) => setFiliereFilter(e.target.value)}>
              <option value="">Filtrer par filière</option>
              {filieres.map((f) => (
                <option key={f.id} value={f.id}>{f.nom}</option>
              ))}
            </select>

          </div>

          <div className="total-groups">

            <div className="groups-icon">
              <FaUsers />
            </div>

            <div>
              <p>Total Groupes</p>
              <h2>{groupes.length}</h2>
            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="table-container">

          {loading ? (
            <p style={{ padding: 24 }}>Chargement...</p>
          ) : (
          <table>

            <thead>

              <tr>
                <th>#</th>
                <th>Nom du groupe</th>
                <th>Filière</th>
                <th>Niveau</th>
                <th>Effectif</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredGroupes.map((group) => (

                <tr key={group.id}>

                  <td>{group.id}</td>

                  <td>

                    <div className="group-name">

                      <div className="group-avatar">
                        {group.nom.slice(0, 2).toUpperCase()}
                      </div>

                      {group.nom}

                    </div>

                  </td>

                  <td>{group.filiere?.nom}</td>

                  <td>
                    <span className="niveau">
                      Année {group.annee}
                    </span>
                  </td>

                  <td>
                    {effectif(group.id)} étudiants
                  </td>

                  <td>

                    <div className="actions">

                      <button onClick={() => openEditModal(group)}>
                        <FaEdit />
                      </button>

                      <button className="delete" onClick={() => handleDelete(group)}>
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

        {/* MODAL */}
        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h2>{editingId ? "Modifier le groupe" : "Ajouter un nouveau groupe"}</h2>

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
                  <label>Nom du groupe</label>

                  <input
                    type="text"
                    placeholder="Ex: DEV101-G1"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Filière</label>

                  <select
                    value={form.filiere_id}
                    onChange={(e) => setForm({ ...form, filiere_id: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((f) => (
                      <option key={f.id} value={f.id}>{f.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full">
                  <label>Année</label>

                  <select
                    value={form.annee}
                    onChange={(e) => setForm({ ...form, annee: e.target.value })}
                  >
                    <option value="1">1ère Année</option>
                    <option value="2">2ème Année</option>
                  </select>
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

      </main>

    </div>
  );
}
