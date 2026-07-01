import client from "./client";

export const list = () => client.get("/notifications").then((r) => r.data);
export const markRead = (id) => client.post(`/notifications/${id}/read`).then((r) => r.data);
export const markAllRead = () => client.post("/notifications/read-all").then((r) => r.data);
