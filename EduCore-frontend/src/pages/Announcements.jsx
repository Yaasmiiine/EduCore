import { useState } from "react";

import "../styles/announcements.css";

import Sidebar from "../components/Sidebar";

import {
  FaBullhorn,
  FaSearch,
  FaPlus,
  FaPaperPlane,
  FaClock,
  FaArchive,
  FaEye,
  FaEdit,
  FaTrash,
  FaBookOpen,
  FaExclamationTriangle,
  FaGraduationCap
} from "react-icons/fa";

const announcements = [
  {
    id: 1,
    title: "Réunion pédagogique",
    description: "Réunion pédagogique vendredi à 10h...",
    audience: "Enseignants",
    status: "Publiée",
    date: "20 mai 2024",
    time: "10:30",
    author: "John Doe",
    icon: <FaBullhorn />,
    color: "purple"
  },
  {
    id: 2,
    title: "Nouvelle session d'examens",
    description: "La nouvelle session débutera le 1er juin...",
    audience: "Étudiants",
    status: "Publiée",
    date: "18 mai 2024",
    time: "14:15",
    author: "Sarah Johnson",
    icon: <FaBookOpen />,
    color: "blue"
  },
  {
    id: 3,
    title: "Fête de l'établissement",
    description: "Nous avons le plaisir d'annoncer la fête...",
    audience: "Tous",
    status: "Programmée",
    date: "25 mai 2024",
    time: "09:00",
    author: "Michael Brown",
    icon: <FaGraduationCap />,
    color: "green"
  },
  {
    id: 4,
    title: "Maintenance du système",
    description: "Le système sera en maintenance dimanche...",
    audience: "Tous",
    status: "Publiée",
    date: "15 mai 2024",
    time: "16:45",
    author: "David Wilson",
    icon: <FaExclamationTriangle />,
    color: "orange"
  },
  {
    id: 5,
    title: "Inscriptions ouvertes",
    description: "Les inscriptions sont maintenant ouvertes...",
    audience: "Étudiants",
    status: "Archivées",
    date: "10 mai 2024",
    time: "11:20",
    author: "Emily Davis",
    icon: <FaGraduationCap />,
    color: "pink"
  }
];

export default function Announcements() {

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">

      <Sidebar role="admin" />

      <main className="announcements-page">

        {/* HEADER */}
        <div className="announcements-header">

          <div>
            <h1>Annonces</h1>
            <p>
              Gérez toutes les annonces de votre établissement.
            </p>
          </div>

          <button
            className="add-announcement-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            Créer une annonce
          </button>

        </div>

        {/* STATS */}
        <div className="announcements-stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              <FaBullhorn />
            </div>

            <div>
              <p>Total annonces</p>
              <h2>24</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              <FaPaperPlane />
            </div>

            <div>
              <p>Annonces publiées</p>
              <h2>18</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              <FaClock />
            </div>

            <div>
              <p>Programmées</p>
              <h2>4</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon red">
              <FaArchive />
            </div>

            <div>
              <p>Archivées</p>
              <h2>2</h2>
            </div>

          </div>

        </div>

        {/* FILTERS */}
        <div className="filters-container">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Rechercher une annonce..."
            />

          </div>

          <select>
            <option>Filtrer par statut</option>
            <option>Publiée</option>
            <option>Programmée</option>
            <option>Archivées</option>
          </select>

          <select>
            <option>Filtrer par destinataire</option>
            <option>Étudiants</option>
            <option>Enseignants</option>
            <option>Tous</option>
          </select>

        </div>

        {/* TABLE */}
        <div className="announcements-table-container">

          <table>

            <thead>

              <tr>
                <th>Titre</th>
                <th>Destinataire</th>
                <th>Statut</th>
                <th>Publié le</th>
                <th>Auteur</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {announcements.map((item) => (

                <tr key={item.id}>

                  <td>

                    <div className="announcement-title">

                      <div className={`announcement-icon ${item.color}`}>
                        {item.icon}
                      </div>

                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>

                    </div>

                  </td>

                  <td>
                    <span className="badge audience">
                      {item.audience}
                    </span>
                  </td>

                  <td>
                    <span className={`badge status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="date">
                      <span>{item.date}</span>
                      <p>{item.time}</p>
                    </div>
                  </td>

                  <td>

                    <div className="author">

                      <img
                        src={`https://i.pravatar.cc/40?img=${item.id}`}
                        alt=""
                      />

                      {item.author}

                    </div>

                  </td>

                  <td>

                    <div className="actions">

                      <button>
                        <FaEye />
                      </button>

                      <button>
                        <FaEdit />
                      </button>

                      <button className="delete">
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
              Affichage de 1 à 5 sur 24 annonces
            </p>

            <div className="pagination">

              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <span>...</span>
              <button>4</button>

            </div>

          </div>

        </div>

        {/* MODAL */}
        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h2>Créer une annonce</h2>

                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>

              </div>

              <form className="modal-form">

                <div className="form-group full">
                  <label>Titre</label>

                  <input
                    type="text"
                    placeholder="Titre de l'annonce"
                  />
                </div>

                <div className="form-group">
                  <label>Destinataire</label>

                  <select>
                    <option>Étudiants</option>
                    <option>Enseignants</option>
                    <option>Tous</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Statut</label>

                  <select>
                    <option>Publiée</option>
                    <option>Programmée</option>
                    <option>Archivées</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Description</label>

                  <textarea
                    rows="5"
                    placeholder="Description..."
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
                    Publier
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}