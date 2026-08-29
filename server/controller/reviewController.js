const Review = require("../models/Review");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { BOOKING_STATUS, ROLES } = require("../config/constants");
const { createNotification } = require("../services/notificationService");

const recalculateHotelRating = async (hotelId) => {
  const stats = await Review.aggregate([
    { $match: { hotel: hotelId, isHidden: false } },
    { $group: { _id: "$hotel", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
  ]);

  await Hotel.findByIdAndUpdate(hotelId, {
    avgRating: stats[0]?.avgRating || 0,
    totalReviews: stats[0]?.totalReviews || 0,
  });
};

exports.getHotelReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ hotel: req.params.hotelId, isHidden: false })
    .populate("customer", "name avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { booking: bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return next(new AppError("Booking not found.", 404));

  if (booking.customer.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only review your own bookings.", 403));
  }

  if (booking.status !== BOOKING_STATUS.COMPLETED) {
    return next(new AppError("You can only review completed stays.", 400));
  }

  const existing = await Review.findOne({ booking: bookingId });
  if (existing) return next(new AppError("You already reviewed this booking.", 400));

  const review = await Review.create({
    hotel: booking.hotel,
    customer: req.user._id,
    booking: bookingId,
    rating,
    comment,
  });

  await recalculateHotelRating(booking.hotel);

  const hotel = await Hotel.findById(booking.hotel);
  await createNotification({
    user: hotel.owner,
    type: "review_posted",
    title: "New Review",
    message: `${req.user.name} left a ${rating}-star review on ${hotel.name}.`,
    relatedId: review._id,
  });

  res.status(201).json({ success: true, review });
});

exports.replyToReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate("hotel");
  if (!review) return next(new AppError("Review not found.", 404));

  if (review.hotel.owner.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
    return next(new AppError("You do not manage this hotel.", 403));
  }

  review.managerReply = req.body.reply;
  await review.save();

  await createNotification({
    user: review.customer,
    type: "review_reply",
    title: "Manager Replied to Your Review",
    message: `The manager of ${review.hotel.name} replied to your review.`,
    relatedId: review._id,
  });

  res.status(200).json({ success: true, review });
});

exports.moderateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("Review not found.", 404));

  review.isHidden = req.body.isHidden;
  review.isFlagged = req.body.isFlagged ?? review.isFlagged;
  await review.save();

  await recalculateHotelRating(review.hotel);

  res.status(200).json({ success: true, review });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("Review not found.", 404));

  if (review.customer.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
    return next(new AppError("You cannot delete this review.", 403));
  }

  const hotelId = review.hotel;
  await review.deleteOne();
  await recalculateHotelRating(hotelId);

  res.status(200).json({ success: true, message: "Review deleted." });
});
