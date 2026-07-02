// Salles.jsx

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
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
  const [meta, setMeta] = useState(null);
  const [allSalles, setAllSalles] = useState([]);
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
  const [page, setPage] = useState(1);

  const loadSalles = () => {
    setLoading(true);
    return sallesApi
      .list({
        page,
        per_page: 10,
        search: search || undefined,
        batiment: batimentFilter || undefined,
        statut: statutFilter || undefined,
      })
      .then((res) => {
        setSalles(res.data);
        setMeta(res);
        setError("");
      })
      .catch(() => setError("Impossible de charger les salles."))
      .finally(() => setLoading(false));
  };

  // The full unpaginated list feeds the stat cards and the "bâtiment" filter
  // options, so those stay accurate regardless of which page is shown.
  useEffect(() => {
    sallesApi.list().then(setAllSalles).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(loadSalles, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, batimentFilter, statutFilter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleBatimentFilterChange = (e) => {
    setBatimentFilter(e.target.value);
    setPage(1);
  };

  const handleStatutFilterChange = (e) => {
    setStatutFilter(e.target.value);
    setPage(1);
  };

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
      sallesApi.list().then(setAllSalles).catch(() => {});
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
      loadSalles();
      sallesApi.list().then(setAllSalles).catch(() => {});
    } catch {
      setError("Impossible de supprimer cette salle.");
    }
  };

  const batiments = useMemo(
    () => [...new Set(allSalles.map((s) => s.batiment).filter(Boolean))],
    [allSalles]
  );

  const disponibles = allSalles.filter((s) => s.statut === "disponible").length;
  const occupees = allSalles.filter((s) => s.statut === "occupee").length;

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
            <h2>{meta?.total ?? allSalles.length}</h2>
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
              onChange={handleSearchChange}
            />
          </div>

          <div className="filters">
            <select value={batimentFilter} onChange={handleBatimentFilterChange}>
              <option value="">Bâtiment</option>
              {batiments.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select value={statutFilter} onChange={handleStatutFilterChange}>
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
            {salles.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>Aucune salle trouvée.</td></tr>
            )}

            {salles.map((salle) => (
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

        {!loading && meta && (
          <div className="table-footer">
            <p>{meta.total} résultat(s) — page {meta.current_page} / {meta.last_page}</p>
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
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
