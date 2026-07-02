import client from "./client";

export default {
  listForModule: (moduleId, groupeId) =>
    client.get("/notes", { params: { module_id: moduleId, groupe_id: groupeId || undefined } }).then((r) => r.data),
  bulletin: () => client.get("/bulletin").then((r) => r.data),
  create: (data) => client.post("/notes", data).then((r) => r.data),
  update: (id, data) => client.put(`/notes/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/notes/${id}`).then((r) => r.data),
};
