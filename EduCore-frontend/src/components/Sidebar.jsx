import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";
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
  FaClipboardList,
  FaUserCheck,
  FaChartBar,
  FaCalendarCheck,
} from "react-icons/fa";

export default function Sidebar() {

  const { role } = useAuth();
  const { isOpen, close } = useSidebar();

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

      {/* SUIVI */}
      <p className="section-title">SUIVI</p>

      <ul className="menu">
        <NavLink to="/notes">
          <li>
            <FaClipboardList />
            Notes
          </li>
        </NavLink>

        <NavLink to="/presences">
          <li>
            <FaUserCheck />
            Présences
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

      {/* SUIVI */}
      <p className="section-title">SUIVI</p>

      <ul className="menu">
        <NavLink to="/bulletin">
          <li>
            <FaClipboardList />
            Bulletin
          </li>
        </NavLink>

        <NavLink to="/presences">
          <li>
            <FaUserCheck />
            Présences
          </li>
        </NavLink>

        <NavLink to="/progression">
          <li>
            <FaChartBar />
            Progression
          </li>
        </NavLink>

        <NavLink to="/exam-calendar">
          <li>
            <FaCalendarCheck />
            Calendrier des examens
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
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={close} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

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
    </>
  );
}
