import api from "./api";

export const register = (payload) => api.post("/auth/register", payload).then((res) => res.data);

export const login = (payload) => api.post("/auth/login", payload).then((res) => res.data);

export const logout = () => api.post("/auth/logout").then((res) => res.data);

export const getMe = () => api.get("/auth/me").then((res) => res.data);

export const updateMe = (payload) => api.patch("/auth/update-me", payload).then((res) => res.data);

export const updatePassword = (payload) =>
  api.patch("/auth/update-password", payload).then((res) => res.data);
