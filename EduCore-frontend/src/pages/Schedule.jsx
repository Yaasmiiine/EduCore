import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import "../styles/schedule.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext.jsx";
import emploisDuTempsApi from "../api/emploisDuTemps";
import groupesApi from "../api/groupes";
import modulesApi from "../api/modules";
import sallesApi from "../api/salles";
import usersApi from "../api/users";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const COLORS = ["blue", "green", "yellow", "purple"];

const EMPTY_FORM = { module_id: "", formateur_id: "", salle_id: "", jour: "Lundi", heure_debut: "", heure_fin: "" };

export default function Schedule() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [groupes, setGroupes] = useState([]);
  const [selectedGroupeId, setSelectedGroupeId] = useState("");
  const [seances, setSeances] = useState([]);
  const [modules, setModules] = useState([]);
  const [salles, setSalles] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Initial load: groupes + reference data (modules/salles/formateurs only needed for admin's add form)
  useEffect(() => {
    const requests = isAdmin
      ? [groupesApi.list(), modulesApi.list(), sallesApi.list(), usersApi.list()]
      : [groupesApi.list()];

    Promise.all(requests)
      .then(([groupesData, modulesData, sallesData, usersData]) => {
        setGroupes(groupesData);
        if (modulesData) setModules(modulesData);
        if (sallesData) setSalles(sallesData);
        if (usersData) setFormateurs(usersData.filter((u) => u.role?.nom === "formateur"));

        // Default selection: student -> their own groupe; teacher/admin -> first groupe
        const defaultGroupeId = role === "student" ? user?.groupe_id : groupesData[0]?.id;
        if (defaultGroupeId) setSelectedGroupeId(String(defaultGroupeId));
      })
      .catch(() => setError("Impossible de charger les données."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSeances = (groupeId) => {
    if (!groupeId) return;
    setLoading(true);
    emploisDuTempsApi
      .list({ groupe_id: groupeId })
      .then(setSeances)
      .catch(() => setError("Impossible de charger l'emploi du temps."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedGroupeId) loadSeances(selectedGroupeId);
  }, [selectedGroupeId]);

  const timeSlots = useMemo(() => {
    const unique = new Map();
    seances.forEach((s) => {
      const key = `${s.heure_debut}-${s.heure_fin}`;
      unique.set(key, { heure_debut: s.heure_debut, heure_fin: s.heure_fin });
    });
    return [...unique.values()].sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
  }, [seances]);

  const findSeance = (jour, slot) =>
    seances.find((s) => s.jour === jour && s.heure_debut === slot.heure_debut && s.heure_fin === slot.heure_fin);

  const selectedGroupe = groupes.find((g) => String(g.id) === String(selectedGroupeId));

  const modulesForGroupe = useMemo(() => {
    if (!selectedGroupe) return modules;
    return modules.filter((m) => m.filiere_id === selectedGroupe.filiere_id);
  }, [modules, selectedGroupe]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await emploisDuTempsApi.create({ ...form, groupe_id: selectedGroupeId });
      setModalOpen(false);
      loadSeances(selectedGroupeId);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (seance) => {
    if (!window.confirm(`Supprimer la séance "${seance.module?.nom}" (${seance.jour}) ?`)) return;
    try {
      await emploisDuTempsApi.remove(seance.id);
      setSeances((prev) => prev.filter((s) => s.id !== seance.id));
    } catch {
      setError("Impossible de supprimer cette séance.");
    }
  };

  const renderCourse = (seance) => {
    if (!seance) return <div className="empty-slot">—</div>;
    const color = COLORS[seance.module_id % COLORS.length];
    return (
      <div className={`course-card ${color}`}>
        {isAdmin && (
          <button className="delete-slot-btn" onClick={() => handleDelete(seance)} title="Supprimer">
            <FaTimes />
          </button>
        )}
        <h4>{seance.module?.nom}</h4>
        <p>{seance.formateur?.prenom} {seance.formateur?.nom}</p>
        <span>{seance.salle?.nom}</span>
      </div>
    );
  };

  return (
    <div className="dashboard">

          <Sidebar />
    <div className="schedule-page">
      {/* TOPBAR */}
      <div className="schedule-topbar">
        <div className="topbar-left">
          <h1>Emplois du temps</h1>
        </div>
      </div>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {/* FILTERS */}
      <div className="schedule-filters">
        <div className="filter-group">
          <label>Groupe</label>
          <select
            value={selectedGroupeId}
            onChange={(e) => setSelectedGroupeId(e.target.value)}
            disabled={role === "student"}
          >
            {groupes.map((g) => (
              <option key={g.id} value={g.id}>{g.filiere?.nom} — {g.nom}</option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <button
            className="add-btn"
            onClick={openCreateModal}
            disabled={!selectedGroupeId}
          >
            <FaPlus />
            Ajouter une séance
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="schedule-table-wrapper">
        {loading ? (
          <p style={{ padding: 24 }}>Chargement...</p>
        ) : timeSlots.length === 0 ? (
          <p style={{ padding: 24 }}>Aucune séance programmée pour ce groupe.</p>
        ) : (
        <table className="schedule-table">
          <thead>
            <tr>
              <th></th>
              {JOURS.map((jour) => (
                <th key={jour}>{jour}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {timeSlots.map((slot, index) => (
              <tr key={index}>
                <td className="time-cell">{slot.heure_debut.slice(0, 5)} - {slot.heure_fin.slice(0, 5)}</td>
                {JOURS.map((jour) => (
                  <td key={jour}>{renderCourse(findSeance(jour, slot))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        )}

        <div className="schedule-footer">
          ⓘ {isAdmin ? "Cliquez sur ✕ pour supprimer une séance." : "Consultation de l'emploi du temps."}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
  <div className="modal-overlay">
    <div className="schedule-modal">

      {/* HEADER */}
      <div className="modal-header">
        <h2>Ajouter une séance</h2>

        <button onClick={() => setModalOpen(false)}>
          ✕
        </button>
      </div>

      {formError && <p style={{ color: "#dc2626" }}>{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="manual-content">

          <div className="manual-grid">

            <select
              value={form.module_id}
              onChange={(e) => setForm({ ...form, module_id: e.target.value })}
              required
            >
              <option value="">Module</option>
              {modulesForGroupe.map((m) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>

            <select
              value={form.formateur_id}
              onChange={(e) => setForm({ ...form, formateur_id: e.target.value })}
              required
            >
              <option value="">Formateur</option>
              {formateurs.map((f) => (
                <option key={f.id} value={f.id}>{f.prenom} {f.nom}</option>
              ))}
            </select>

            <select
              value={form.salle_id}
              onChange={(e) => setForm({ ...form, salle_id: e.target.value })}
              required
            >
              <option value="">Salle</option>
              {salles.map((s) => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>

            <select
              value={form.jour}
              onChange={(e) => setForm({ ...form, jour: e.target.value })}
              required
            >
              {JOURS.map((jour) => (
                <option key={jour} value={jour}>{jour}</option>
              ))}
            </select>

            <input
              type="time"
              placeholder="Heure de début"
              value={form.heure_debut}
              onChange={(e) => setForm({ ...form, heure_debut: e.target.value })}
              required
            />

            <input
              type="time"
              placeholder="Heure de fin"
              value={form.heure_fin}
              onChange={(e) => setForm({ ...form, heure_fin: e.target.value })}
              required
            />

          </div>

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="generate-btn"
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "Ajouter"}
            </button>

          </div>

        </div>
      </form>

    </div>
  </div>
)}
    </div>
    </div>
  );
}
