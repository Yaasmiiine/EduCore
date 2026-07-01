import client from "./client";
import { makeResource } from "./resource";

const base = makeResource("emplois-du-temps");

export default {
  ...base,
  generateIA: (groupeId) =>
    client.post("/emplois-du-temps/generate-ia", { groupe_id: groupeId }).then((r) => r.data),
  bulkCreate: (seances) =>
    client.post("/emplois-du-temps/bulk", { seances }).then((r) => r.data),
};
