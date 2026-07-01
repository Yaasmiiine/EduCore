import { FaHome, FaBook, FaBullhorn, FaUsers, FaCalendar } from "react-icons/fa";
export const menuByRole = {
  admin: [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Modules", path: "/modules", icon: <FaBook /> },
    { name: "Announcements", path: "/announcements", icon: <FaBullhorn /> },
    { name: "Schedule", path: "/schedule", icon: <FaCalendar /> },
    { name: "Users", path: "/users", icon: <FaUsers /> }
  ],

  teacher: [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Modules", path: "/modules", icon: <FaBook /> },
    { name: "Announcements", path: "/announcements", icon: <FaBullhorn /> },
    { name: "Schedule", path: "/schedule", icon: <FaCalendar /> },
  ],

  student: [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Schedule", path: "/schedule", icon: <FaCalendar /> },
  ],
};