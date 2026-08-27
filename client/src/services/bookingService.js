import api from "./api";

export const createBooking = (payload) => api.post("/bookings", payload).then((res) => res.data);

export const getMyBookings = () => api.get("/bookings/my-bookings").then((res) => res.data);

export const getBooking = (id) => api.get(`/bookings/${id}`).then((res) => res.data);

export const cancelBooking = (id, reason) =>
  api.patch(`/bookings/${id}/cancel`, { reason }).then((res) => res.data);

export const getHotelBookings = (hotelId) =>
  api.get(`/bookings/hotel/${hotelId}`).then((res) => res.data);
