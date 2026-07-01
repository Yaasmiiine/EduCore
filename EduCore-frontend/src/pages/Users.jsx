import "../styles/users.css";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    joined: "May 12, 2024"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Teacher",
    status: "Active",
    joined: "May 10, 2024"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Teacher",
    status: "Active",
    joined: "May 8, 2024"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Student",
    status: "Active",
    joined: "May 6, 2024"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    role: "Student",
    status: "Inactive",
    joined: "May 5, 2024"
  }
];

export default function Users() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">

      <Sidebar role="admin" />

      {/* MODAL */}

{showModal && (

  <div className="modal-overlay">

    <div className="modal">

      <div className="modal-header">

        <h2>Add New User</h2>

        <button
          className="close-btn"
          onClick={() => setShowModal(false)}
        >
          ×
        </button>

      </div>

      <form className="modal-form">

        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Role</label>

          <select>
            <option>Admin</option>
            <option>Teacher</option>
            <option>Student</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <label>Status</label>

          <select>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-btn"
          >
            Add User
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
            <h1>Users</h1>
            <p>Manage all users in the system</p>
          </div>

          <button
            className="add-user-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            Add User
          </button>

        </div>

        {/* TOP SECTION */}
        <div className="users-top">

          <div className="search-filter">

            <div className="search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Search users..."
              />
            </div>

            <select>
              <option>Filter by role</option>
              <option>Admin</option>
              <option>Teacher</option>
              <option>Student</option>
            </select>

          </div>

          <div className="total-users">

            <div className="users-icon">
              <FaUsers />
            </div>

            <div>
              <p>Total Users</p>
              <h2>132</h2>
            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined At</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td className="user-name">
                    <img
                      src={`https://i.pravatar.cc/40?img=${user.id}`}
                      alt=""
                    />

                    {user.name}
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className={`role ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>

                  <td>{user.joined}</td>

                  <td>

                    <div className="actions">

                      <button>
                        <FaEye />
                      </button>

                      <button>
                        <FaEdit />
                      </button>

                      <button className="delete">
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

         {/* FOOTER */}
        <div className="table-footer">

          <p>
            Affichage de 1 à 6 sur 12 filières
          </p>

          <div className="pagination">

            <button>{"<"}</button>

            <button className="active">
              1
            </button>

            <button>2</button>

            <button>{">"}</button>

          </div>

        </div>

        </div>

      </main>

    </div>
  );
}