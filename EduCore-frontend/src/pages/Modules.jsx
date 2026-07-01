// src/pages/Modules.jsx
import { useState } from "react";
import "../styles/modules.css";
import Sidebar from "../components/Sidebar";

import {
  FaCode,
  FaDatabase,
  FaDesktop,
  FaCalculator,
  FaProjectDiagram,
  FaCuttlefish,
  FaSearch,
  FaFilter,
  FaUserTie,
  FaUniversity,
  FaStar,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

const modules = [
  {
    title: "Web Development",
    description:
      "Learn the fundamentals of web development using HTML, CSS, JavaScript and modern frameworks.",
    teacher: "Dr. Youssef El Amrani",
    filiere: "Génie Informatique",
    credits: 6,
    icon: <FaCode />,
    color: "#e8f0ff",
    iconColor: "#2563eb",
  },
  {
    title: "Database Systems",
    description:
      "Study database design, SQL, normalization, transactions and database management systems.",
    teacher: "Pr. Nadia Lahlou",
    filiere: "Génie Informatique",
    credits: 5,
    icon: <FaDatabase />,
    color: "#e7f9f1",
    iconColor: "#10b981",
  },
  {
    title: "Discrete Mathematics",
    description:
      "Explore logic, set theory, combinatorics, relations, and graph theory.",
    teacher: "Dr. Rachid Ouazzani",
    filiere: "Mathématiques & Info",
    credits: 4,
    icon: <FaCalculator />,
    color: "#f2ebff",
    iconColor: "#7c3aed",
  },
  {
    title: "Operating Systems",
    description:
      "Understand processes, memory management, scheduling, and concurrency.",
    teacher: "Pr. Karim Bennani",
    filiere: "Génie Informatique",
    credits: 6,
    icon: <FaDesktop />,
    color: "#fff3df",
    iconColor: "#f59e0b",
  },
  {
    title: "Computer Networks",
    description:
      "Learn about OSI model, TCP/IP, routing, switching, and network protocols.",
    teacher: "Dr. Salma Abid",
    filiere: "Génie Informatique",
    credits: 5,
    icon: <FaProjectDiagram />,
    color: "#ffe9ef",
    iconColor: "#ec4899",
  },
  {
    title: "Programming in C",
    description:
      "Learn the C programming language fundamentals, syntax, pointers, and structures.",
    teacher: "Dr. Mohammed Aziz",
    filiere: "Génie Informatique",
    credits: 4,
    icon: <FaCuttlefish />,
    color: "#e8f8ff",
    iconColor: "#06b6d4",
  },
];

export default function Modules() {
  const [showModal, setShowModal] = useState(false);
  return (
  <div className="dashboard">
          <Sidebar role="admin" />
    <div className="modules-page">
      <div className="modules-header">
        <div>
          <h1>Modules</h1>
          <p>Browse and manage all your academic modules.</p>
        </div>

        <div className="modules-actions">
          <button
            className="add-module-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            Add Module
          </button>
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Search modules..." />
          </div>

          <div className="filter-box">
            <FaFilter />
            <span>All Semesters</span>
            <FaChevronDown className="down-icon" />
          </div>
        </div>
      </div>

      <div className="modules-grid">
        {modules.map((module, index) => (
          <div className="module-card" key={index}>
            <div
              className="module-icon"
              style={{
                background: module.color,
                color: module.iconColor,
              }}
            >
              {module.icon}
            </div>

            <h2>{module.title}</h2>

            <p className="module-description">{module.description}</p>

            <div className="module-info">
              <div className="info-row">
                <div className="info-left">
                  <FaUserTie />
                  <span>Teacher</span>
                </div>
                <span className="info-value">{module.teacher}</span>
              </div>

              <div className="info-row">
                <div className="info-left">
                  <FaUniversity />
                  <span>Filière</span>
                </div>
                <span className="info-value">{module.filiere}</span>
              </div>

              <div className="info-row">
                <div className="info-left">
                  <FaStar />
                  <span>Credits</span>
                </div>
                <span className="credits">{module.credits}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="modules-footer">
        <p>Showing 1 to 6 of 12 modules</p>

        <div className="pagination">
          <button>
            <FaChevronLeft />
          </button>

          <button className="active">1</button>

          <button>2</button>

          <button>
            <FaChevronRight />
          </button>
        </div>
      </div>
      {showModal && (
  <div
    className="modal-overlay"
    onClick={() => setShowModal(false)}
  >
    <div
      className="module-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>Add New Module</h2>

        <button onClick={() => setShowModal(false)}>
          <FaTimes />
        </button>
      </div>

      <form className="module-form">
        <div className="form-group">
          <label>Module Name</label>
          <input type="text" placeholder="Web Development" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="Enter module description..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Teacher</label>
            <input type="text" placeholder="Dr. Ahmed" />
          </div>

          <div className="form-group">
            <label>Credits</label>
            <input type="number" placeholder="6" />
          </div>
        </div>

        <div className="form-group">
          <label>Filière</label>
          <select>
            <option>Génie Informatique</option>
            <option>Mathématiques & Info</option>
            <option>Réseaux</option>
          </select>
        </div>

        <button className="submit-module">
          Add Module
        </button>
      </form>
    </div>
  </div>
)}
    </div>
</div>
  );
}