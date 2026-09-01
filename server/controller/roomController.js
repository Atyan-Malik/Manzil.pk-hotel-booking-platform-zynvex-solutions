const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { ROLES, BOOKING_STATUS } = require("../config/constants");

const assertHotelOwnership = async (hotelId, user) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) throw new AppError("Hotel not found.", 404);
  if (hotel.owner.toString() !== user._id.toString() && user.role !== ROLES.ADMIN) {
    throw new AppError("You do not manage this hotel.", 403);
  }
  return hotel;
};

exports.getRoomsByHotel = catchAsync(async (req, res) => {
  const rooms = await Room.find({ hotel: req.params.hotelId, isActive: true }).populate(
    "amenities",
    "name icon"
  );
  res.status(200).json({ success: true, count: rooms.length, rooms });
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate("amenities", "name icon").populate("hotel");
  if (!room) return next(new AppError("Room not found.", 404));
  res.status(200).json({ success: true, room });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  await assertHotelOwnership(req.body.hotel, req.user);
  const room = await Room.create(req.body);
  res.status(201).json({ success: true, room });
});

exports.updateRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if (!room) return next(new AppError("Room not found.", 404));

  await assertHotelOwnership(room.hotel, req.user);

  Object.assign(room, req.body);
  await room.save();

  res.status(200).json({ success: true, room });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if (!room) return next(new AppError("Room not found.", 404));

  await assertHotelOwnership(room.hotel, req.user);

  await room.deleteOne();
  res.status(200).json({ success: true, message: "Room deleted successfully." });
});

exports.checkAvailability = catchAsync(async (req, res, next) => {
  const { checkIn, checkOut, roomsRequested = 1 } = req.query;
  const room = await Room.findById(req.params.id);

  if (!room) return next(new AppError("Room not found.", 404));

  if (!checkIn || !checkOut) {
    return next(new AppError("checkIn and checkOut dates are required.", 400));
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (start >= end) {
    return next(new AppError("Check-out date must be after check-in date.", 400));
  }

  const overlappingBookings = await Booking.find({
    room: room._id,
    status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });

  const roomsAlreadyBooked = overlappingBookings.reduce((sum, b) => sum + b.roomsBooked, 0);
  const roomsAvailable = room.totalRooms - roomsAlreadyBooked;
  const isAvailable = roomsAvailable >= Number(roomsRequested);

  res.status(200).json({
    success: true,
    isAvailable,
    roomsAvailable: Math.max(roomsAvailable, 0),
  });
});
