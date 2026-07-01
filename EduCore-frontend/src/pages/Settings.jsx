import { useState } from "react";
import {
  FaUniversity,
  FaBell,
  FaSave,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

import "../styles/settings.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    university: "ENSA Agadir",
    year: "2024-2025",
    language: "Français",
    emailNotifications: true,
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const toggleNotifications = () => {
    setSettings({
      ...settings,
      emailNotifications: !settings.emailNotifications,
    });
  };

  const handleSave = () => {
    console.log(settings);

    alert("Paramètres enregistrés avec succès !");
  };

  return (
    <div className="dashboard">
        <Sidebar role="admin" />
    <div className="settings-page">

      <div className="page-header">
        <h1>Paramètres</h1>

        <p>
          Gérez les paramètres généraux de la plateforme.
        </p>
      </div>

      {/* GENERAL */}

      <div className="settings-card">

        <div className="card-header">

          <div className="card-icon blue">
            <FaUniversity />
          </div>

          <div>
            <h2>Général</h2>
            <p>
              Informations générales sur votre établissement.
            </p>
          </div>

        </div>

        <div className="form-grid">

          <div className="form-group">

            <label>Nom de l'université</label>

            <input
              type="text"
              name="university"
              value={settings.university}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Année académique</label>

            <select
              name="year"
              value={settings.year}
              onChange={handleChange}
            >
              <option>2024-2025</option>
              <option>2025-2026</option>
              <option>2026-2027</option>
            </select>

          </div>

          <div className="form-group">

            <label>Langue</label>

            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option>Français</option>
              <option>English</option>
            </select>

          </div>

        </div>

      </div>

      {/* NOTIFICATIONS */}

      <div className="settings-card">

        <div className="card-header">

          <div className="card-icon purple">
            <FaBell />
          </div>

          <div>
            <h2>Notifications</h2>
            <p>
              Gérez vos préférences de notification.
            </p>
          </div>

        </div>

        <div className="notification-box">

          <span>Email notifications</span>

          <div
  className={`toggle ${
    settings.emailNotifications ? "active" : ""
  }`}
  onClick={toggleNotifications}
>
  <div className="toggle-circle"></div>
</div>

        </div>

      </div>

      {/* SAVE */}

      <div className="save-section">

        <button
          className="save-btn"
          onClick={handleSave}
        >
          <FaSave />
          Enregistrer les paramètres
        </button>

      </div>

    </div>
    </div>
  );
}