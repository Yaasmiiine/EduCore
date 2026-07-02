import client from "./client";

export default {
  list: (params) => client.get("/activity-logs", { params }).then((r) => r.data),
};
