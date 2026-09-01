import api from "./api";

export const getMyNotifications = () => api.get("/notifications").then((res) => res.data);

export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read`).then((res) => res.data);

export const markAllNotificationsRead = () =>
  api.patch("/notifications/read-all").then((res) => res.data);

export const deleteNotification = (id) => api.delete(`/notifications/${id}`).then((res) => res.data);
