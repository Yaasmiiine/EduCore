import client from "./client";
import { makeResource } from "./resource";

const base = makeResource("modules");

export default {
  ...base,
  etudiants: (moduleId, groupeId) =>
    client.get(`/modules/${moduleId}/etudiants`, { params: { groupe_id: groupeId || undefined } }).then((r) => r.data),
};
