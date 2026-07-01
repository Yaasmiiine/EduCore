// Salles.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/salles.css";

import {
  FaPlus,
  FaSearch,
  FaDoorOpen,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const sallesData = [
  {
    nom: "Amphithéâtre A",
    code: "AMP-A",
    batiment: "Bâtiment A",
    capacite: 200,
    equipement: "Projecteur, Micro, Tableau",
    statut: "Disponible",
  },
  {
    nom: "Salle 101",
    code: "S101",
    batiment: "Bâtiment A",
    capacite: 50,
    equipement: "Projecteur, Tableau",
    statut: "Disponible",
  },
  {
    nom: "Salle 102",
    code: "S102",
    batiment: "Bâtiment A",
    capacite: 45,
    equipement: "Tableau",
    statut: "Occupée",
  },
  {
    nom: "Salle 201",
    code: "S201",
    batiment: "Bâtiment B",
    capacite: 60,
    equipement: "Projecteur, Tableau, Climatisation",
    statut: "Disponible",
  },
  {
    nom: "Salle Informatique 1",
    code: "SI1",
    batiment: "Bâtiment C",
    capacite: 30,
    equipement: "Ordinateurs, Projecteur",
    statut: "Disponible",
  },
];

export default function Salles() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar role="admin" />
    <div className="salles-page">
      {/* HEADER */}
      <div className="salles-header">
        <div>
          <h1>Salles</h1>
          <p>Gérez les salles de votre établissement.</p>
        </div>

        <button
          className="add-salle-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Ajouter une salle
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaDoorOpen />
          </div>

          <div>
            <h2>24</h2>
            <p>Total salles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <h2>18</h2>
            <p>Salles disponibles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaClock />
          </div>

          <div>
            <h2>6</h2>
            <p>Salles occupées</p>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="table-container">
        {/* TOP */}
        <div className="table-top">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Rechercher une salle..." />
          </div>

          <div className="filters">
            <select>
              <option>Bâtiment</option>
              <option>Bâtiment A</option>
              <option>Bâtiment B</option>
              <option>Bâtiment C</option>
            </select>

            <select>
              <option>Statut</option>
              <option>Disponible</option>
              <option>Occupée</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <table className="salles-table">
          <thead>
            <tr>
              <th>Nom de la salle</th>
              <th>Code</th>
              <th>Bâtiment</th>
              <th>Capacité</th>
              <th>Équipement</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sallesData.map((salle, index) => (
              <tr key={index}>
                <td className="salle-name">{salle.nom}</td>
                <td>{salle.code}</td>
                <td>{salle.batiment}</td>
                <td>{salle.capacite}</td>
                <td>{salle.equipement}</td>

                <td>
                  <span
                    className={
                      salle.statut === "Disponible"
                        ? "status available"
                        : "status occupied"
                    }
                  >
                    {salle.statut}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button className="edit-btn">
                      <FaEdit />
                    </button>

                    <button className="delete-btn">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="table-footer">
          <p>Affichage de 1 à 5 sur 24 salles</p>

          <div className="pagination">
            <button>{"<"}</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>{">"}</button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ajouter une salle</h2>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form className="modal-form">
              <div className="form-group">
                <label>Nom de la salle</label>
                <input type="text" placeholder="Salle 101" />
              </div>

              <div className="form-group">
                <label>Code</label>
                <input type="text" placeholder="S101" />
              </div>

              <div className="form-group">
                <label>Bâtiment</label>
                <input type="text" placeholder="Bâtiment A" />
              </div>

              <div className="form-group">
                <label>Capacité</label>
                <input type="number" placeholder="40" />
              </div>

              <div className="form-group">
                <label>Équipement</label>
                <textarea placeholder="Projecteur, Tableau..." />
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>

                <button type="submit" className="save-btn">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}