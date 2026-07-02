import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import presencesApi from "../api/presences";
import modulesApi from "../api/modules";
import emploisDuTempsApi from "../api/emploisDuTemps";
import { useAuth } from "../context/AuthContext.jsx";

const today = () => new Date().toISOString().slice(0, 10);

export default function AttendanceSheet() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";

  const [modules, setModules] = useState([]);
  const [moduleId, setModuleId] = useState("");
  const [groupeId, setGroupeId] = useState("");
  const [seances, setSeances] = useState([]);
  const [seanceId, setSeanceId] = useState("");
  const [date, setDate] = useState(today());

  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      modulesApi.list(),
      emploisDuTempsApi.list(isAdmin ? {} : { formateur_id: user?.id }),
    ])
      .then(([modulesData, seancesData]) => {
        const mine = isAdmin ? modulesData : modulesData.filter((m) => m.formateur_id === user?.id);
        setModules(mine);
        setSeances(seancesData);
        if (mine[0]) setModuleId(String(mine[0].id));
      })
      .catch(() => setError("Impossible de charger les modules."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seancesForModule = useMemo(
    () => seances.filter((s) => String(s.module_id) === String(moduleId)),
    [seances, moduleId]
  );

  // The groupes a formateur can pick from a module's actual scheduled
  // séances — a module taught to several classes would otherwise dump every
  // groupe's séances into one long, hard-to-scan list.
  const groupesForModule = useMemo(() => {
    const seen = new Map();
    seancesForModule.forEach((s) => {
      if (s.groupe && !seen.has(s.groupe_id)) seen.set(s.groupe_id, s.groupe);
    });
    return [...seen.values()];
  }, [seancesForModule]);

  useEffect(() => setGroupeId(""), [moduleId]);

  const seancesForModuleAndGroupe = useMemo(
    () => seancesForModule.filter((s) => !groupeId || String(s.groupe_id) === groupeId),
    [seancesForModule, groupeId]
  );

  useEffect(() => {
    setSeanceId(seancesForModuleAndGroupe[0] ? String(seancesForModuleAndGroupe[0].id) : "");
  }, [seancesForModuleAndGroupe]);

  const loadSheet = () => {
    if (!seanceId || !date) return;
    setLoading(true);
    setSuccess("");
    presencesApi
      .seance(seanceId, date)
      .then((data) => setEtudiants(data.etudiants))
      .catch(() => setError("Impossible de charger la feuille de présence."))
      .finally(() => setLoading(false));
  };

  useEffect(loadSheet, [seanceId, date]);

  const setStatut = (userId, statut) => {
    setEtudiants((prev) => prev.map((e) => (e.user_id === userId ? { ...e, statut } : e)));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const presences = etudiants.filter((e) => e.statut).map((e) => ({ user_id: e.user_id, statut: e.statut }));
      if (presences.length === 0) {
        setError("Marquez au moins un étudiant avant d'enregistrer.");
        return;
      }
      await presencesApi.bulkSave(seanceId, date, presences);
      setSuccess("Présences enregistrées avec succès.");
    } catch {
      setError("Impossible d'enregistrer les présences.");
    } finally {
      setSaving(false);
    }
  };

  const selectedSeance = seances.find((s) => String(s.id) === String(seanceId));

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Feuille de présence</h1>
            <p>Marquez la présence des étudiants pour une séance et une date données.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}
        {success && <p style={{ color: "var(--color-success)", marginBottom: 16 }}>{success}</p>}

        <div className="academic-toolbar">
          <div className="field">
            <label>Module</label>
            <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
              {modules.length === 0 && <option value="">Aucun module</option>}
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Groupe</label>
            <select value={groupeId} onChange={(e) => setGroupeId(e.target.value)}>
              <option value="">Tous les groupes</option>
              {groupesForModule.map((g) => (
                <option key={g.id} value={g.id}>{g.nom}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Séance</label>
            <select value={seanceId} onChange={(e) => setSeanceId(e.target.value)}>
              {seancesForModuleAndGroupe.length === 0 && <option value="">Aucune séance</option>}
              {seancesForModuleAndGroupe.map((s) => (
                <option key={s.id} value={s.id}>{s.jour} {s.heure_debut?.slice(0, 5)}-{s.heure_fin?.slice(0, 5)} ({s.groupe?.nom})</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <button className="academic-btn" onClick={handleSave} disabled={saving || !seanceId || loading}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : !seanceId ? (
          <p>Sélectionnez une séance.</p>
        ) : etudiants.length === 0 ? (
          <p>Aucun étudiant dans ce groupe.</p>
        ) : (
          <div className="academic-module-card">
            <div className="module-card-header">
              <div>
                <h3>{selectedSeance?.groupe?.nom} — {selectedSeance?.jour} {date}</h3>
                <p>{etudiants.length} étudiant(s)</p>
              </div>
            </div>

            <div className="attendance-list">
              {etudiants.map((e) => (
                <div className="attendance-row" key={e.user_id}>
                  <span className="student-name">{e.prenom} {e.nom}</span>
                  <div className="status-buttons">
                    <button
                      className={`present ${e.statut === "present" ? "active" : ""}`}
                      onClick={() => setStatut(e.user_id, "present")}
                    >
                      Présent
                    </button>
                    <button
                      className={`retard ${e.statut === "retard" ? "active" : ""}`}
                      onClick={() => setStatut(e.user_id, "retard")}
                    >
                      Retard
                    </button>
                    <button
                      className={`absent ${e.statut === "absent" ? "active" : ""}`}
                      onClick={() => setStatut(e.user_id, "absent")}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
