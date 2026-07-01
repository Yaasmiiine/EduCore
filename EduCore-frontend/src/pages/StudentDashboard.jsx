import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext.jsx";
import modulesApi from "../api/modules";
import emploisDuTempsApi from "../api/emploisDuTemps";
import annoncesApi from "../api/annonces";

import {
  FaBook,
  FaCalendarAlt,
  FaBullhorn,
  FaChalkboardTeacher,
  FaClock
} from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const TODAY_JOUR = JOURS[(new Date().getDay() + 6) % 7] ?? "Lundi";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [modules, setModules] = useState([]);
  const [seances, setSeances] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.groupe_id) {
      setLoading(false);
      return;
    }

    Promise.all([
      modulesApi.list(),
      emploisDuTempsApi.list({ groupe_id: user.groupe_id }),
      annoncesApi.list(),
    ])
      .then(([modulesData, seancesData, annoncesData]) => {
        setModules(modulesData.filter((m) => m.filiere_id === user.groupe.filiere_id));
        setSeances(seancesData);
        setAnnonces(
          annoncesData.filter((a) => !a.groupe_id || a.groupe_id === user.groupe_id)
        );
        setError("");
      })
      .catch(() => setError("Impossible de charger le tableau de bord."))
      .finally(() => setLoading(false));
  }, [user]);

  const formateurs = useMemo(
    () => new Set(modules.map((m) => m.formateur_id)).size,
    [modules]
  );
  const coursAujourdhui = useMemo(
    () => seances.filter((s) => s.jour === TODAY_JOUR).length,
    [seances]
  );

  const heuresParModule = {
    labels: modules.map((m) => m.nom),
    datasets: [
      {
        data: modules.map((m) => m.heures_total),
        backgroundColor: ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#a855f7"],
      },
    ],
  };

  if (!user?.groupe_id) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main">
          <div className="topbar"><h1>Student Dashboard</h1></div>
          <p>Vous n'êtes rattaché à aucun groupe pour le moment. Contactez l'administration.</p>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main"><p>Chargement...</p></main>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <Sidebar />

      <main className="main">

        <div className="topbar">
          <h1>Student Dashboard</h1>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div className="stats">
          <div className="card stat-card">
            <div className="icon"><FaBook /></div>
            <div><p>Mes modules</p><h2>{modules.length}</h2></div>
          </div>
          <div className="card stat-card">
            <div className="icon"><FaChalkboardTeacher /></div>
            <div><p>Formateurs</p><h2>{formateurs}</h2></div>
          </div>
          <div className="card stat-card">
            <div className="icon"><FaClock /></div>
            <div><p>Cours aujourd'hui ({TODAY_JOUR})</p><h2>{coursAujourdhui}</h2></div>
          </div>
          <div className="card stat-card">
            <div className="icon"><FaBullhorn /></div>
            <div><p>Annonces</p><h2>{annonces.length}</h2></div>
          </div>
        </div>

        <div className="middle">

          <div className="actions">
            <h3>Accès rapide</h3>

            <div className="action-grids">
              <button onClick={() => navigate("/schedule")}><FaCalendarAlt /> Emploi du temps</button>
              <button onClick={() => navigate("/modules")}><FaBook /> Mes modules</button>
              <button className="primary" onClick={() => navigate("/announcements")}>
                <FaBullhorn /> Annonces
              </button>
            </div>
          </div>

          <div className="activity">
            <h3>Dernières annonces</h3>

            <ul>
              {annonces.length === 0 && <li>Aucune annonce</li>}
              {annonces.slice(0, 5).map((a) => (
                <li key={a.id}><FaBullhorn /> {a.titre}</li>
              ))}
            </ul>
          </div>

        </div>

        {modules.length > 0 && (
          <div className="charts">
            <div className="chart-box">
              <h3>Répartition des heures par module</h3>
              <Doughnut data={heuresParModule} />
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
