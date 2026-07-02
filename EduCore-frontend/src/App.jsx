import "./styles/global.css";

import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Announcements from "./pages/Announcements";
import Schedule from "./pages/Schedule";
import Modules from "./pages/Modules";
import Users from "./pages/Users";
import Groups from "./pages/Groups";
import Filieres from "./pages/Filieres";
import Salles from "./pages/Salles";
import GenerationIA from "./pages/GenerationIA";
import ConflictDetection from "./pages/ConflictDetection";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Bulletin from "./pages/Bulletin";
import Notes from "./pages/Notes";
import Presences from "./pages/Presences";
import Progression from "./pages/Progression";
import ExamCalendar from "./pages/ExamCalendar";
import MyStudents from "./pages/MyStudents";
import Devoirs from "./pages/Devoirs";
import ActivityLog from "./pages/ActivityLog";
import TypesEvaluation from "./pages/TypesEvaluation";


import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from "./components/ChatWidget";
import { SidebarProvider } from "./context/SidebarContext.jsx";

function App() {

  const location = useLocation();
  const isPublicPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/verify-email";

  return (
    <SidebarProvider>

      {/* HIDE NAVBAR ON HOME, LOGIN & REGISTER */}
      {!isPublicPage && <Navbar />}
      {!isPublicPage && <ChatWidget />}

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/modules"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Modules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/announcements"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Announcements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Groups />
            </ProtectedRoute>
          }
        />

        <Route
          path="/filieres"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Filieres />
            </ProtectedRoute>
          }
        />

        <Route
          path="/salles"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Salles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generation-ia"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <GenerationIA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conflict-detection"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ConflictDetection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bulletin"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Bulletin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/presences"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Presences />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progression"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Progression />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam-calendar"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ExamCalendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mes-etudiants"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <MyStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devoirs"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Devoirs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity-log"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ActivityLog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/types-evaluation"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TypesEvaluation />
            </ProtectedRoute>
          }
        />

      </Routes>
    </SidebarProvider>
  );
}

export default App;