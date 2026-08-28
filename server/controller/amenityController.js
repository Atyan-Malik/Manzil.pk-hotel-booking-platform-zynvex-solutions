const Amenity = require("../models/Amenity");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAmenities = catchAsync(async (req, res) => {
  const amenities = await Amenity.find().sort({ name: 1 });
  res.status(200).json({ success: true, count: amenities.length, amenities });
});

exports.createAmenity = catchAsync(async (req, res) => {
  const amenity = await Amenity.create(req.body);
  res.status(201).json({ success: true, amenity });
});

exports.deleteAmenity = catchAsync(async (req, res, next) => {
  const amenity = await Amenity.findByIdAndDelete(req.params.id);
  if (!amenity) return next(new AppError("Amenity not found.", 404));
  res.status(200).json({ success: true, message: "Amenity deleted." });
});
