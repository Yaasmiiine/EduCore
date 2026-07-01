// src/pages/Modules.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/modules.css";
import Sidebar from "../components/Sidebar";
import modulesApi from "../api/modules";
import filieresApi from "../api/filieres";
import usersApi from "../api/users";
import { useAuth } from "../context/AuthContext.jsx";

import {
  FaBook,
  FaSearch,
  FaUserTie,
  FaUniversity,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

const CARD_COLORS = [
  { bg: "#e8f0ff", icon: "#2563eb" },
  { bg: "#e7f9f1", icon: "#10b981" },
  { bg: "#f2ebff", icon: "#7c3aed" },
  { bg: "#fff3df", icon: "#f59e0b" },
  { bg: "#ffe9ef", icon: "#ec4899" },
  { bg: "#e8f8ff", icon: "#06b6d4" },
];

const EMPTY_FORM = { nom: "", code: "", description: "", filiere_id: "", formateur_id: "", heures_total: "" };

export default function Modules() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [modules, setModules] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadAll = () => {
    setLoading(true);
    const requests = isAdmin
      ? [modulesApi.list(), filieresApi.list(), usersApi.list()]
      : [modulesApi.list(), filieresApi.list()];

    return Promise.all(requests)
      .then(([modulesData, filieresData, usersData]) => {
        setModules(modulesData);
        setFilieres(filieresData);
        if (usersData) setFormateurs(usersData.filter((u) => u.role?.nom === "formateur"));
        setError("");
      })
      .catch(() => setError("Impossible de charger les modules."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = { ...form, heures_total: Number(form.heures_total) };
    try {
      await modulesApi.create(payload);
      setShowModal(false);
      await loadAll();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (module) => {
    if (!window.confirm(`Supprimer le module "${module.nom}" ?`)) return;
    try {
      await modulesApi.remove(module.id);
      setModules((prev) => prev.filter((m) => m.id !== module.id));
    } catch {
      setError("Impossible de supprimer ce module.");
    }
  };

  const filteredModules = useMemo(
    () => modules.filter((m) => m.nom.toLowerCase().includes(search.toLowerCase())),
    [modules, search]
  );

  return (
  <div className="dashboard">
          <Sidebar />
    <div className="modules-page">
      <div className="modules-header">
        <div>
          <h1>Modules</h1>
          <p>Consultez et gérez les modules de formation.</p>
        </div>

        <div className="modules-actions">
          {isAdmin && (
            <button
              className="add-module-btn"
              onClick={openCreateModal}
            >
              <FaPlus />
              Ajouter un module
            </button>
          )}
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher un module..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {loading ? (
        <p>Chargement...</p>
      ) : (
      <div className="modules-grid">
        {filteredModules.map((module, index) => {
          const colors = CARD_COLORS[index % CARD_COLORS.length];
          return (
          <div className="module-card" key={module.id}>
            <div
              className="module-icon"
              style={{
                background: colors.bg,
                color: colors.icon,
              }}
            >
              <FaBook />
            </div>

            <h2>{module.nom}</h2>

            <p className="module-description">{module.description}</p>

            <div className="module-info">
              <div className="info-row">
                <div className="info-left">
                  <FaUserTie />
                  <span>Formateur</span>
                </div>
                <span className="info-value">
                  {module.formateur ? `${module.formateur.prenom} ${module.formateur.nom}` : "—"}
                </span>
              </div>

              <div className="info-row">
                <div className="info-left">
                  <FaUniversity />
                  <span>Filière</span>
                </div>
                <span className="info-value">{module.filiere?.nom}</span>
              </div>

              <div className="info-row">
                <div className="info-left">
                  <FaClock />
                  <span>Heures</span>
                </div>
                <span className="credits">{module.heures_total}h</span>
              </div>
            </div>

            {isAdmin && (
              <button className="delete-module-btn" onClick={() => handleDelete(module)} title="Supprimer">
                <FaTrash />
              </button>
            )}
          </div>
          );
        })}
      </div>
      )}

      {showModal && (
  <div
    className="modal-overlay"
    onClick={() => setShowModal(false)}
  >
    <div
      className="module-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>Ajouter un module</h2>

        <button onClick={() => setShowModal(false)}>
          <FaTimes />
        </button>
      </div>

      {formError && <p style={{ color: "#dc2626" }}>{formError}</p>}

      <form className="module-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du module</label>
          <input
            type="text"
            placeholder="Développement Web"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Description du module..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Code</label>
            <input
              type="text"
              placeholder="DEV-WEB-101"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Heures totales</label>
            <input
              type="number"
              placeholder="120"
              value={form.heures_total}
              onChange={(e) => setForm({ ...form, heures_total: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
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

          <div className="form-group">
            <label>Formateur</label>
            <select
              value={form.formateur_id}
              onChange={(e) => setForm({ ...form, formateur_id: e.target.value })}
              required
            >
              <option value="">Sélectionner un formateur</option>
              {formateurs.map((f) => (
                <option key={f.id} value={f.id}>{f.prenom} {f.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="submit-module" disabled={saving}>
          {saving ? "Enregistrement..." : "Ajouter le module"}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
</div>
  );
}
