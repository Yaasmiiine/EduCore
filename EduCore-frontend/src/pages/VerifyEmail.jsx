import "../styles/auth.css";

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import * as authApi from "../api/auth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Ce lien de vérification est invalide ou incomplet.");
      return;
    }

    authApi
      .verifyEmail({ email, token })
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Une erreur est survenue lors de la vérification.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logoblack.png" alt="EduCore Logo" className="logo-icon" />
          <h1>
            Edu<span>Core</span>
          </h1>
        </div>

        <h2>Vérification de l'email</h2>

        {status === "verifying" && <p>Vérification en cours...</p>}

        {status === "success" && (
          <div className="auth-success" style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
            <FaCheckCircle /> {message}
          </div>
        )}

        {status === "error" && (
          <div className="auth-error" style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
            <FaTimesCircle /> {message}
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}
