import client from "./client";
import { makeResource } from "./resource";

const base = makeResource("modules");

export default {
  ...base,
  etudiants: (moduleId) => client.get(`/modules/${moduleId}/etudiants`).then((r) => r.data),
};
