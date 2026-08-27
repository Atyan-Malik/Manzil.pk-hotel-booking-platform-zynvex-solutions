const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HOTEL_STATUS, ROLES } = require("../config/constants");
const { createNotification } = require("../services/notificationService");
const { sendEmail, hotelStatusTemplate } = require("../services/emailService");

exports.getHotels = catchAsync(async (req, res) => {
  const { city, minRating, amenities, search, sort, page = 1, limit = 12 } = req.query;

  const filter = { status: HOTEL_STATUS.APPROVED };

  if (city) filter.city = city;
  if (minRating) filter.avgRating = { $gte: Number(minRating) };
  if (amenities) filter.amenities = { $all: amenities.split(",") };
  if (search) filter.$text = { $search: search };

  const sortOptions = {
    rating: { avgRating: -1 },
    newest: { createdAt: -1 },
    name: { name: 1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [hotels, total] = await Promise.all([
    Hotel.find(filter)
      .populate("amenities", "name icon")
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Hotel.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: hotels.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    hotels,
  });
});

exports.getHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate("amenities", "name icon")
    .populate("owner", "name email phone");

  if (!hotel) return next(new AppError("Hotel not found.", 404));

  const rooms = await Room.find({ hotel: hotel._id, isActive: true }).populate("amenities", "name icon");

  res.status(200).json({ success: true, hotel, rooms });
});

exports.createHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.create({ ...req.body, owner: req.user._id, status: HOTEL_STATUS.PENDING });
  res.status(201).json({ success: true, hotel });
});

exports.updateHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return next(new AppError("Hotel not found.", 404));

  if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
    return next(new AppError("You do not own this hotel.", 403));
  }

  const restrictedFields = ["owner", "status"];
  restrictedFields.forEach((field) => delete req.body[field]);

  Object.assign(hotel, req.body);
  await hotel.save();

  res.status(200).json({ success: true, hotel });
});

exports.deleteHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return next(new AppError("Hotel not found.", 404));

  if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
    return next(new AppError("You do not own this hotel.", 403));
  }

  await Room.deleteMany({ hotel: hotel._id });
  await hotel.deleteOne();

  res.status(200).json({ success: true, message: "Hotel deleted successfully." });
});

exports.getMyHotels = catchAsync(async (req, res) => {
  const hotels = await Hotel.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: hotels.length, hotels });
});

exports.getAllHotelsAdmin = catchAsync(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const hotels = await Hotel.find(filter).populate("owner", "name email").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: hotels.length, hotels });
});

exports.reviewHotelStatus = catchAsync(async (req, res, next) => {
  const { decision, reason } = req.body;

  if (![HOTEL_STATUS.APPROVED, HOTEL_STATUS.REJECTED].includes(decision)) {
    return next(new AppError("Decision must be 'approved' or 'rejected'.", 400));
  }

  const hotel = await Hotel.findById(req.params.id).populate("owner", "name email");
  if (!hotel) return next(new AppError("Hotel not found.", 404));

  hotel.status = decision;
  hotel.rejectionReason = decision === HOTEL_STATUS.REJECTED ? reason || "" : "";
  await hotel.save();

  const approved = decision === HOTEL_STATUS.APPROVED;

  await createNotification({
    user: hotel.owner._id,
    type: approved ? "hotel_approved" : "hotel_rejected",
    title: approved ? "Hotel Approved" : "Hotel Rejected",
    message: approved
      ? `Your hotel "${hotel.name}" is now live on SafarStay.`
      : `Your hotel "${hotel.name}" was rejected. Reason: ${reason || "Not specified"}`,
    relatedId: hotel._id,
  });

  sendEmail({
    to: hotel.owner.email,
    subject: approved ? "Your hotel has been approved" : "Your hotel registration was rejected",
    html: hotelStatusTemplate(hotel, approved, reason),
  }).catch((err) => console.error("Email send failed:", err.message));

  res.status(200).json({ success: true, hotel });
});
