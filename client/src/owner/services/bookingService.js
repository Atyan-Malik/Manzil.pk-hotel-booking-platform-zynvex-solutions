import api from "../../services/api";

export const getMyBookings = () => api.get("/bookings/my-bookings").then((res) => res.data);

export const getBooking = (id) => api.get(`/bookings/${id}`).then((res) => res.data);

export const cancelBooking = (id, reason) =>
  api.patch(`/bookings/${id}/cancel`, { reason }).then((res) => res.data);

// Owner-facing: bookings for a single hotel the authenticated owner manages.
// Backend enforces hotel.owner === req.user._id (see bookingController.getHotelBookings).
export const getHotelBookings = (hotelId) =>
  api.get(`/bookings/hotel/${hotelId}`).then((res) => res.data);
