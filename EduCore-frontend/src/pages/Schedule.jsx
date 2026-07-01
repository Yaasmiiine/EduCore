import { useState } from "react";
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
}
 from "react-icons/fa";
import "../styles/schedule.css";
import Sidebar from "../components/Sidebar";

export default function Schedule() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");

  const [manualSlot, setManualSlot] = useState({
    module: "",
    teacher: "",
    room: "",
    day: "",
    time: "",
  });

  const schedule = [
    {
      time: "08:00 - 09:30",
      monday: {
        title: "Algorithmique",
        teacher: "Pr. Ahmed Z.",
        room: "Salle 101",
        color: "blue",
      },
      tuesday: {
        title: "Base de données",
        teacher: "Pr. Salma R.",
        room: "Salle 102",
        color: "green",
      },
      wednesday: {
        title: "Programmation (C++)",
        teacher: "Pr. Youssef B.",
        room: "Salle 101",
        color: "yellow",
      },
      thursday: {
        title: "Algorithmique",
        teacher: "Pr. Ahmed Z.",
        room: "Salle 101",
        color: "blue",
      },
      friday: {
        title: "Anglais",
        teacher: "Pr. Sara K.",
        room: "Salle 203",
        color: "purple",
      },
      saturday: {
        title: "Base de données",
        teacher: "Pr. Salma R.",
        room: "Salle 102",
        color: "green",
      },
    },

    {
      time: "09:45 - 11:15",
      monday: {
        title: "Programmation (C++)",
        teacher: "Pr. Youssef B.",
        room: "Salle 101",
        color: "yellow",
      },
      tuesday: {
        title: "Mathématiques",
        teacher: "Pr. Mostafa H.",
        room: "Salle 201",
        color: "purple",
      },
      wednesday: {
        title: "Algorithmique",
        teacher: "Pr. Ahmed Z.",
        room: "Salle 101",
        color: "blue",
      },
      thursday: {
        title: "Base de données",
        teacher: "Pr. Salma R.",
        room: "Salle 102",
        color: "green",
      },
      friday: {
        title: "Programmation (C++)",
        teacher: "Pr. Youssef B.",
        room: "Salle 101",
        color: "yellow",
      },
      saturday: {
        title: "Mathématiques",
        teacher: "Pr. Mostafa H.",
        room: "Salle 201",
        color: "purple",
      },
    },

    {
      time: "11:30 - 13:00",
      monday: {
        title: "Anglais",
        teacher: "Pr. Sara K.",
        room: "Salle 203",
        color: "purple",
      },
      tuesday: {
        title: "Programmation (C++)",
        teacher: "Pr. Youssef B.",
        room: "Salle 101",
        color: "yellow",
      },
      wednesday: {
        title: "Base de données",
        teacher: "Pr. Salma R.",
        room: "Salle 102",
        color: "green",
      },
      thursday: {
        title: "Mathématiques",
        teacher: "Pr. Mostafa H.",
        room: "Salle 201",
        color: "purple",
      },
      friday: {
        title: "Algorithmique",
        teacher: "Pr. Ahmed Z.",
        room: "Salle 101",
        color: "blue",
      },
      saturday: null,
    },

    {
      time: "14:00 - 15:30",
      monday: {
        title: "Base de données",
        teacher: "Pr. Salma R.",
        room: "Salle 102",
        color: "green",
      },
      tuesday: {
        title: "Algorithmique",
        teacher: "Pr. Ahmed Z.",
        room: "Salle 101",
        color: "blue",
      },
      wednesday: {
        title: "Anglais",
        teacher: "Pr. Sara K.",
        room: "Salle 203",
        color: "purple",
      },
      thursday: {
        title: "Programmation (C++)",
        teacher: "Pr. Youssef B.",
        room: "Salle 101",
        color: "yellow",
      },
      friday: {
        title: "Base de données",
        teacher: "Pr. Salma R.",
        room: "Salle 102",
        color: "green",
      },
      saturday: null,
    },

    {
      time: "15:45 - 17:15",
      monday: {
        title: "Mathématiques",
        teacher: "Pr. Mostafa H.",
        room: "Salle 201",
        color: "purple",
      },
      tuesday: null,
      wednesday: {
        title: "Algorithmique",
        teacher: "Pr. Ahmed Z.",
        room: "Salle 101",
        color: "blue",
      },
      thursday: {
        title: "Anglais",
        teacher: "Pr. Sara K.",
        room: "Salle 203",
        color: "purple",
      },
      friday: null,
      saturday: null,
    },
  ];

  const renderCourse = (course) => {
    if (!course)
      return <div className="empty-slot">—</div>;

    return (
      <div className={`course-card ${course.color}`}>
        <h4>{course.title}</h4>
        <p>{course.teacher}</p>
        <span>{course.room}</span>
      </div>
    );
  };

  return (
    <div className="dashboard">
      
            <Sidebar role="admin" />
    <div className="schedule-page">
      {/* TOPBAR */}
      <div className="schedule-topbar">
        <div className="topbar-left">
          <h1>Emplois du temps</h1>
        </div>
      </div>

      {/* FILTERS */}
      <div className="schedule-filters">
        <div className="filter-group">
          <label>Filière</label>
          <select>
            <option>Informatique</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Groupe</label>
          <select>
            <option>Groupe 1</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Semestre</label>
          <select>
            <option>Semestre 2</option>
          </select>
        </div>

        <div className="filter-group week-group">
          <label>Semaine</label>

          <div className="week-controls">
            <button>
              <FaChevronLeft />
            </button>

            <select>
              <option>13 - 19 Mai 2024</option>
            </select>

            <button>
              <FaChevronRight />
            </button>

            <button className="today-btn">
              Aujourd'hui
            </button>
          </div>
        </div>

        <button
          className="add-btn"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus />
          Ajouter un emploi du temps
        </button>
      </div>

      {/* TABLE */}
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th></th>
              <th>
                Lundi
                <span>13 Mai</span>
              </th>
              <th>
                Mardi
                <span>14 Mai</span>
              </th>
              <th>
                Mercredi
                <span>15 Mai</span>
              </th>
              <th>
                Jeudi
                <span>16 Mai</span>
              </th>
              <th>
                Vendredi
                <span>17 Mai</span>
              </th>
              <th>
                Samedi
                <span>18 Mai</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {schedule.map((row, index) => (
              <tr key={index}>
                <td className="time-cell">{row.time}</td>
                <td>{renderCourse(row.monday)}</td>
                <td>{renderCourse(row.tuesday)}</td>
                <td>{renderCourse(row.wednesday)}</td>
                <td>{renderCourse(row.thursday)}</td>
                <td>{renderCourse(row.friday)}</td>
                <td>{renderCourse(row.saturday)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="schedule-footer">
          ⓘ Cliquez sur un créneau pour voir les détails ou le modifier.
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
  <div className="modal-overlay">
    <div className="schedule-modal">

      {/* HEADER */}
      <div className="modal-header">
        <h2>Créer emploi du temps</h2>

        <button onClick={() => setModalOpen(false)}>
          ✕
        </button>
      </div>

      {/* TABS */}
      <div className="modal-tabs">

        <button
          className={activeTab === "ai" ? "active" : ""}
          onClick={() => setActiveTab("ai")}
        >
          🤖 Génération IA
        </button>

        <button
          className={activeTab === "manual" ? "active" : ""}
          onClick={() => setActiveTab("manual")}
        >
          ✍️ Manuel
        </button>

      </div>

      {/* AI TAB */}


      {/* MANUAL TAB */}
      {activeTab === "manual" && (
        <div className="manual-content">

          <div className="manual-grid">

            <input
              placeholder="Module"
              value={manualSlot.module}
              onChange={(e) =>
                setManualSlot({
                  ...manualSlot,
                  module: e.target.value,
                })
              }
            />

            <input
              placeholder="Professeur"
              value={manualSlot.teacher}
              onChange={(e) =>
                setManualSlot({
                  ...manualSlot,
                  teacher: e.target.value,
                })
              }
            />

            <input
              placeholder="Salle"
              value={manualSlot.room}
              onChange={(e) =>
                setManualSlot({
                  ...manualSlot,
                  room: e.target.value,
                })
              }
            />

            <input
              placeholder="Jour"
              value={manualSlot.day}
              onChange={(e) =>
                setManualSlot({
                  ...manualSlot,
                  day: e.target.value,
                })
              }
            />

            <input
              placeholder="Heure"
              value={manualSlot.time}
              onChange={(e) =>
                setManualSlot({
                  ...manualSlot,
                  time: e.target.value,
                })
              }
            />

          </div>

          <button
            className="add-slot-btn"
            onClick={() => {
              alert("Créneau ajouté !");
            }}
          >
            ➕ Ajouter un créneau
          </button>

          <div className="modal-actions">

            <button
              className="cancel-btn"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </button>

            <button
              className="generate-btn"
              onClick={() => {
                alert("Emploi du temps enregistré !");
                setModalOpen(false);
              }}
            >
              Enregistrer
            </button>

          </div>

        </div>
      )}

    </div>
  </div>
)}
    </div>
    </div>
  );
}