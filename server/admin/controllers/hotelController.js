import slugify from "slugify";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getHotels = asyncHandler(async (req, res) => {
  const { search, status, city, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (search) filter.$text = { $search: search };
  if (status) filter.status = status;
  if (city) filter["location.city"] = city;

  const skip = (Number(page) - 1) * Number(limit);
  const [hotels, total] = await Promise.all([
    Hotel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Hotel.countDocuments(filter),
  ]);

  res.json({ hotels, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }
  res.json(hotel);
});

export const createHotel = asyncHandler(async (req, res) => {
  const payload = req.body;
  let slug = slugify(payload.name, { lower: true, strict: true });
  const existing = await Hotel.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  const hotel = await Hotel.create({
    ...payload,
    slug,
    createdBy: req.admin._id,
  });
  res.status(201).json(hotel);
});

export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }
  if (req.body.name && req.body.name !== hotel.name) {
    let slug = slugify(req.body.name, { lower: true, strict: true });
    const existing = await Hotel.findOne({ slug, _id: { $ne: hotel._id } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;
    req.body.slug = slug;
  }
  Object.assign(hotel, req.body);
  await hotel.save();
  res.json(hotel);
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }
  const activeBookings = await Booking.countDocuments({
    hotel: hotel._id,
    status: { $in: ["pending", "confirmed", "checked_in"] },
  });
  if (activeBookings > 0) {
    res.status(400);
    throw new Error("Cannot delete a hotel with active bookings. Set it to inactive instead.");
  }
  await hotel.deleteOne();
  res.json({ message: "Hotel deleted", id: req.params.id });
});

export const updateHotelStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }
  res.json(hotel);
});

export const addHotelImages = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }
  const files = req.files || [];
  const newImages = files.map((f) => ({
    url: f.path,
    publicId: f.filename,
    isCover: hotel.images.length === 0,
  }));
  hotel.images.push(...newImages);
  await hotel.save();
  res.status(201).json(hotel.images);
});

export const deleteHotelImage = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }
  hotel.images = hotel.images.filter((img) => img._id.toString() !== req.params.imageId);
  await hotel.save();
  res.json(hotel.images);
});

export const setCoverImage = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }
  hotel.images.forEach((img) => {
    img.isCover = img._id.toString() === req.params.imageId;
  });
  await hotel.save();
  res.json(hotel.images);
});
