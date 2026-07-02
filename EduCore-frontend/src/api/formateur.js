import client from "./client";

export default {
  mesEtudiants: () => client.get("/mes-etudiants").then((r) => r.data),
  mesStatistiques: () => client.get("/mes-statistiques").then((r) => r.data),
};
