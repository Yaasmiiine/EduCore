import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {

  const { role } = useAuth();

  switch(role) {

    case "admin":
      return <AdminDashboard />;

    case "teacher":
      return <TeacherDashboard />;

    case "student":
      return <StudentDashboard />;

    default:
      return <h1>Access Denied</h1>;
  }
}