import client from "./client";

export const chat = (message) => client.post("/ai/chat", { message }).then((r) => r.data);
