import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getBookings = asyncHandler(async (req, res) => {
  const { status, hotel, search, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (hotel) filter.hotel = hotel;
  if (search) {
    filter.$or = [
      { bookingRef: { $regex: search, $options: "i" } },
      { "guest.name": { $regex: search, $options: "i" } },
      { "guest.email": { $regex: search, $options: "i" } },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("hotel", "name location.city images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);
  res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("hotel");
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  res.json(booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  res.json(booking);
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  const booking = await Booking.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  res.json(booking);
});
