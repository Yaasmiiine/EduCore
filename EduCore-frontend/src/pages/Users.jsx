import "../styles/users.css";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import usersApi from "../api/users";
import groupesApi from "../api/groupes";
import { listRoles } from "../api/roles";
import { toFrontendRole } from "../utils/auth.jsx";

import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const EMPTY_FORM = { nom: "", prenom: "", email: "", password: "", role_id: "", groupe_id: "" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const loadAll = () => {
    setLoading(true);
    return Promise.all([usersApi.list(), listRoles(), groupesApi.list()])
      .then(([usersData, rolesData, groupesData]) => {
        setUsers(usersData);
        setRoles(rolesData);
        setGroupes(groupesData);
        setError("");
      })
      .catch(() => setError("Impossible de charger les utilisateurs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selectedRoleNom = roles.find((r) => String(r.id) === String(form.role_id))?.nom;
  const isStagiaireRole = selectedRoleNom === "stagiaire";

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setForm({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: "",
      role_id: user.role_id,
      groupe_id: user.groupe_id || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      role_id: form.role_id,
      groupe_id: form.groupe_id || null,
    };
    if (!editingId) payload.password = form.password;

    try {
      if (editingId) {
        await usersApi.update(editingId, payload);
      } else {
        await usersApi.create(payload);
      }
      setShowModal(false);
      await loadAll();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setFormError(
        errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;
    try {
      await usersApi.remove(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      setError("Impossible de supprimer cet utilisateur.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesRole = !roleFilter || u.role?.nom === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="dashboard">

      <Sidebar />

      {/* MODAL */}
      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>{editingId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>

            {formError && <p style={{ color: "#dc2626", gridColumn: "span 2" }}>{formError}</p>}

            <form className="modal-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rôle</label>

                <select
                  value={form.role_id}
                  onChange={(e) => setForm({ ...form, role_id: e.target.value, groupe_id: "" })}
                  required
                >
                  <option value="">Sélectionner un rôle</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.nom}</option>
                  ))}
                </select>
              </div>

              {!editingId && (
                <div className="form-group">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    minLength={6}
                    required
                  />
                </div>
              )}

              {isStagiaireRole && (
                <div className="form-group">
                  <label>Groupe</label>
                  <select
                    value={form.groupe_id}
                    onChange={(e) => setForm({ ...form, groupe_id: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groupes.map((groupe) => (
                      <option key={groupe.id} value={groupe.id}>
                        {groupe.filiere?.nom} — {groupe.nom}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      <main className="users-page">

        {/* HEADER */}
        <div className="users-header">

          <div>
            <h1>Utilisateurs</h1>
            <p>Gérez tous les utilisateurs de la plateforme</p>
          </div>

          <button
            className="add-user-btn"
            onClick={openCreateModal}
          >
            <FaPlus />
            Ajouter un utilisateur
          </button>

        </div>

        {error && <p style={{ color: "#dc2626", marginBottom: 16 }}>{error}</p>}

        {/* TOP SECTION */}
        <div className="users-top">

          <div className="search-filter">

            <div className="search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Filtrer par rôle</option>
              {roles.map((role) => (
                <option key={role.id} value={role.nom}>{role.nom}</option>
              ))}
            </select>

          </div>

          <div className="total-users">

            <div className="users-icon">
              <FaUsers />
            </div>

            <div>
              <p>Total utilisateurs</p>
              <h2>{users.length}</h2>
            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="table-container">

          {loading ? (
            <p style={{ padding: 24 }}>Chargement...</p>
          ) : (
          <table>

            <thead>

              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Groupe</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td className="user-name">
                    <img
                      src={`https://i.pravatar.cc/40?u=${user.id}`}
                      alt=""
                    />

                    {user.prenom} {user.nom}
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className={`role ${toFrontendRole(user.role?.nom)}`}>
                      {user.role?.nom}
                    </span>
                  </td>

                  <td>{user.groupe?.nom || "—"}</td>

                  <td>

                    <div className="actions">

                      <button onClick={() => openEditModal(user)}>
                        <FaEdit />
                      </button>

                      <button className="delete" onClick={() => handleDelete(user)}>
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
          )}

        </div>

      </main>

    </div>
  );
}
