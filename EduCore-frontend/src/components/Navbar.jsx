import "../styles/navbar.css";
import { FiBell, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fullName = user ? `${user.prenom} ${user.nom}` : "";

  return (
    <nav className="navbar">

      {/* LEFT SIDE (LOGO + NAME) */}
      <div className="navbar-left">
        <div className="logo">
          <img src="/logo.png" alt="EduCore Logo" className="logo-icon" />
          <h2>Edu</h2>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">


        <div className="notifications">
          <FiBell className="icon bell" />
        </div>

        <div className="user-box">
          <img
            src={user?.photo || "https://i.pravatar.cc/40"}
            alt={fullName}
            className="user-img"
          />
          <span>{fullName}</span>
        </div>

        <FiLogOut
          className="icon"
          title="Déconnexion"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />

      </div>
    </nav>
  );
}
