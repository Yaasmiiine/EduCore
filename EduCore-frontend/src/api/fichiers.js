import client from "./client";

export default {
  list: (params) => client.get("/fichiers", { params }).then((r) => r.data),
  get: (id) => client.get(`/fichiers/${id}`).then((r) => r.data),
  upload: (moduleId, file) => {
    const formData = new FormData();
    formData.append("module_id", moduleId);
    formData.append("fichier", file);
    return client
      .post("/fichiers", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
  remove: (id) => client.delete(`/fichiers/${id}`).then((r) => r.data),
  resume: (id) => client.post(`/fichiers/${id}/resume`).then((r) => r.data),
};
