import client from "./client";

export const listRoles = () => client.get("/roles").then((r) => r.data);
