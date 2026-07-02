import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/academique.css";
import emploisDuTempsApi from "../api/emploisDuTemps";
import { useAuth } from "../context/AuthContext.jsx";

const TYPE_LABELS = { examen: "Examen", controle: "Contrôle", tp: "TP" };

const countdown = (dateStr) => {
  if (!dateStr) return null;
  const days = Math.ceil((new Date(dateStr) - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Passé";
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Dans 1 jour";
  return `Dans ${days} jours`;
};

export default function ExamCalendar() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.groupe_id) {
      setLoading(false);
      return;
    }
    emploisDuTempsApi
      .list({ groupe_id: user.groupe_id, type: "examen" })
      .then((examens) =>
        emploisDuTempsApi
          .list({ groupe_id: user.groupe_id, type: "controle" })
          .then((controles) => {
            const all = [...examens, ...controles].sort(
              (a, b) => new Date(a.date_examen) - new Date(b.date_examen)
            );
            setExams(all);
          })
      )
      .catch(() => setError("Impossible de charger le calendrier des examens."))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="academic-page">
        <div className="academic-header">
          <div>
            <h1>Calendrier des examens</h1>
            <p>Retrouvez vos prochains examens et contrôles.</p>
          </div>
        </div>

        {error && <p className="academic-error">{error}</p>}

        {loading ? (
          <p>Chargement...</p>
        ) : exams.length === 0 ? (
          <p>Aucun examen programmé pour le moment.</p>
        ) : (
          <div className="exam-grid">
            {exams.map((exam) => (
              <div className={`exam-card type-${exam.type}`} key={exam.id}>
                <span className="exam-type">
                  <FaExclamationCircle style={{ marginRight: 6 }} />
                  {TYPE_LABELS[exam.type] || exam.type}
                </span>
                <h3>{exam.module?.nom}</h3>
                <p className="exam-meta">Formateur : {exam.formateur?.prenom} {exam.formateur?.nom}</p>
                <p className="exam-meta">Salle : {exam.salle?.nom}</p>
                <p className="exam-meta">Horaire : {exam.heure_debut?.slice(0, 5)} - {exam.heure_fin?.slice(0, 5)}</p>
                <p className="exam-meta">
                  Date : {exam.date_examen ? new Date(exam.date_examen).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "—"}
                </p>
                <div className="exam-countdown">{countdown(exam.date_examen)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
