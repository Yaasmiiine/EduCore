import "../styles/navbar.css";
import { FiBell,  } from "react-icons/fi";

export default function Navbar() {
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
            src="https://i.pravatar.cc/40"
            alt="admin"
            className="user-img"
          />
          <span>Admin</span>
        </div>

      </div>
    </nav>
  );
}