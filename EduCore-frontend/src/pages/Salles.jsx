// Salles.jsx

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import sallesApi from "../api/salles";
import "../styles/salles.css";

import {
  FaPlus,
  FaSearch,
  FaDoorOpen,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const EMPTY_FORM = { nom: "", code: "", batiment: "", capacite: "", equipement: "", statut: "disponible" };

export default function Salles() {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [batimentFilter, setBatimentFilter] = useState("");
  const [statutFilter, setStatutFilter] = useState("");

  const loadSalles = () => {
    setLoading(true);
    return sallesApi
      .list()
      .then(setSalles)
      .catch(() => setError("Impossible de charger les salles."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSalles();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (salle) => {
    setEditingId(salle.id);
    setForm({
      nom: salle.nom,
      code: salle.code,
      batiment: salle.batiment || "",
      capacite: salle.capacite,
      equipement: salle.equipement || "",
      statut: salle.statut,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = { ...form, capacite: Number(form.capacite) };
    try {
      if (editingId) {
        await sallesApi.update(editingId, payload);
      } else {
        await sallesApi.create(payload);
      }
      setShowModal(false);
      await loadSalles();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (salle) => {
    if (!window.confirm(`Supprimer la salle "${salle.nom}" ?`)) return;
    try {
      await sallesApi.remove(salle.id);
      setSalles((prev) => prev.filter((s) => s.id !== salle.id));
    } catch {
      setError("Impossible de supprimer cette salle.");
    }
  };

  const batiments = useMemo(
    () => [...new Set(salles.map((s) => s.batiment).filter(Boolean))],
    [salles]
  );

  const filteredSalles = useMemo(() => {
    return salles.filter((s) => {
      const matchesSearch = s.nom.toLowerCase().includes(search.toLowerCase());
      const matchesBatiment = !batimentFilter || s.batiment === batimentFilter;
      const matchesStatut = !statutFilter || s.statut === statutFilter;
      return matchesSearch && matchesBatiment && matchesStatut;
    });
  }, [salles, search, batimentFilter, statutFilter]);

  const disponibles = salles.filter((s) => s.statut === "disponible").length;
  const occupees = salles.filter((s) => s.statut === "occupee").length;

  return (
    <div className="dashboard">
      <Sidebar />
    <div className="salles-page">
      {/* HEADER */}
      <div className="salles-header">
        <div>
          <h1>Salles</h1>
          <p>Gérez les salles de votre établissement.</p>
        </div>

        <button
          className="add-salle-btn"
          onClick={openCreateModal}
        >
          <FaPlus />
          Ajouter une salle
        </button>
      </div>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaDoorOpen />
          </div>

          <div>
            <h2>{salles.length}</h2>
            <p>Total salles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <h2>{disponibles}</h2>
            <p>Salles disponibles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaClock />
          </div>

          <div>
            <h2>{occupees}</h2>
            <p>Salles occupées</p>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="table-container">
        {/* TOP */}
        <div className="table-top">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher une salle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters">
            <select value={batimentFilter} onChange={(e) => setBatimentFilter(e.target.value)}>
              <option value="">Bâtiment</option>
              {batiments.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}>
              <option value="">Statut</option>
              <option value="disponible">Disponible</option>
              <option value="occupee">Occupée</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <p style={{ padding: 24 }}>Chargement...</p>
        ) : (
        <table className="salles-table">
          <thead>
            <tr>
              <th>Nom de la salle</th>
              <th>Code</th>
              <th>Bâtiment</th>
              <th>Capacité</th>
              <th>Équipement</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSalles.map((salle) => (
              <tr key={salle.id}>
                <td className="salle-name">{salle.nom}</td>
                <td>{salle.code}</td>
                <td>{salle.batiment}</td>
                <td>{salle.capacite}</td>
                <td>{salle.equipement}</td>

                <td>
                  <span
                    className={
                      salle.statut === "disponible"
                        ? "status available"
                        : "status occupied"
                    }
                  >
                    {salle.statut}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => openEditModal(salle)}>
                      <FaEdit />
                    </button>

                    <button className="delete-btn" onClick={() => handleDelete(salle)}>
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
              <h2>{editingId ? "Modifier la salle" : "Ajouter une salle"}</h2>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {formError && <p style={{ color: "#dc2626" }}>{formError}</p>}

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom de la salle</label>
                <input
                  type="text"
                  placeholder="Salle 101"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  placeholder="S101"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bâtiment</label>
                <input
                  type="text"
                  placeholder="Bâtiment A"
                  value={form.batiment}
                  onChange={(e) => setForm({ ...form, batiment: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Capacité</label>
                <input
                  type="number"
                  placeholder="40"
                  value={form.capacite}
                  onChange={(e) => setForm({ ...form, capacite: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full">
                <label>Équipement</label>
                <textarea
                  placeholder="Projecteur, Tableau..."
                  value={form.equipement}
                  onChange={(e) => setForm({ ...form, equipement: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => setForm({ ...form, statut: e.target.value })}
                >
                  <option value="disponible">Disponible</option>
                  <option value="occupee">Occupée</option>
                  <option value="maintenance">Maintenance</option>
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

                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
