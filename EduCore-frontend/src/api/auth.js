import client from "./client";

export const register = (data) => client.post("/auth/register", data).then((r) => r.data);
export const login = (data) => client.post("/auth/login", data).then((r) => r.data);
export const logout = () => client.post("/auth/logout").then((r) => r.data);
export const me = () => client.get("/auth/me").then((r) => r.data);
export const refresh = () => client.post("/auth/refresh").then((r) => r.data);
export const updateProfile = (data) => client.put("/profile", data).then((r) => r.data);
export const updatePassword = (data) => client.put("/profile/password", data).then((r) => r.data);
