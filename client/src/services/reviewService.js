import api from "./api";

export const getHotelReviews = (hotelId) =>
  api.get(`/reviews/hotel/${hotelId}`).then((res) => res.data);

export const createReview = (payload) => api.post("/reviews", payload).then((res) => res.data);

export const replyToReview = (id, reply) =>
  api.patch(`/reviews/${id}/reply`, { reply }).then((res) => res.data);

export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((res) => res.data);
