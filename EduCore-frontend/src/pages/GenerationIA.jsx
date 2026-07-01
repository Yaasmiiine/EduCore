// src/pages/GenerationIA.jsx

import { useEffect, useState } from "react";
import "../styles/generationIA.css";
import Sidebar from "../components/Sidebar";
import groupesApi from "../api/groupes";
import modulesApi from "../api/modules";
import sallesApi from "../api/salles";
import emploisDuTempsApi from "../api/emploisDuTemps";

import {
  FaMagic,
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaShieldAlt,
  FaSave,
} from "react-icons/fa";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default function GenerationIA() {
  const [groupes, setGroupes] = useState([]);
  const [modules, setModules] = useState([]);
  const [salles, setSalles] = useState([]);
  const [selectedGroupeId, setSelectedGroupeId] = useState("");

  const [draft, setDraft] = useState(null);
  const [included, setIncluded] = useState({});
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([groupesApi.list(), modulesApi.list(), sallesApi.list()])
      .then(([groupesData, modulesData, sallesData]) => {
        setGroupes(groupesData);
        setModules(modulesData);
        setSalles(sallesData);
        if (groupesData[0]) setSelectedGroupeId(String(groupesData[0].id));
      })
      .catch(() => setError("Impossible de charger les données."));
  }, []);

  const selectedGroupe = groupes.find((g) => String(g.id) === String(selectedGroupeId));
  const modulesForGroupe = selectedGroupe ? modules.filter((m) => m.filiere_id === selectedGroupe.filiere_id) : [];
  const sallesDisponibles = salles.filter((s) => s.statut === "disponible");

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setDraft(null);
    setSaved(false);
    try {
      const { draft: proposals } = await emploisDuTempsApi.generateIA(selectedGroupeId);
      setDraft(proposals);
      const defaults = {};
      proposals.forEach((p, i) => { defaults[i] = !p.has_conflict; });
      setIncluded(defaults);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la génération IA.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    const seances = draft.filter((_, i) => included[i]);
    if (seances.length === 0) return;
    setSaving(true);
    setError("");
    try {
      await emploisDuTempsApi.bulkCreate(seances);
      setSaved(true);
      setDraft(null);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(" ") : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const findModule = (id) => modules.find((m) => m.id === id);
  const findSalle = (id) => salles.find((s) => s.id === id);

  const conflictCount = draft ? draft.filter((p) => p.has_conflict).length : 0;
  const includedCount = draft ? draft.filter((_, i) => included[i]).length : 0;

  return (
    <div className="dashboard">
      <Sidebar />
    <div className="layout">

      <div className="generation-page">
        <div className="generation-top">
          <div>
            <p className="breadcrumb">
              Emplois du temps &gt; Génération IA
            </p>

            <div className="title-row">
              <FaMagic className="title-icon" />
              <div>
                <h1>Génération d'emplois IA</h1>
                <p>
                  Générez automatiquement une proposition d'emploi du temps
                  pour un groupe grâce à l'intelligence artificielle (Gemini)
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div className="generation-grid">
          {/* LEFT */}
          <div className="left-column">
            <div className="card">
              <h3>1. Sélection du groupe</h3>

              <div className="form-group">
                <label>Groupe</label>
                <select value={selectedGroupeId} onChange={(e) => setSelectedGroupeId(e.target.value)}>
                  {groupes.map((g) => (
                    <option key={g.id} value={g.id}>{g.filiere?.nom} — {g.nom}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Aperçu des données disponibles</label>

                <div className="stats-grid">
                  <div className="stat-card">
                    <FaBook />
                    <h2>{modulesForGroupe.length}</h2>
                    <p>Modules</p>
                  </div>

                  <div className="stat-card">
                    <FaChalkboardTeacher />
                    <h2>{new Set(modulesForGroupe.map((m) => m.formateur_id)).size}</h2>
                    <p>Formateurs</p>
                  </div>

                  <div className="stat-card">
                    <FaDoorOpen />
                    <h2>{sallesDisponibles.length}</h2>
                    <p>Salles disponibles</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="generate-btn" onClick={handleGenerate} disabled={generating || !selectedGroupeId || modulesForGroupe.length === 0}>
              <FaMagic />
              {generating ? "GÉNÉRATION EN COURS..." : "GÉNÉRER L'EMPLOI DU TEMPS IA"}
            </button>

            <p className="ai-note">
              L'IA propose un emploi du temps ; les créneaux en conflit avec
              l'existant sont automatiquement détectés et décochés.
            </p>

            {saved && <p style={{ color: "#16a34a", fontWeight: 600 }}>Emploi du temps enregistré avec succès ✅</p>}
          </div>

          {/* RIGHT */}
          <div className="right-column">
            {draft && (
            <div className="card preview-card">
              <div className="preview-top">
                <div>
                  <h3>2. Aperçu du résultat généré</h3>
                </div>

                <div className="success-badge">
                  {draft.length} créneau(x) proposé(s)
                </div>
              </div>

              <div className="timetable">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      {JOURS.map((j) => <th key={j}>{j.slice(0, 3)}.</th>)}
                    </tr>
                  </thead>

                  <tbody>
                    {[...new Set(draft.map((p) => `${p.heure_debut}-${p.heure_fin}`))].sort().map((slotKey) => {
                      const [hd, hf] = slotKey.split("-");
                      return (
                        <tr key={slotKey}>
                          <td className="time">{hd}{"\n"}{hf}</td>
                          {JOURS.map((jour) => {
                            const idx = draft.findIndex((p) => p.jour === jour && p.heure_debut === hd && p.heure_fin === hf);
                            const p = idx >= 0 ? draft[idx] : null;
                            return (
                              <td key={jour}>
                                {p && (
                                  <label className={`course ${p.has_conflict ? "pink" : "green"}`} style={{ display: "block", cursor: "pointer" }}>
                                    <input
                                      type="checkbox"
                                      checked={!!included[idx]}
                                      onChange={(e) => setIncluded({ ...included, [idx]: e.target.checked })}
                                      style={{ marginRight: 6 }}
                                    />
                                    {findModule(p.module_id)?.nom}
                                    {"\n"}{findSalle(p.salle_id)?.nom}
                                    {p.has_conflict && "\n⚠ conflit"}
                                  </label>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bottom-stats">
                <div>
                  <FaShieldAlt />
                  <span>{conflictCount} conflit(s) détecté(s)</span>
                </div>

                <div>
                  <FaUsers />
                  <span>{includedCount} créneau(x) sélectionné(s)</span>
                </div>
              </div>

              <div className="bottom-actions">
                <button className="save-btn" onClick={handleSave} disabled={saving || includedCount === 0}>
                  <FaSave />
                  {saving ? "Enregistrement..." : "Enregistrer l'emploi"}
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
