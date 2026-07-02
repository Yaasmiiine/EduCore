import PresenceHistory from "./PresenceHistory";
import AttendanceSheet from "./AttendanceSheet";
import { useAuth } from "../context/AuthContext.jsx";

export default function Presences() {
  const { role } = useAuth();

  if (role === "admin" || role === "teacher") {
    return <AttendanceSheet />;
  }

  return <PresenceHistory />;
}
