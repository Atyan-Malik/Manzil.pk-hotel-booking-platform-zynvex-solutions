const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { BOOKING_STATUS, ROLES } = require("../config/constants");
const { createNotification } = require("../services/notificationService");
const { sendEmail, bookingConfirmationTemplate } = require("../services/emailService");

const msPerNight = 1000 * 60 * 60 * 24;

const getRoomsAvailable = async (roomId, start, end, excludeBookingId = null) => {
  const room = await Room.findById(roomId);
  if (!room) return { room: null, available: 0 };

  const filter = {
    room: roomId,
    status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  };
  if (excludeBookingId) filter._id = { $ne: excludeBookingId };

  const overlapping = await Booking.find(filter);
  const booked = overlapping.reduce((sum, b) => sum + b.roomsBooked, 0);

  return { room, available: room.totalRooms - booked };
};

exports.createBooking = catchAsync(async (req, res, next) => {
  const { room: roomId, checkIn, checkOut, roomsBooked = 1, guests, guestName, guestPhone } = req.body;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (start >= end) return next(new AppError("Check-out date must be after check-in date.", 400));
  if (start < new Date().setHours(0, 0, 0, 0)) {
    return next(new AppError("Check-in date cannot be in the past.", 400));
  }

  const { room, available } = await getRoomsAvailable(roomId, start, end);
  if (!room) return next(new AppError("Room not found.", 404));
  if (available < roomsBooked) {
    return next(new AppError(`Only ${Math.max(available, 0)} room(s) available for these dates.`, 400));
  }

  const nights = Math.round((end - start) / msPerNight);
  const totalPrice = nights * room.pricePerNight * roomsBooked;

  const booking = await Booking.create({
    customer: req.user._id,
    hotel: room.hotel,
    room: room._id,
    checkIn: start,
    checkOut: end,
    roomsBooked,
    guests,
    nights,
    pricePerNight: room.pricePerNight,
    totalPrice,
    guestName: guestName || req.user.name,
    guestPhone: guestPhone || req.user.phone,
    status: BOOKING_STATUS.CONFIRMED,
  });

  const hotel = await Hotel.findById(room.hotel);

  await createNotification({
    user: req.user._id,
    type: "booking_confirmed",
    title: "Booking Confirmed",
    message: `Your booking at ${hotel.name} for ${nights} night(s) is confirmed.`,
    relatedId: booking._id,
  });

  await createNotification({
    user: hotel.owner,
    type: "booking_created",
    title: "New Booking Received",
    message: `${req.user.name} booked ${roomsBooked} ${room.roomType} room(s) at ${hotel.name}.`,
    relatedId: booking._id,
  });

  sendEmail({
    to: req.user.email,
    subject: "Your SafarStay booking is confirmed",
    html: bookingConfirmationTemplate(booking, hotel, room),
  }).catch((err) => console.error("Email send failed:", err.message));

  res.status(201).json({ success: true, booking });
});

exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user._id })
    .populate("hotel", "name city images")
    .populate("room", "roomType pricePerNight")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("hotel")
    .populate("room")
    .populate("customer", "name email phone");

  if (!booking) return next(new AppError("Booking not found.", 404));

  const isOwnerOfBooking = booking.customer._id.toString() === req.user._id.toString();
  const isHotelManager = booking.hotel.owner.toString() === req.user._id.toString();

  if (!isOwnerOfBooking && !isHotelManager && req.user.role !== ROLES.ADMIN) {
    return next(new AppError("You do not have access to this booking.", 403));
  }

  res.status(200).json({ success: true, booking });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate("hotel");
  if (!booking) return next(new AppError("Booking not found.", 404));

  const isOwnerOfBooking = booking.customer.toString() === req.user._id.toString();
  const isHotelManager = booking.hotel.owner.toString() === req.user._id.toString();

  if (!isOwnerOfBooking && !isHotelManager && req.user.role !== ROLES.ADMIN) {
    return next(new AppError("You cannot cancel this booking.", 403));
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    return next(new AppError("This booking is already cancelled.", 400));
  }

  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancellationReason = req.body.reason || "";
  await booking.save();

  await createNotification({
    user: booking.customer,
    type: "booking_cancelled",
    title: "Booking Cancelled",
    message: `Your booking at ${booking.hotel.name} has been cancelled.`,
    relatedId: booking._id,
  });

  res.status(200).json({ success: true, booking });
});

exports.getHotelBookings = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) return next(new AppError("Hotel not found.", 404));

  if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
    return next(new AppError("You do not manage this hotel.", 403));
  }

  const bookings = await Booking.find({ hotel: hotel._id })
    .populate("customer", "name email phone")
    .populate("room", "roomType")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});
