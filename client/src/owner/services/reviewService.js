import api from "./api";

export const getHotelReviews = (hotelId) =>
  api.get(`/reviews/hotel/${hotelId}`).then((res) => res.data);

// Owner-facing: reply to a review on one of the owner's hotels.
// Backend enforces review.hotel.owner === req.user._id (see reviewController.replyToReview).
export const replyToReview = (id, reply) =>
  api.patch(`/reviews/${id}/reply`, { reply }).then((res) => res.data);
