import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext.jsx";
import modulesApi from "../api/modules";
import emploisDuTempsApi from "../api/emploisDuTemps";
import annoncesApi from "../api/annonces";

import {
  FaBookOpen,
  FaUsers,
  FaCalendarAlt,
  FaBullhorn,
  FaClock
} from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const TODAY_JOUR = JOURS[(new Date().getDay() + 6) % 7] ?? "Lundi";

function hoursBetween(start, end) {
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  return (h2 * 60 + m2 - (h1 * 60 + m1)) / 60;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [modules, setModules] = useState([]);
  const [seances, setSeances] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([modulesApi.list(), emploisDuTempsApi.list({ formateur_id: user.id }), annoncesApi.list()])
      .then(([modulesData, seancesData, annoncesData]) => {
        setModules(modulesData.filter((m) => m.formateur_id === user.id));
        setSeances(seancesData);
        setAnnonces(annoncesData.filter((a) => a.auteur_id === user.id));
        setError("");
      })
      .catch(() => setError("Impossible de charger le tableau de bord."))
      .finally(() => setLoading(false));
  }, [user]);

  const groupesEnseignes = useMemo(
    () => new Set(seances.map((s) => s.groupe_id)).size,
    [seances]
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

  const seancesParJour = {
    labels: JOURS,
    datasets: [
      {
        label: "Séances",
        data: JOURS.map((j) => seances.filter((s) => s.jour === j).length),
        backgroundColor: "#6366f1",
      },
    ],
  };

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
          <h1>Teacher Dashboard</h1>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div className="stats">
          <div className="card stat-card">
            <div className="icon"><FaBookOpen /></div>
            <div><p>Modules</p><h2>{modules.length}</h2></div>
          </div>
          <div className="card stat-card">
            <div className="icon"><FaUsers /></div>
            <div><p>Groupes enseignés</p><h2>{groupesEnseignes}</h2></div>
          </div>
          <div className="card stat-card">
            <div className="icon"><FaClock /></div>
            <div><p>Cours aujourd'hui ({TODAY_JOUR})</p><h2>{coursAujourdhui}</h2></div>
          </div>
          <div className="card stat-card">
            <div className="icon"><FaBullhorn /></div>
            <div><p>Mes annonces</p><h2>{annonces.length}</h2></div>
          </div>
        </div>

        <div className="middle">

          <div className="actions">
            <h3>Actions rapides</h3>

            <div className="action-grid">
              <button onClick={() => navigate("/modules")}><FaBookOpen /> Mes modules</button>
              <button onClick={() => navigate("/schedule")}><FaCalendarAlt /> Voir emploi</button>
              <button className="primary" onClick={() => navigate("/announcements")}>
                <FaBullhorn /> Publier annonce
              </button>
            </div>
          </div>

          <div className="activity">
            <h3>Mes dernières annonces</h3>

            <ul>
              {annonces.length === 0 && <li>Aucune annonce publiée</li>}
              {annonces.slice(0, 5).map((a) => (
                <li key={a.id}><FaBullhorn /> {a.titre}</li>
              ))}
            </ul>
          </div>

        </div>

        <div className="charts">

          {modules.length > 0 && (
            <div className="chart-box">
              <h3>Heures par module</h3>
              <Doughnut data={heuresParModule} />
            </div>
          )}

          <div className="chart-box wide">
            <h3>Séances par jour</h3>
            <Bar data={seancesParJour} />
          </div>

        </div>

      </main>

    </div>
  );
}
