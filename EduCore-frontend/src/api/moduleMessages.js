import client from "./client";

export default {
  list: (moduleId) => client.get(`/modules/${moduleId}/messages`).then((r) => r.data),
  create: (moduleId, message) => client.post(`/modules/${moduleId}/messages`, { message }).then((r) => r.data),
  remove: (messageId) => client.delete(`/module-messages/${messageId}`).then((r) => r.data),
};
