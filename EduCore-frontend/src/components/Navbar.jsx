import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/navbar.css";
import { FiBell, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import * as notificationsApi from "../api/notifications";

const POLL_INTERVAL_MS = 20000;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.list();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch {
      // Silently skip a failed poll — it will retry on the next interval.
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleBellClick = () => {
    setOpen((o) => !o);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      try {
        await notificationsApi.markRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // Non-fatal — still navigate even if the mark-read call fails.
      }
    }
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // Non-fatal, next poll will resync.
    }
  };

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

        <div className="notifications" ref={panelRef}>
          <div className="bell-wrapper" onClick={handleBellClick}>
            <FiBell className="icon bell" />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </div>

          {open && (
            <div className="notif-panel">
              <div className="notif-panel-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={handleMarkAllRead}>
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="notif-panel-body">
                {notifications.length === 0 && (
                  <div className="notif-empty">Aucune notification</div>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.read_at ? "" : "unread"}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <span className="notif-message">{n.message}</span>
                    <span className="notif-time">{new Date(n.created_at).toLocaleString("fr-FR")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
