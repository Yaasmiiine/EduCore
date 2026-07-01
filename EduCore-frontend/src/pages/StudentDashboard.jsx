import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";

import {
  FaBook,
  FaCalendarAlt,
  FaClipboardCheck,
  FaBullhorn,
  FaGraduationCap,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function StudentDashboard() {

  const stats = [
    { title: "Modules", icon: <FaBook />, value: 5 },
    { title: "Absences", icon: <FaClock />, value: 2 },
    { title: "Moyenne", icon: <FaGraduationCap />, value: "15.7" },
    { title: "Présence", icon: <FaCheckCircle />, value: "96%" }
  ];

  const gradesChart = {
    labels: ["Validé", "En cours"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#6366f1", "#e5e7eb"]
      }
    ]
  };

  return (
    <div className="dashboard">

      <Sidebar role="student" />

      <main className="main">

        <div className="topbar">
          <h1>Student Dashboard</h1>
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
            <h3>Accès rapide</h3>

            <div className="action-grid">
              <button><FaCalendarAlt /> Emploi du temps</button>
              <button><FaClipboardCheck /> Notes</button>
              <button><FaBook /> Mes modules</button>
              <button className="primary">
                <FaBullhorn /> Annonces
              </button>
            </div>
          </div>

          <div className="activity">
            <h3>Activité récente</h3>

            <ul>
              <li><FaClipboardCheck /> Nouvelle note ajoutée</li>
              <li><FaBullhorn /> Nouvelle annonce</li>
              <li><FaCalendarAlt /> Emploi mis à jour</li>
            </ul>
          </div>

        </div>

        <div className="charts">

          <div className="chart-box">
            <h3>Progression</h3>
            <Doughnut data={gradesChart} />
          </div>

        </div>

      </main>

    </div>
  );
}