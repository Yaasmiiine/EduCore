import DevoirsManage from "./DevoirsManage";
import DevoirsStudent from "./DevoirsStudent";
import { useAuth } from "../context/AuthContext.jsx";

export default function Devoirs() {
  const { role } = useAuth();

  if (role === "admin" || role === "teacher") {
    return <DevoirsManage />;
  }

  return <DevoirsStudent />;
}
