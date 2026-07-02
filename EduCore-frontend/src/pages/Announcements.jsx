import { useEffect, useMemo, useState } from "react";

import "../styles/announcements.css";

import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import annoncesApi from "../api/annonces";
import groupesApi from "../api/groupes";
import { useAuth } from "../context/AuthContext.jsx";

import {
  FaBullhorn,
  FaSearch,
  FaPlus,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const EMPTY_FORM = { titre: "", contenu: "", priorite: "normale", groupe_id: "" };

export default function Announcements() {
  const { role, user } = useAuth();
  const canCreate = role === "admin" || role === "teacher";
  // Students see a small, already-scoped set (global + their groupe), so
  // that view stays a simple unpaginated client-side filter like before.
  // Admin/teacher (who browse the full list) get real server pagination.
  const isPaginated = role !== "student";

  const [annonces, setAnnonces] = useState([]);
  const [meta, setMeta] = useState(null);
  const [statsAnnonces, setStatsAnnonces] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [prioriteFilter, setPrioriteFilter] = useState("");
  const [page, setPage] = useState(1);

  const loadAnnonces = () => {
    setLoading(true);
    const request = isPaginated
      ? annoncesApi.list({ page, per_page: 10, search: search || undefined, priorite: prioriteFilter || undefined })
      : annoncesApi.list();

    return request
      .then((res) => {
        if (isPaginated) {
          setAnnonces(res.data);
          setMeta(res);
        } else {
          setAnnonces(res);
          setMeta(null);
        }
        setError("");
      })
      .catch(() => setError("Impossible de charger les annonces."))
      .finally(() => setLoading(false));
  };

  // Reference data loaded once: groupes for the form, and the full
  // (unpaginated) annonces list purely to compute accurate stat counts.
  useEffect(() => {
    Promise.all([groupesApi.list(), annoncesApi.list()])
      .then(([groupesData, annoncesData]) => {
        setGroupes(groupesData);
        setStatsAnnonces(annoncesData);
      })
      .catch(() => setError("Impossible de charger les annonces."));
  }, []);

  useEffect(() => {
    const t = setTimeout(loadAnnonces, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, prioriteFilter, isPaginated]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePrioriteFilterChange = (e) => {
    setPrioriteFilter(e.target.value);
    setPage(1);
  };

  const refreshStats = () => {
    annoncesApi.list().then(setStatsAnnonces).catch(() => {});
  };

  const canModify = (annonce) => role === "admin" || annonce.auteur_id === user?.id;

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (annonce) => {
    setEditingId(annonce.id);
    setForm({
      titre: annonce.titre,
      contenu: annonce.contenu,
      priorite: annonce.priorite,
      groupe_id: annonce.groupe_id || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = { ...form, groupe_id: form.groupe_id || null };
    try {
      if (editingId) {
        await annoncesApi.update(editingId, payload);
      } else {
        await annoncesApi.create(payload);
      }
      setShowModal(false);
      await loadAnnonces();
      refreshStats();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (annonce) => {
    if (!window.confirm(`Supprimer l'annonce "${annonce.titre}" ?`)) return;
    try {
      await annoncesApi.remove(annonce.id);
      loadAnnonces();
      refreshStats();
    } catch {
      setError("Impossible de supprimer cette annonce.");
    }
  };

  // Students only see global announcements + the ones aimed at their own groupe.
  // For admin/teacher the list is already the current server-paginated page.
  const visibleAnnonces = useMemo(() => {
    if (role !== "student") return annonces;
    return annonces.filter((a) => !a.groupe_id || a.groupe_id === user?.groupe_id);
  }, [annonces, role, user]);

  const filteredAnnonces = useMemo(() => {
    if (isPaginated) return visibleAnnonces;
    return visibleAnnonces.filter((a) => {
      const matchesSearch = a.titre.toLowerCase().includes(search.toLowerCase());
      const matchesPriorite = !prioriteFilter || a.priorite === prioriteFilter;
      return matchesSearch && matchesPriorite;
    });
  }, [visibleAnnonces, search, prioriteFilter, isPaginated]);

  const visibleStatsAnnonces = useMemo(() => {
    if (role !== "student") return statsAnnonces;
    return statsAnnonces.filter((a) => !a.groupe_id || a.groupe_id === user?.groupe_id);
  }, [statsAnnonces, role, user]);

  const countByPriorite = (p) => visibleStatsAnnonces.filter((a) => a.priorite === p).length;

  return (
    <div className="dashboard">

      <Sidebar />

      <main className="announcements-page">

        {/* HEADER */}
        <div className="announcements-header">

          <div>
            <h1>Annonces</h1>
            <p>
              Gérez toutes les annonces de votre établissement.
            </p>
          </div>

          {canCreate && (
            <button
              className="add-announcement-btn"
              onClick={openCreateModal}
            >
              <FaPlus />
              Créer une annonce
            </button>
          )}

        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        {/* STATS */}
        <div className="announcements-stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              <FaBullhorn />
            </div>

            <div>
              <p>Total annonces</p>
              <h2>{isPaginated ? (meta?.total ?? 0) : visibleStatsAnnonces.length}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              <FaBullhorn />
            </div>

            <div>
              <p>Priorité normale</p>
              <h2>{countByPriorite("normale")}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              <FaExclamationTriangle />
            </div>

            <div>
              <p>Importantes</p>
              <h2>{countByPriorite("importante")}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>

            <div>
              <p>Urgentes</p>
              <h2>{countByPriorite("urgente")}</h2>
            </div>

          </div>

        </div>

        {/* FILTERS */}
        <div className="filters-container">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={search}
              onChange={handleSearchChange}
            />

          </div>

          <select value={prioriteFilter} onChange={handlePrioriteFilterChange}>
            <option value="">Filtrer par priorité</option>
            <option value="normale">Normale</option>
            <option value="importante">Importante</option>
            <option value="urgente">Urgente</option>
          </select>

        </div>

        {/* TABLE */}
        <div className="announcements-table-container">

          {loading ? (
            <p style={{ padding: 24 }}>Chargement...</p>
          ) : (
          <table>

            <thead>

              <tr>
                <th>Titre</th>
                <th>Groupe</th>
                <th>Priorité</th>
                <th>Publié le</th>
                <th>Auteur</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredAnnonces.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>Aucune annonce trouvée.</td></tr>
              )}

              {filteredAnnonces.map((item) => (

                <tr key={item.id}>

                  <td>

                    <div className="announcement-title">

                      <div className="announcement-icon purple">
                        <FaBullhorn />
                      </div>

                      <div>
                        <h4>{item.titre}</h4>
                        <p>{item.contenu.slice(0, 60)}{item.contenu.length > 60 ? "..." : ""}</p>
                      </div>

                    </div>

                  </td>

                  <td>
                    <span className="badge audience">
                      {item.groupe?.nom || "Tous"}
                    </span>
                  </td>

                  <td>
                    <span className={`badge status ${item.priorite}`}>
                      {item.priorite}
                    </span>
                  </td>

                  <td>
                    <div className="date">
                      <span>{new Date(item.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </td>

                  <td>

                    <div className="author">

                      <img
                        src={`https://i.pravatar.cc/40?u=${item.auteur_id}`}
                        alt=""
                      />

                      {item.auteur ? `${item.auteur.prenom} ${item.auteur.nom}` : "—"}

                    </div>

                  </td>

                  <td>

                    {canModify(item) && (
                    <div className="actions">

                      <button onClick={() => openEditModal(item)}>
                        <FaEdit />
                      </button>

                      <button className="delete" onClick={() => handleDelete(item)}>
                        <FaTrash />
                      </button>

                    </div>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
          )}

          {!loading && isPaginated && meta && (
            <div className="table-footer">
              <p>{meta.total} résultat(s) — page {meta.current_page} / {meta.last_page}</p>
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}

        </div>

        {/* MODAL */}
        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h2>{editingId ? "Modifier l'annonce" : "Créer une annonce"}</h2>

                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>

              </div>

              {formError && <p style={{ color: "#dc2626" }}>{formError}</p>}

              <form className="modal-form" onSubmit={handleSubmit}>

                <div className="form-group full">
                  <label>Titre</label>

                  <input
                    type="text"
                    placeholder="Titre de l'annonce"
                    value={form.titre}
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Groupe (optionnel)</label>

                  <select
                    value={form.groupe_id}
                    onChange={(e) => setForm({ ...form, groupe_id: e.target.value })}
                  >
                    <option value="">Tous les groupes</option>
                    {groupes.map((g) => (
                      <option key={g.id} value={g.id}>{g.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priorité</label>

                  <select
                    value={form.priorite}
                    onChange={(e) => setForm({ ...form, priorite: e.target.value })}
                  >
                    <option value="normale">Normale</option>
                    <option value="importante">Importante</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Contenu</label>

                  <textarea
                    rows="5"
                    placeholder="Contenu de l'annonce..."
                    value={form.contenu}
                    onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={saving}
                  >
                    {saving ? "Publication..." : editingId ? "Enregistrer" : "Publier"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}
