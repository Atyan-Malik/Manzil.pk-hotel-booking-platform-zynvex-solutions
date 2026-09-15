import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

import {
  ROLES,
  BOOKING_STATUS,
} from "../config/constants.js";

const assertHotelOwnership = async (
  hotelId,
  user
) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new AppError(
      "Hotel not found.",
      404
    );
  }

  if (
    hotel.owner.toString() !==
      user._id.toString() &&
    user.role !== ROLES.ADMIN
  ) {
    throw new AppError(
      "You do not manage this hotel.",
      403
    );
  }

  return hotel;
};

export const getRoomsByHotel = catchAsync(
  async (req, res) => {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
      isActive: true,
    }).populate(
      "amenities",
      "name icon"
    );

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  }
);

export const getRoom = catchAsync(
  async (req, res, next) => {
    const room = await Room.findById(
      req.params.id
    )
      .populate(
        "amenities",
        "name icon"
      )
      .populate("hotel");

    if (!room) {
      return next(
        new AppError(
          "Room not found.",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      room,
    });
  }
);

export const createRoom = catchAsync(
  async (req, res) => {
    await assertHotelOwnership(
      req.body.hotel,
      req.user
    );

    const room = await Room.create(
      req.body
    );

    res.status(201).json({
      success: true,
      room,
    });
  }
);

export const updateRoom = catchAsync(
  async (req, res, next) => {
    const room = await Room.findById(
      req.params.id
    );

    if (!room) {
      return next(
        new AppError(
          "Room not found.",
          404
        )
      );
    }

    await assertHotelOwnership(
      room.hotel,
      req.user
    );

    Object.assign(room, req.body);

    await room.save();

    res.status(200).json({
      success: true,
      room,
    });
  }
);

export const deleteRoom = catchAsync(
  async (req, res, next) => {
    const room = await Room.findById(
      req.params.id
    );

    if (!room) {
      return next(
        new AppError(
          "Room not found.",
          404
        )
      );
    }

    await assertHotelOwnership(
      room.hotel,
      req.user
    );

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Room deleted successfully.",
    });
  }
);

export const checkAvailability = catchAsync(
  async (req, res, next) => {
    const {
      checkIn,
      checkOut,
      roomsRequested = 1,
    } = req.query;

    const room = await Room.findById(
      req.params.id
    );

    if (!room) {
      return next(
        new AppError(
          "Room not found.",
          404
        )
      );
    }

    if (!checkIn || !checkOut) {
      return next(
        new AppError(
          "checkIn and checkOut dates are required.",
          400
        )
      );
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return next(
        new AppError(
          "Invalid check-in or check-out date.",
          400
        )
      );
    }

    if (start >= end) {
      return next(
        new AppError(
          "Check-out date must be after check-in date.",
          400
        )
      );
    }

    const overlappingBookings =
      await Booking.find({
        room: room._id,
        status: {
          $in: [
            BOOKING_STATUS.PENDING,
            BOOKING_STATUS.CONFIRMED,
          ],
        },
        checkIn: {
          $lt: end,
        },
        checkOut: {
          $gt: start,
        },
      });

    const roomsAlreadyBooked =
      overlappingBookings.reduce(
        (sum, booking) =>
          sum + booking.roomsBooked,
        0
      );

    const roomsAvailable =
      room.totalRooms -
      roomsAlreadyBooked;

    const isAvailable =
      roomsAvailable >=
      Number(roomsRequested);

    res.status(200).json({
      success: true,
      isAvailable,
      roomsAvailable: Math.max(
        roomsAvailable,
        0
      ),
    });
  }
);