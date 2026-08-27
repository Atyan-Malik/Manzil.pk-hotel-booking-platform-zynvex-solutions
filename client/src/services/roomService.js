import api from "./api";

export const getRoomsByHotel = (hotelId) =>
  api.get(`/rooms/hotel/${hotelId}`).then((res) => res.data);

export const getRoom = (id) => api.get(`/rooms/${id}`).then((res) => res.data);

export const checkRoomAvailability = (id, params) =>
  api.get(`/rooms/${id}/availability`, { params }).then((res) => res.data);

export const createRoom = (payload) => api.post("/rooms", payload).then((res) => res.data);

export const updateRoom = (id, payload) => api.patch(`/rooms/${id}`, payload).then((res) => res.data);

export const deleteRoom = (id) => api.delete(`/rooms/${id}`).then((res) => res.data);
