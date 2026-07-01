// Filieres.jsx

import { useState } from "react";

import "../styles/filieres.css";

import Sidebar from "../components/Sidebar";

import {
  FaSearch,
  FaPlus,
  FaGraduationCap,
  FaUsers,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const filieres = [
  {
    nom: "Informatique",
    code: "INFO",
    description: "Filière d'informatique et technologies",
    groupes: 6,
  },
  {
    nom: "Génie Civil",
    code: "GC",
    description: "Génie civil et hydraulique",
    groupes: 4,
  },
  {
    nom: "Électrotechnique",
    code: "ELT",
    description: "Électrotechnique et automatisme",
    groupes: 5,
  },
  {
    nom: "Gestion",
    code: "GEST",
    description: "Sciences de gestion",
    groupes: 3,
  },
  {
    nom: "Médecine",
    code: "MED",
    description: "Médecine générale",
    groupes: 2,
  },
  {
    nom: "Architecture",
    code: "ARCH",
    description: "Architecture et urbanisme",
    groupes: 2,
  },
];

export default function Filieres() {
    const [showModal, setShowModal] = useState(false);
  return (
  <div className="dashboard">

    <Sidebar role="admin" />
    {/* MODAL */}

{showModal && (

  <div className="modal-overlay">

    <div className="modal">

      <div className="modal-header">

        <h2>Ajouter une filière</h2>

        <button
          className="close-btn"
          onClick={() => setShowModal(false)}
        >
          ×
        </button>

      </div>

      <form className="modal-form">

        <div className="form-group">

          <label>Nom de la filière</label>

          <input
            type="text"
            placeholder="Ex: Informatique"
          />

        </div>

        <div className="form-group">

          <label>Code</label>

          <input
            type="text"
            placeholder="Ex: INFO"
          />

        </div>

        <div className="form-group full">

          <label>Description</label>

          <textarea
            rows="4"
            placeholder="Description de la filière..."
          />

        </div>

        <div className="form-group">

          <label>Nombre de groupes</label>

          <input
            type="number"
            placeholder="Ex: 6"
          />

        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="submit-btn"
          >
            Ajouter
          </button>

        </div>

      </form>

    </div>

  </div>

)}

    <main className="filieres-page">

      {/* HEADER */}
      <div className="filieres-header">

        <div>
          <h1>Filières</h1>

          <p>
            Gérez les filières de votre établissement.
          </p>
        </div>

        <button
            className="add-filiere-btn"
            onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Ajouter une filière
        </button>

      </div>

      {/* STATS */}
      <div className="filieres-stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            <FaGraduationCap />
          </div>

          <div>
            <h2>12</h2>
            <p>Total filières</p>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon purple">
            <FaUsers />
          </div>

          <div>
            <h2>28</h2>
            <p>Total groupes</p>
          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="filieres-table-container">

        {/* SEARCH */}
        <div className="table-top">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Rechercher une filière..."
            />

          </div>

        </div>

        {/* TABLE */}
        <table className="filieres-table">

          <thead>

            <tr>
              <th>Nom de la filière</th>
              <th>Code</th>
              <th>Description</th>
              <th>Nombre de groupes</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filieres.map((filiere, index) => (

              <tr key={index}>

                <td className="filiere-name">
                  {filiere.nom}
                </td>

                <td>{filiere.code}</td>

                <td>{filiere.description}</td>

                <td>{filiere.groupes}</td>

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

          <p>
            Affichage de 1 à 6 sur 12 filières
          </p>

          <div className="pagination">

            <button>{"<"}</button>

            <button className="active">
              1
            </button>

            <button>2</button>

            <button>{">"}</button>

          </div>

        </div>

      </div>

    </main>

  </div>
);

}