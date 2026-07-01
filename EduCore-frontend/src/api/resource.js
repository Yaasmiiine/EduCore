import client from "./client";

// Thin CRUD wrapper shared by the simple REST resources (users, filieres,
// groupes, salles, modules, annonces, emplois-du-temps).
export function makeResource(path) {
  return {
    list: (params) => client.get(`/${path}`, { params }).then((r) => r.data),
    get: (id) => client.get(`/${path}/${id}`).then((r) => r.data),
    create: (data) => client.post(`/${path}`, data).then((r) => r.data),
    update: (id, data) => client.put(`/${path}/${id}`, data).then((r) => r.data),
    remove: (id) => client.delete(`/${path}/${id}`).then((r) => r.data),
  };
}
