import client from "./client";
import { makeResource } from "./resource";

const base = makeResource("devoirs");

export default {
  ...base,
  soumissions: (devoirId) => client.get(`/devoirs/${devoirId}/soumissions`).then((r) => r.data),
  soumettre: (devoirId, file) => {
    const formData = new FormData();
    formData.append("fichier", file);
    return client
      .post(`/devoirs/${devoirId}/soumissions`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
  telechargerSoumission: (soumissionId) =>
    client.get(`/soumissions/${soumissionId}/download`, { responseType: "blob" }).then((r) => r.data),
};
