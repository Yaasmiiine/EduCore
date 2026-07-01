import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/sidebar.css";

import {
  FaTachometerAlt,
  FaUsers,
  FaLayerGroup,
  FaUserFriends,
  FaBook,
  FaCalendarAlt,
  FaDoorOpen,
  FaBullhorn,
  FaRobot,
  FaExclamationTriangle,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {

  const { role } = useAuth();

  const adminMenu = (
    <>
      {/* GESTION */}
      <p className="section-title">GESTION</p>

      <ul className="menu">

        <NavLink to="/users">
          <li>
            <FaUsers />
            Utilisateurs
          </li>
        </NavLink>

        <NavLink to="/filieres">
          <li>
            <FaLayerGroup />
            Filières
          </li>
        </NavLink>

        <NavLink to="/groups">
          <li>
            <FaUserFriends />
            Groupes
          </li>
        </NavLink>

        <NavLink to="/modules">
          <li>
            <FaBook />
            Modules
          </li>
        </NavLink>

        <NavLink to="/schedule">
          <li>
            <FaCalendarAlt />
            Emplois du temps
          </li>
        </NavLink>

        <NavLink to="/salles">
          <li>
            <FaDoorOpen />
            Salles
          </li>
        </NavLink>

        <NavLink to="/announcements">
          <li>
            <FaBullhorn />
            Annonces
          </li>
        </NavLink>

      </ul>
      {/* AI */}
      <p className="section-title">AI & AUTOMATION</p>

      <ul className="menu">
        <NavLink to="/generation-ia">
          <li>
            <FaRobot />
            Génération d'emplois
          </li>
        </NavLink>

        <NavLink to="/conflict-detection">
          <li>
            <FaExclamationTriangle />
            Détection de conflits
          </li>
        </NavLink>
      </ul>

      {/* SETTINGS */}
      <p className="section-title">PARAMÈTRES</p>

      <ul className="menu">

        <NavLink to="/settings">
          <li>
            <FaCog />
            Paramètres
          </li>
        </NavLink>

      </ul>
    </>
  );

  const teacherMenu = (
    <>
      {/* ENSEIGNEMENT */}
      <p className="section-title">ENSEIGNEMENT</p>

      <ul className="menu">
        <NavLink to="/modules">
          <li>
            <FaBook />
            Mes Modules
          </li>
        </NavLink>

        <NavLink to="/schedule">
          <li>
            <FaCalendarAlt />
            Emploi du temps
          </li>
        </NavLink>

        <NavLink to="/announcements">
          <li>
            <FaBullhorn />
            Annonces
          </li>
        </NavLink>
      </ul>

      {/* SETTINGS */}
      <p className="section-title">PARAMÈTRES</p>

      <ul className="menu">
        <NavLink to="/settings">
          <li>
            <FaCog />
            Paramètres
          </li>
        </NavLink>
      </ul>
    </>
  );

  const studentMenu = (
    <>
      {/* ÉTUDES */}
      <p className="section-title">ÉTUDES</p>

      <ul className="menu">
        <NavLink to="/modules">
          <li>
            <FaBook />
            Mes Modules
          </li>
        </NavLink>

        <NavLink to="/schedule">
          <li>
            <FaCalendarAlt />
            Emploi du temps
          </li>
        </NavLink>

        <NavLink to="/announcements">
          <li>
            <FaBullhorn />
            Annonces
          </li>
        </NavLink>
      </ul>

      {/* SETTINGS */}
      <p className="section-title">PARAMÈTRES</p>

      <ul className="menu">
        <NavLink to="/settings">
          <li>
            <FaCog />
            Paramètres
          </li>
        </NavLink>
      </ul>
    </>
  );

  return (
    <aside className="sidebar">

      {/* DASHBOARD */}
      <ul className="menu">
        <NavLink to="/dashboard">
          <li>
            <FaTachometerAlt />
            Dashboard
          </li>
        </NavLink>
      </ul>


      {/* ROLE MENU */}
      {role === "admin" && adminMenu}
      {role === "teacher" && teacherMenu}
      {role === "student" && studentMenu}

    </aside>
  );
}
