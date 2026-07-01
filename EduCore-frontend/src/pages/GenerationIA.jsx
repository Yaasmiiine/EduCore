// src/pages/GenerationIA.jsx

import "../styles/generationIA.css";
import Sidebar from "../components/Sidebar";

import {
  FaMagic,
  FaHistory,
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaCalendarAlt,
  FaShieldAlt,
  FaClock,
  FaFilePdf,
  FaSave,
  FaSlidersH,
  FaList
} from "react-icons/fa";

export default function GenerationIA() {
  const timetable = [
    {
      time: "08:00\n09:30",
      monday: "Algorithmique\nSalle A101\nM. Ahmed",
      tuesday: "Base de données\nSalle A102\nM. Karim",
      wednesday: "Réseaux\nSalle B201\nM. Youssef",
      thursday: "Algorithmique\nSalle A101\nM. Ahmed",
      friday: "Anglais\nSalle C203\nMme. Sara"
    },
    {
      time: "09:30\n11:00",
      monday: "Base de données\nSalle A102\nM. Karim",
      tuesday: "Algorithmique\nSalle A101\nM. Ahmed",
      wednesday: "Programmation\nTP1\nM. Sami",
      thursday: "Base de données\nSalle A102\nM. Karim",
      friday: "Réseaux\nSalle B201\nM. Youssef"
    },
    {
      time: "11:15\n12:45",
      monday: "Réseaux\nSalle B201\nM. Youssef",
      tuesday: "Programmation\nTP1\nM. Sami",
      wednesday: "Base de données\nSalle A102\nM. Karim",
      thursday: "Réseaux\nSalle B201\nM. Youssef",
      friday: "Algorithmique\nSalle A101\nM. Ahmed"
    },
    {
      time: "13:45\n15:15",
      monday: "Programmation\nTP1\nM. Sami",
      tuesday: "Réseaux\nSalle B201\nM. Youssef",
      wednesday: "Algorithmique\nSalle A101\nM. Ahmed",
      thursday: "Anglais\nSalle C203\nMme. Sara",
      friday: "Base de données\nSalle A102\nM. Karim"
    },
    {
      time: "15:30\n17:00",
      monday: "Anglais\nSalle C203\nMme. Sara",
      tuesday: "Algorithmique\nSalle A101\nM. Ahmed",
      wednesday: "Réseaux\nSalle B201\nM. Youssef",
      thursday: "Programmation\nTP1\nM. Sami",
      friday: ""
    }
  ];

  return (
    <div className="dashboard">
      <Sidebar role="admin" />
    <div className="layout">
      
      <div className="generation-page">
        <div className="generation-top">
          <div>
            <p className="breadcrumb">
              Emplois du temps &gt; Génération IA
            </p>

            <div className="title-row">
              <FaMagic className="title-icon" />
              <div>
                <h1>Génération d’emplois IA</h1>
                <p>
                  Générez automatiquement des emplois du temps optimisés grâce
                  à l’intelligence artificielle
                </p>
              </div>
            </div>
          </div>

          <button className="history-btn">
            <FaHistory />
            Historique des générations
          </button>
        </div>

        <div className="generation-grid">
          {/* LEFT */}
          <div className="left-column">
            <div className="card">
              <h3>1. Sélection des données</h3>

              <div className="form-group">
                <label>Filière</label>
                <select>
                  <option>Informatique</option>
                </select>
              </div>

              <div className="form-group">
                <label>Semestre</label>
                <select>
                  <option>Semestre 2</option>
                </select>
              </div>

              <div className="form-group">
                <label>Groupes</label>

                <div className="tags">
                  <span>Groupe 1 ×</span>
                  <span>Groupe 2 ×</span>
                  <span>Groupe 3 ×</span>
                </div>
              </div>

              <div className="form-group">
                <label>Période</label>
                <input type="text" value="03/06/2024 - 28/06/2024" readOnly />
              </div>

              <div className="form-group">
                <label>Salles disponibles</label>

                <div className="tags">
                  <span>Salle A101 ×</span>
                  <span>Salle A102 ×</span>
                  <span>Salle B201 ×</span>
                  <span>Salle TP1 ×</span>
                </div>
              </div>

              <div className="form-group">
                <label>Enseignants (optionnel)</label>
                <select>
                  <option>Sélectionner des enseignants</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h3>Contraintes spécifiques</h3>

              <div className="checkboxes">
                <label>
                  <input type="checkbox" checked readOnly />
                  Éviter les conflits d’enseignants
                </label>

                <label>
                  <input type="checkbox" checked readOnly />
                  Éviter les conflits de salles
                </label>

                <label>
                  <input type="checkbox" checked readOnly />
                  Équilibrer la charge par jour
                </label>

                <label>
                  <input type="checkbox" />
                  Limiter les trous (créneaux vides)
                </label>

                <label>
                  <input type="checkbox" />
                  Prioriser les cours du matin
                </label>
              </div>
            </div>

            
          </div>

          {/* CENTER */}
          <div className="center-column">
            <div className="card">
              <h3>2. Configuration IA</h3>

              <div className="form-group">
                <label>Objectif principal</label>
                <select>
                  <option>Équilibrer les journées</option>
                </select>
              </div>

              <div className="form-group">
                <label>Niveau d’optimisation</label>
                <input type="range" />
              </div>

              <div className="form-group">
                <label>Heures max par jour</label>
                <select>
                  <option>6</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priorité des types de cours</label>

                <div className="priority-buttons">
                  <button className="active">TP &gt; TD &gt; CM</button>
                  <button>TP &gt; CM &gt; TD</button>
                  <button>CM &gt; TD &gt; TP</button>
                </div>
              </div>

              <div className="form-group">
                <label>Tolérance pour les trous</label>
                <select>
                  <option>Faible</option>
                </select>
              </div>

              <div className="toggle-row">
                <span>Activer l’optimisation avancée</span>

                <div className="toggle active"></div>
              </div>
            </div>

            <div className="card">
              <h3>Aperçu des données</h3>

              <div className="stats-grid">
                <div className="stat-card">
                  <FaUsers />
                  <h2>3</h2>
                  <p>Groupes</p>
                </div>

                <div className="stat-card">
                  <FaBook />
                  <h2>24</h2>
                  <p>Modules</p>
                </div>

                <div className="stat-card">
                  <FaChalkboardTeacher />
                  <h2>18</h2>
                  <p>Enseignants</p>
                </div>

                <div className="stat-card">
                  <FaDoorOpen />
                  <h2>8</h2>
                  <p>Salles</p>
                </div>

                <div className="stat-card">
                  <FaCalendarAlt />
                  <h2>120</h2>
                  <p>Créneaux</p>
                </div>

                <div className="stat-card">
                  <FaClock />
                  <h2>6</h2>
                  <p>Semaines</p>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* ------- */}

        <button className="generate-btn">
              <FaMagic />
              GÉNÉRER L’EMPLOI DU TEMPS IA
            </button>

            <p className="ai-note">
              L’IA va analyser les données et générer un emploi du temps
              optimisé.
            </p>
         {/* RIGHT */}
          <div className="right-column">
            <div className="card preview-card">
              <div className="preview-top">
                <div>
                  <h3>3. Aperçu du résultat généré</h3>
                </div>

                <div className="success-badge">
                  Généré avec succès
                </div>
              </div>

              <div className="preview-controls">
                <select>
                  <option>Groupe 1</option>
                </select>

                <div className="view-buttons">
                  <button className="active">
                    <FaList />
                    Aperçu semaine
                  </button>

                  <button>
                    <FaSlidersH />
                    Aperçu complet
                  </button>
                </div>
              </div>

              <div className="timetable">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Lun.</th>
                      <th>Mar.</th>
                      <th>Mer.</th>
                      <th>Jeu.</th>
                      <th>Ven.</th>
                      <th>Sam.</th>
                    </tr>
                  </thead>

                  <tbody>
                    {timetable.map((row, index) => (
                      <tr key={index}>
                        <td className="time">{row.time}</td>

                        <td>
                          <div className="course blue">
                            {row.monday}
                          </div>
                        </td>

                        <td>
                          <div className="course green">
                            {row.tuesday}
                          </div>
                        </td>

                        <td>
                          <div className="course yellow">
                            {row.wednesday}
                          </div>
                        </td>

                        <td>
                          <div className="course blue">
                            {row.thursday}
                          </div>
                        </td>

                        <td>
                          <div className="course pink">
                            {row.friday}
                          </div>
                        </td>

                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bottom-stats">
                <div>
                  <FaShieldAlt />
                  <span>0 conflits</span>
                </div>

                <div>
                  <FaDoorOpen />
                  <span>92% occupation</span>
                </div>

                <div>
                  <FaCalendarAlt />
                  <span>96% remplissage</span>
                </div>

                <div>
                  <FaClock />
                  <span>4% trous</span>
                </div>
              </div>

              <div className="bottom-actions">
                <button>
                  <FaMagic />
                  Optimiser
                </button>

                <button>
                  <FaList />
                  Voir les détails
                </button>

                <button>
                  <FaFilePdf />
                  Exporter PDF
                </button>

                <button className="save-btn">
                  <FaSave />
                  Enregistrer l’emploi
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>
  );
}