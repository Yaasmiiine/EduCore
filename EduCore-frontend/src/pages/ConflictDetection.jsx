// ConflictDetection.jsx

import "../styles/conflictDetection.css";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaUsers,
  FaRobot,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaBolt,
} from "react-icons/fa";

const conflictsData = [
  {
    id: 1,
    type: "Conflit Salle",
    severity: "Critique",
    room: "B12",
    teacher: "M. Karim",
    group: "GI2",
    time: "Lundi 10:00 - 12:00",
  },
  {
    id: 2,
    type: "Conflit Enseignant",
    severity: "Moyen",
    room: "A03",
    teacher: "Mme Sara",
    group: "GI1",
    time: "Mardi 14:00 - 16:00",
  },
  {
    id: 3,
    type: "Conflit Groupe",
    severity: "Faible",
    room: "C22",
    teacher: "M. Yassine",
    group: "GI3",
    time: "Jeudi 08:00 - 10:00",
  },
];

export default function ConflictDetection() {
  const [search, setSearch] = useState("");

  const filteredConflicts = conflictsData.filter((conflict) =>
    conflict.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
            <Sidebar role="admin" />
    <div className="conflict-page">
      

      {/* MAIN */}
      <main className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h1>Détection de Conflits</h1>
            <p>Analyse intelligente des conflits d'emploi du temps</p>
          </div>

          <div className="topbar-actions">
            <button className="scan-btn">
              <FaSyncAlt />
              Analyser
            </button>

            <button className="resolve-btn">
              <FaBolt />
              Résolution Auto
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card critical">
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>

            <div>
              <h2>12</h2>
              <p>Conflits critiques</p>
            </div>
          </div>

          <div className="stat-card medium">
            <div className="stat-icon">
              <FaClock />
            </div>

            <div>
              <h2>7</h2>
              <p>Conflits moyens</p>
            </div>
          </div>

          <div className="stat-card resolved">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>

            <div>
              <h2>31</h2>
              <p>Résolus automatiquement</p>
            </div>
          </div>

          <div className="stat-card ai">
            <div className="stat-icon">
              <FaRobot />
            </div>

            <div>
              <h2>92%</h2>
              <p>Optimisation IA</p>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher un conflit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="filter-btn">
            <FaFilter />
            Filtres
          </button>
        </div>

        {/* CONFLICTS */}
        <div className="conflicts-container">
          {/* LEFT */}
          <div className="conflicts-list">
            <div className="section-title">
              <h2>Conflits détectés</h2>
            </div>

            {filteredConflicts.map((conflict) => (
              <div className="conflict-card" key={conflict.id}>
                <div className="conflict-header">
                  <span className={`badge ${conflict.severity.toLowerCase()}`}>
                    {conflict.severity}
                  </span>

                  <span className="conflict-type">{conflict.type}</span>
                </div>

                <div className="conflict-info">
                  <p>
                    <FaDoorOpen /> Salle : {conflict.room}
                  </p>

                  <p>
                    <FaChalkboardTeacher /> Enseignant :{" "}
                    {conflict.teacher}
                  </p>

                  <p>
                    <FaUsers /> Groupe : {conflict.group}
                  </p>

                  <p>
                    <FaClock /> {conflict.time}
                  </p>
                </div>

                <div className="conflict-actions">
                  <button className="fix-btn">Corriger</button>
                  <button className="ignore-btn">Ignorer</button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="recommendation-panel">
            <h2>Suggestions IA</h2>

            <div className="recommendation-card">
              <FaRobot className="robot-icon" />

              <div>
                <h3>Changer de salle</h3>
                <p>
                  Déplacer GI2 vers salle C14 disponible à la même heure.
                </p>
              </div>
            </div>

            <div className="recommendation-card">
              <FaRobot className="robot-icon" />

              <div>
                <h3>Décaler le cours</h3>
                <p>
                  Déplacer le module Réseau de 14h à 16h pour éviter le conflit.
                </p>
              </div>
            </div>

            <div className="recommendation-card">
              <FaRobot className="robot-icon" />

              <div>
                <h3>Optimisation automatique</h3>
                <p>
                  5 conflits peuvent être corrigés automatiquement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}