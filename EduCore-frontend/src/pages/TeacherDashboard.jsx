import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";

import {
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaBullhorn,
  FaCheckCircle,
  FaClock
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

export default function TeacherDashboard() {

  const stats = [
    { title: "Modules", icon: <FaBookOpen />, value: 6 },
    { title: "Étudiants", icon: <FaUsers />, value: 320 },
    { title: "Présences", icon: <FaCheckCircle />, value: "92%" },
    { title: "Cours Aujourd'hui", icon: <FaClock />, value: 4 }
  ];

  const attendanceChart = {
    labels: ["Présent", "Absent"],
    datasets: [
      {
        data: [92, 8],
        backgroundColor: ["#22c55e", "#ef4444"]
      }
    ]
  };

  const courseChart = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
    datasets: [
      {
        label: "Heures de cours",
        data: [4, 6, 3, 5, 4],
        borderColor: "#6366f1",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="dashboard">

      <Sidebar role="teacher" />

      <main className="main">

        <div className="topbar">
          <h1>Teacher Dashboard</h1>
        </div>

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

        <div className="middle">

          <div className="actions">
            <h3>Actions rapides</h3>

            <div className="action-grid">
              <button><FaClipboardList /> Ajouter notes</button>
              <button><FaCalendarAlt /> Voir emploi</button>
              <button><FaUsers /> Gérer étudiants</button>
              <button><FaBookOpen /> Ajouter support</button>
              <button className="primary">
                <FaBullhorn /> Publier annonce
              </button>
            </div>
          </div>

          <div className="activity">
            <h3>Activité récente</h3>

            <ul>
              <li><FaClipboardList /> Notes mises à jour</li>
              <li><FaBookOpen /> Nouveau cours ajouté</li>
              <li><FaBullhorn /> Annonce publiée</li>
            </ul>
          </div>

        </div>

        <div className="charts">

          <div className="chart-box">
            <h3>Présence</h3>
            <Doughnut data={attendanceChart} />
          </div>

          <div className="chart-box wide">
            <h3>Heures de cours</h3>
            <Line data={courseChart} />
          </div>

        </div>

      </main>

    </div>
  );
}