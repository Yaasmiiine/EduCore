// ManualTimetableEditor.jsx

import "../styles/manualTimetableEditor.css";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaCopy,
  FaArrowsAlt,
  FaExpand,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const courses = [
  {
    id: 1,
    title: "Algorithmique",
    teacher: "M. Karim",
    room: "Salle B12",
    color: "#d9fbe6",
    day: "Lundi",
    start: "08:00",
    end: "10:00",
    top: 0,
    height: 110,
    left: 0,
  },
  {
    id: 2,
    title: "Bases de données",
    teacher: "Mme Sara",
    room: "Salle A03",
    color: "#dbeafe",
    day: "Mercredi",
    start: "08:00",
    end: "10:00",
    top: 0,
    height: 110,
    left: 2,
  },
  {
    id: 3,
    title: "Réseaux",
    teacher: "M. Yassine",
    room: "Salle C22",
    color: "#f3e8ff",
    day: "Jeudi",
    start: "09:00",
    end: "11:00",
    top: 70,
    height: 110,
    left: 3,
  },
];

export default function ManualTimetableEditor() {
  const [modal, setModal] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar role="admin" />
    <div className="editor-page">
      {/* TOPBAR */}

      <div className="editor-header">
        <div>
          <h1>Éditeur Manuel d'Emploi du Temps</h1>
          <p>Emplois du temps &gt; Éditeur manuel</p>
        </div>

        <div className="editor-actions">
          <button className="outline-btn">
            Vérifier les conflits
          </button>

          <button className="primary-btn">
            Enregistrer
          </button>

          <button className="outline-btn">
            Exporter
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <div className="filters-row">
        <select>
          <option>Informatique</option>
        </select>

        <select>
          <option>GI2</option>
        </select>

        <div className="week-selector">
          <FaChevronLeft />
          <span>20 - 26 Mai 2024</span>
          <FaChevronRight />
        </div>
      </div>

      {/* MAIN GRID */}

      <div className="editor-container">
        {/* LEFT */}

        <div className="modules-panel">
          <h3>Modules / Cours</h3>

          <div className="tabs">
            <span className="active">Modules</span>
            <span>Enseignants</span>
          </div>

          <div className="search-box">
            <FaSearch />
            <input  placeholder="Rechercher un module..." />
          </div>

          <div className="module-card green">
            <h4>Algorithmique</h4>
            <p>M. Karim</p>
          </div>

          <div className="module-card blue">
            <h4>Bases de données</h4>
            <p>Mme Sara</p>
          </div>

          <div className="module-card purple">
            <h4>Réseaux</h4>
            <p>M. Yassine</p>
          </div>

          <div className="module-card yellow">
            <h4>Développement Web</h4>
            <p>M. Amine</p>
          </div>

          <div className="module-card red">
            <h4>Intelligence Artificielle</h4>
            <p>Mme Lina</p>
          </div>

          <div className="module-card cyan">
            <h4>Sécurité Informatique</h4>
            <p>M. Hakim</p>
          </div>

          <div className="drag-box">
            Glisser les modules vers le calendrier
          </div>
        </div>

        {/* CENTER */}

        <div className="calendar-panel">
          {/* DAYS */}

          <div className="days-row">
            <div className="time-column"></div>

            {[
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi",
            ].map((day) => (
              <div className="day-header" key={day}>
                <h4>{day}</h4>
              </div>
            ))}
          </div>

          {/* GRID */}

          <div className="calendar-grid">
            {/* HOURS */}

            <div className="hours-column">
              {[
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
              ].map((hour) => (
                <div className="hour" key={hour}>
                  {hour}
                </div>
              ))}
            </div>

            {/* COLUMNS */}

            <div className="days-columns">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="day-column" key={i}></div>
              ))}

              {/* EVENTS */}

              {courses.map((course) => (
                <div
                  key={course.id}
                  className="event-card"
                  style={{
                    background: course.color,
                    top: `${course.top}px`,
                    left: `${course.left * 16.4}%`,
                    height: `${course.height}px`,
                  }}
                  onClick={() => setModal(true)}
                >
                  <h4>{course.title}</h4>
                  <p>{course.teacher}</p>
                  <span>{course.room}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="details-panel">
          <h3>Détails du cours sélectionné</h3>

          <div className="detail-item">
            <span className="dot green-dot"></span>
            <p>Algorithmique</p>
          </div>

          <div className="detail-block">
            <h5>Enseignant</h5>
            <p>M. Karim</p>
          </div>

          <div className="detail-block">
            <h5>Groupe</h5>
            <p>GI2</p>
          </div>

          <div className="detail-block">
            <h5>Salle</h5>
            <p>Salle B12</p>
          </div>

          <div className="detail-block">
            <h5>Période</h5>
            <p>Lundi 08:00 - 10:00</p>
          </div>

          <button className="duplicate-btn">
            <FaCopy />
            Dupliquer ce cours
          </button>

          <div className="tools-box">
            <h4>Outils d'édition</h4>

            <button>
              <FaArrowsAlt />
              Déplacer
            </button>

            <button>
              <FaExpand />
              Redimensionner
            </button>

            <button className="delete-btn">
              <FaTrash />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}

      {modal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Modifier le cours</h3>

              <FaTimes
                className="close-icon"
                onClick={() => setModal(false)}
              />
            </div>

            <div className="modal-grid">
              <div>
                <label>Module</label>
                <input value="Algorithmique" readOnly />
              </div>

              <div>
                <label>Enseignant</label>
                <input value="M. Karim" readOnly />
              </div>

              <div>
                <label>Salle</label>
                <input value="Salle B12" readOnly />
              </div>

              <div>
                <label>Groupe</label>
                <input value="GI2" readOnly />
              </div>

              <div>
                <label>Heure début</label>
                <input value="08:00" readOnly />
              </div>

              <div>
                <label>Heure fin</label>
                <input value="10:00" readOnly />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn">
                Annuler
              </button>

              <button className="save-btn">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}