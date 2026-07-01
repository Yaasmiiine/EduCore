import { FaUser, FaCalendarCheck } from "react-icons/fa";
import "../styles/dashboard.css";
import  Sidebar  from "../components/Sidebar";

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
  PointElement,
  LineElement
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const stats = [
    { title: "Total Utilisateurs", icon: <FaUsers />, value: 1248 },
    { title: "Étudiants", icon: <FaUserGraduate />, value: 912 },
    { title: "Enseignants", icon: <FaChalkboardTeacher />, value: 275 },
    { title: "Filières", icon: <FaLayerGroup />, value: 24 },
    { title: "Modules", icon: <FaBook />, value: 156 },
    { title: "Emplois du temps", icon: <FaCalendarAlt />, value: 78 },
    { title: "Annonces", icon: <FaBullhorn />, value: 5 }
  ];

  const userChart = {
    labels: ["Étudiants", "Enseignants", "Admins"],
    datasets: [
      {
        data: [912, 275, 61],
        backgroundColor: ["#6366f1", "#22c55e", "#f59e0b"]
      }
    ]
  };

  const filiereChart = {
    labels: ["Info", "Gestion", "Génie Civil", "Autres"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ["#3b82f6", "#10b981", "#f97316", "#a855f7"]
      }
    ]
  };

  const activityChart = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Connexions",
        data: [400, 600, 700, 500, 650, 550, 400],
        borderColor: "#6366f1",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar role="admin" />

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
          <div className="actionss">
            <h3>Actions rapides</h3>

            <div className="action-grids">
              <button><FaUserPlus /> Ajouter utilisateur</button>
              <button><FaSchool /> Créer filière</button>
              <button><FaUsersCog /> Créer groupe</button>
              <button><FaBookOpen /> Ajouter module</button>
              <button><FaCalendarPlus /> Générer emploi</button>
              <button className="primary"><FaBullhorn /> Publier annonce</button>
            </div>
          </div>

          {/* Activity */}
          <div className="activity">
            <h3>Activité récente</h3>
            <ul>
              <li><FaUser /> Nouvel utilisateur ajouté</li>
              <li><FaCalendarCheck /> Emploi du temps mis à jour</li>
              <li><FaBullhorn /> Annonce publiée</li>
              <li><FaBook /> Nouveau module ajouté</li>
            </ul>
          </div>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="chart-box">
            <h3>Répartition des utilisateurs</h3>
            <Doughnut data={userChart} />
          </div>

          <div className="chart-box">
            <h3>Répartition par filière</h3>
            <Doughnut data={filiereChart} />
          </div>

          <div className="chart-box wide">
            <h3>Activité (7 jours)</h3>
            <Line data={activityChart} />
          </div>
        </div>

        {/* Announcements */}
        <div className="announcements">
          <h3>Dernières annonces</h3>

          <div className="announcement-list">
            <div className="announcement"> <FaBullhorn />Réunion pédagogique</div>
            <div className="announcement"> <FaBullhorn />Projet fin d'année</div>
            <div className="announcement"> <FaBullhorn />Journée portes ouvertes</div>
          </div>
        </div>
      </main>
    </div>
  );
}

