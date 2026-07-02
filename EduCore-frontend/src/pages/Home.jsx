import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { sendContactMessage } from "../api/contact";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

import {
  FaLayerGroup,
  FaClock
} from "react-icons/fa";

import {
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaBullhorn,
  FaRobot,
  FaShieldAlt,
  FaUserTie,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaArrowRight,
  FaGraduationCap
} from "react-icons/fa";

const EMPTY_CONTACT_FORM = { name: "", email: "", message: "" };

export default function Home() {
  const [contactForm, setContactForm] = useState(EMPTY_CONTACT_FORM);
  const [contactStatus, setContactStatus] = useState({ loading: false, error: "", success: "" });

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, error: "", success: "" });
    try {
      const { message } = await sendContactMessage(contactForm);
      setContactStatus({ loading: false, error: "", success: message });
      setContactForm(EMPTY_CONTACT_FORM);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const errorMessage = errors
        ? Object.values(errors).flat().join(" ")
        : "Une erreur est survenue, veuillez réessayer.";
      setContactStatus({ loading: false, error: errorMessage, success: "" });
    }
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="home-navbar">

        <div className="navbar-left">
          <div className="logo">
            <img src="/logo.png" alt="EduCore Logo" className="logo-icon" />
            <h2>Edu</h2>
          </div>
        </div>

        <ul className="nav-links">
          <li><a href="#home">Accueil</a></li>
          <li><a href="#features">Fonctionnalités</a></li>
          <li><a href="#about">À propos</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-buttons">

            <Link to="/login">
              <button className="login-btn">
                Connexion
              </button>
            </Link>

            <Link to="/register">
              <button className="start-btn">
                Commencer
              </button>
            </Link>

        </div>

      </nav>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-left">

          <h1>
            Gérez votre établissement
            plus intelligemment avec
            <span> EduCore</span>
          </h1>

          <p>
            EduCore est une plateforme moderne pour gérer
            les étudiants, enseignants, emplois du temps
            et automatisations intelligentes.
          </p>

          <div className="hero-buttons">
            <Link to="/register">
              <button className="primary-btn">
                Commencer maintenant <FaArrowRight />
              </button>
            </Link>

          </div>

        </div>

        <div className="hero-right">

          <div className="hero-logo-3d">
            <FaGraduationCap />
          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features" id="features">

        <div className="section-header">
          <h2>Fonctionnalités principales</h2>

          <p>
            Tout ce dont vous avez besoin pour gérer
            votre établissement efficacement.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <FaUsers />
            <h3>Gestion utilisateurs</h3>
            <p>Étudiants, enseignants et administrateurs.</p>
          </div>

          <div className="feature-card">
            <FaCalendarAlt />
            <h3>Emplois intelligents</h3>
            <p>Génération automatique sans conflits.</p>
          </div>

          <div className="feature-card">
            <FaChartLine />
            <h3>Suivi académique</h3>
            <p>Notes, présence et performances.</p>
          </div>

          <div className="feature-card">
            <FaBullhorn />
            <h3>Annonces</h3>
            <p>Communication rapide et efficace.</p>
          </div>

          <div className="feature-card">
            <FaRobot />
            <h3>IA & Automatisation</h3>
            <p>Optimisation intelligente.</p>
          </div>

          <div className="feature-card">
            <FaShieldAlt />
            <h3>Sécurité</h3>
            <p>Accès sécurisé selon les rôles.</p>
          </div>

        </div>

      </section>

      {/* STATS */}
<section className="stats-bar">

  <div className="stat">
    <FaUsers />
    <div className="stat-text">
      <h3>12K+</h3>
      <p>Étudiants</p>
    </div>
  </div>

  <div className="stat">
    <FaChalkboardTeacher />
    <div className="stat-text">
      <h3>540+</h3>
      <p>Enseignants</p>
    </div>
  </div>

  <div className="stat">
    <FaLayerGroup />
    <div className="stat-text">
      <h3>24</h3>
      <p>Filières</p>
    </div>
  </div>

  <div className="stat">
    <FaRobot />
    <div className="stat-text">
      <h3>95%</h3>
      <p>Taux d’automatisation</p>
    </div>
  </div>

  <div className="stat">
    <FaClock />
    <div className="stat-text">
      <h3>24/7</h3>
      <p>Accessible</p>
    </div>
  </div>

</section>
      {/* ROLES */}
      <section className="roles">

        <div className="section-header">
          <h2>Conçu pour tous les acteurs</h2>

          <p>
            Une plateforme adaptée à chaque rôle.
          </p>
        </div>

        <div className="roles-grid">

          <div className="role-card">
            <FaUserTie />
            <h3>Administrateur</h3>

            <p>
              Gestion des utilisateurs, modules,
              emplois du temps et analyses.
            </p>
          </div>

          <div className="role-card">
            <FaChalkboardTeacher />
            <h3>Enseignant</h3>

            <p>
              Gestion des cours, notes,
              présences et étudiants.
            </p>
          </div>

          <div className="role-card">
            <FaUserGraduate />
            <h3>Étudiant</h3>

            <p>
              Accès aux notes, annonces
              et emplois du temps.
            </p>
          </div>

        </div>

      </section>

     {/* ABOUT  */}
<section className="about-section" id="about">

  <div className="about-left">

    <div className="section-header left">
      <h2>À propos d’EduCore</h2>

      <p>
        EduCore est une plateforme moderne conçue
        pour simplifier la gestion académique des
        établissements d’enseignement.
      </p>
    </div>

    <div className="about-features">

      <div className="about-box">
        <FaRobot />
        <div>
          <h3>Automatisation intelligente</h3>
          <p>
            Réduction des tâches répétitives grâce
            à l’intelligence artificielle.
          </p>
        </div>
      </div>

      <div className="about-box">
        <FaShieldAlt />
        <div>
          <h3>Sécurité avancée</h3>
          <p>
            Protection des données avec accès
            sécurisé par rôles.
          </p>
        </div>
      </div>

      <div className="about-box">
        <FaChartLine />
        <div>
          <h3>Analyses en temps réel</h3>
          <p>
            Suivi des performances et statistiques
            détaillées.
          </p>
        </div>
      </div>

    </div>

  </div>

  <div className="about-right">

    <div className="about-card">
      <h3>Notre mission</h3>

      <p>
        Moderniser les établissements éducatifs
        avec une plateforme intuitive, rapide
        et intelligente.
      </p>

      <div className="about-stats">

        <div>
          <h4>99%</h4>
          <span>Satisfaction</span>
        </div>

        <div>
          <h4>50+</h4>
          <span>Établissements</span>
        </div>

      </div>

    </div>

  </div>

</section>

     {/* CONTACT  */}
<section className="contact-section" id="contact">

  <div className="section-header">
    <h2>Contactez-nous</h2>

    <p>
      Une question ? Notre équipe est là pour vous aider.
    </p>
  </div>

  <div className="contact-container">

    <div className="contact-info">

      <div className="contact-card">
        <FaEnvelope />
        <div>
          <h3>Email</h3>
          <p>contact@educore.com</p>
        </div>
      </div>

      <div className="contact-card">
        <FaPhoneAlt />
        <div>
          <h3>Téléphone</h3>
          <p>+212 6 00 00 00 00</p>
        </div>
      </div>

      <div className="contact-card">
        <FaMapMarkerAlt />
        <div>
          <h3>Adresse</h3>
          <p>Agadir, Maroc</p>
        </div>
      </div>

    </div>

    <form className="contact-form" onSubmit={handleContactSubmit}>

      {contactStatus.error && <p className="contact-error">{contactStatus.error}</p>}
      {contactStatus.success && <p className="contact-success">{contactStatus.success}</p>}

      <input
        type="text"
        name="name"
        placeholder="Votre nom"
        value={contactForm.name}
        onChange={handleContactChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Votre email"
        value={contactForm.email}
        onChange={handleContactChange}
        required
      />

      <textarea
        rows="6"
        name="message"
        placeholder="Votre message"
        value={contactForm.message}
        onChange={handleContactChange}
        required
      ></textarea>

      <button className="primary-btn" disabled={contactStatus.loading}>
        {contactStatus.loading ? "Envoi..." : "Envoyer le message"}
      </button>

    </form>

  </div>

</section>



      {/* CTA */}
      <section className="cta">

        <h2>Prêt à transformer votre établissement ?</h2>

        <p>
          Rejoignez les établissements qui utilisent EduCore.
        </p>

        <button className="primary-btn">
          Commencer maintenant
        </button>

      </section>

      {/* FOOTER */}
      <footer className="footer">

  <div className="footer-left">

    <div className="footer-logo">
          <div className="logo">
            <img src="/logo.png" alt="EduCore Logo" className="logo-icon" />
            <h2>Edu</h2>
          </div>
    </div>

    <p className="footer-text">
      La plateforme intelligente pour une
      gestion académique moderne.
    </p>

    <div className="socials">
      <FaFacebookF />
      <FaInstagram />
      <FaLinkedinIn />
      <FaTwitter />
    </div>

  </div>

  <div className="footer-links">

    <div>
      <h4>Produit</h4>
      <p>Fonctionnalités</p>
      <p>Sécurité</p>
      <p>API</p>
    </div>

    <div>
      <h4>Ressources</h4>
      <p>Documentation</p>
      <p>Guides</p>
      <p>Support</p>
    </div>

    <div>
      <h4>Entreprise</h4>
      <p>À propos</p>
      <p>Contact</p>
    </div>

    <div>
      <h4>Légal</h4>
      <p>Confidentialité</p>
      <p>Conditions</p>
    </div>

  </div>

</footer>

    </div>
  );
}