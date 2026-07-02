import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import { getDashboard } from "../api/dashboard";
import filieresApi from "../api/filieres";
import modulesApi from "../api/modules";

import {
  FaUserPlus,
  FaSchool,
  FaUsersCog,
  FaBookOpen,
  FaCalendarPlus,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLayerGroup,
  FaBook,
  FaCalendarAlt,
  FaBullhorn
} from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { doughnutChartOptions } from "../utils/chartAnimations";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const FILIERE_COLORS = ["#3b82f6", "#10b981", "#f97316", "#a855f7", "#ec4899", "#06b6d4"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [filiereChart, setFiliereChart] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch(() => setError("Impossible de charger les statistiques."));

    Promise.all([filieresApi.list(), modulesApi.list()])
      .then(([filieres, modules]) => {
        const labels = filieres.map((f) => f.nom);
        const data = filieres.map((f) => modules.filter((m) => m.filiere_id === f.id).length);
        setFiliereChart({
          labels,
          datasets: [{ data, backgroundColor: FILIERE_COLORS }],
        });
      })
      .catch(() => {});
  }, []);

  if (error) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main"><p style={{ color: "#dc2626" }}>{error}</p></main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main"><p>Chargement...</p></main>
      </div>
    );
  }

  const totalAdmins = dashboard.total_users - dashboard.total_formateurs - dashboard.total_stagiaires;

  const stats = [
    { title: "Total Utilisateurs", icon: <FaUsers />, value: dashboard.total_users },
    { title: "Étudiants", icon: <FaUserGraduate />, value: dashboard.total_stagiaires },
    { title: "Enseignants", icon: <FaChalkboardTeacher />, value: dashboard.total_formateurs },
    { title: "Groupes", icon: <FaLayerGroup />, value: dashboard.total_groupes },
    { title: "Modules", icon: <FaBook />, value: dashboard.total_modules },
    { title: "Fichiers", icon: <FaCalendarAlt />, value: dashboard.total_fichiers },
    { title: "Annonces", icon: <FaBullhorn />, value: dashboard.total_annonces }
  ];

  const userChart = {
    labels: ["Étudiants", "Enseignants", "Admins"],
    datasets: [
      {
        data: [dashboard.total_stagiaires, dashboard.total_formateurs, totalAdmins],
        backgroundColor: ["#6366f1", "#22c55e", "#f59e0b"]
      }
    ]
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="stats">
          {stats.map((s, i) => (
            <div className="card stat-card" key={i}>
              <div className="icon">{s.icon}</div>
              <div>
                <p>{s.title}</p>
                <h2>{s.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Middle */}
        <div className="middle">
          {/* Actions */}
          <div className="actions">
            <h3>Actions rapides</h3>

            <div className="action-grids">
              <button onClick={() => navigate("/users")}><FaUserPlus /> Ajouter utilisateur</button>
              <button onClick={() => navigate("/filieres")}><FaSchool /> Créer filière</button>
              <button onClick={() => navigate("/groups")}><FaUsersCog /> Créer groupe</button>
              <button onClick={() => navigate("/modules")}><FaBookOpen /> Ajouter module</button>
              <button onClick={() => navigate("/schedule")}><FaCalendarPlus /> Générer emploi</button>
              <button className="primary" onClick={() => navigate("/announcements")}><FaBullhorn /> Publier annonce</button>
            </div>
          </div>

          {/* Activity */}
          <div className="activity">
            <h3>Dernières annonces</h3>
            <ul>
              {dashboard.annonces_recentes.length === 0 && <li>Aucune annonce récente</li>}
              {dashboard.annonces_recentes.map((a) => (
                <li key={a.id}><FaBullhorn /> {a.titre}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="chart-box">
            <h3>Répartition des utilisateurs</h3>
            <Doughnut data={userChart} options={doughnutChartOptions} />
          </div>

          {filiereChart && (
            <div className="chart-box">
              <h3>Modules par filière</h3>
              <Doughnut data={filiereChart} options={doughnutChartOptions} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
