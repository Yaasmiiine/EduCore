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
import ManualTimetableEditor from "./pages/ManualTimetableEditor";
import Settings from "./pages/Settings";


import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from "./components/ChatWidget";

import "./styles/global.css";

function App() {

  const location = useLocation();
  const isPublicPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>

      {/* HIDE NAVBAR ON HOME, LOGIN & REGISTER */}
      {!isPublicPage && <Navbar />}
      {!isPublicPage && <ChatWidget />}

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

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
          path="/manual-timetable-editor"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManualTimetableEditor />
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

      </Routes>
    </>
  );
}

export default App;