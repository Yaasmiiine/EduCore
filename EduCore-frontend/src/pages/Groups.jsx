import { useState } from "react";
import "../styles/groups.css";
import Sidebar from "../components/Sidebar";

import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const groups = [
  {
    id: 1,
    code: "GI",
    name: "Groupe Informatique 1A",
    filiere: "Informatique",
    niveau: "1ère Année",
    effectif: 28,
    responsable: "John Doe",
    created: "12 mai 2024"
  },
  {
    id: 2,
    code: "GC",
    name: "Groupe Commerce 2A",
    filiere: "Commerce",
    niveau: "2ème Année",
    effectif: 32,
    responsable: "Sarah Johnson",
    created: "10 mai 2024"
  },
  {
    id: 3,
    code: "GE",
    name: "Groupe Électronique 1A",
    filiere: "Électronique",
    niveau: "1ère Année",
    effectif: 25,
    responsable: "Michael Brown",
    created: "8 mai 2024"
  },
  {
    id: 4,
    code: "GI2",
    name: "Groupe Informatique 2A",
    filiere: "Informatique",
    niveau: "2ème Année",
    effectif: 30,
    responsable: "David Wilson",
    created: "6 mai 2024"
  }
];

export default function Groups() {

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">

      <Sidebar role="admin" />

      <main className="groups-page">

        {/* HEADER */}
        <div className="groups-header">

          <div>
            <h1>Groupes</h1>

            <p>
              Gérez tous les groupes de la plateforme
            </p>
          </div>

          <button
            className="add-group-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            Ajouter un groupe
          </button>

        </div>

        {/* TOP */}
        <div className="groups-top">

          <div className="search-filter">

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Rechercher un groupe..."
              />

            </div>

            <select>
              <option>Filtrer par filière</option>
              <option>Informatique</option>
              <option>Commerce</option>
              <option>Électronique</option>
            </select>

          </div>

          <div className="total-groups">

            <div className="groups-icon">
              <FaUsers />
            </div>

            <div>
              <p>Total Groupes</p>
              <h2>48</h2>
            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>#</th>
                <th>Nom du groupe</th>
                <th>Filière</th>
                <th>Niveau</th>
                <th>Effectif</th>
                <th>Responsable</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {groups.map((group) => (

                <tr key={group.id}>

                  <td>{group.id}</td>

                  <td>

                    <div className="group-name">

                      <div className="group-avatar">
                        {group.code}
                      </div>

                      {group.name}

                    </div>

                  </td>

                  <td>{group.filiere}</td>

                  <td>
                    <span className="niveau">
                      {group.niveau}
                    </span>
                  </td>

                  <td>
                    {group.effectif} étudiants
                  </td>

                  <td>

                    <div className="responsable">

                      <img
                        src={`https://i.pravatar.cc/40?img=${group.id}`}
                        alt=""
                      />

                      {group.responsable}

                    </div>

                  </td>

                  <td>{group.created}</td>

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

          {/* PAGINATION */}
          <div className="pagination">

            <p>
              Affichage de 1 à 8 sur 48 groupes
            </p>

            <div className="pages">

              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <span>...</span>
              <button>6</button>

            </div>

          </div>

        </div>

        {/* MODAL */}
        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h2>Ajouter un nouveau groupe</h2>

                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>

              </div>

              <form className="modal-form">

                <div className="form-group">
                  <label>Nom du groupe</label>

                  <input
                    type="text"
                    placeholder="Ex: Groupe Informatique 1A"
                  />
                </div>

                <div className="form-group">
                  <label>Filière</label>

                  <select>
                    <option>Sélectionner une filière</option>
                    <option>Informatique</option>
                    <option>Commerce</option>
                    <option>Électronique</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Niveau</label>

                  <select>
                    <option>Sélectionner le niveau</option>
                    <option>1ère Année</option>
                    <option>2ème Année</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Responsable</label>

                  <select>
                    <option>Sélectionner un responsable</option>
                    <option>John Doe</option>
                    <option>Sarah Johnson</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Effectif</label>

                  <input
                    type="number"
                    placeholder="Ex: 30"
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

      </main>

    </div>
  );
}