import client from "./client";

export default {
  seance: (emploiDuTempsId, date) =>
    client.get("/presences/seance", { params: { emploi_du_temps_id: emploiDuTempsId, date } }).then((r) => r.data),
  bulkSave: (emploiDuTempsId, date, presences) =>
    client.post("/presences/bulk", { emploi_du_temps_id: emploiDuTempsId, date, presences }).then((r) => r.data),
  mine: () => client.get("/presences/mine").then((r) => r.data),
};
