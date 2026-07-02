import client from "./client";

export const sendContactMessage = (data) => client.post("/contact", data).then((r) => r.data);
