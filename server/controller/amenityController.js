import Amenity from "../models/Amenity.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAmenities = catchAsync(async (req, res) => {
  const amenities = await Amenity.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: amenities.length,
    amenities,
  });
});

export const createAmenity = catchAsync(async (req, res) => {
  const amenity = await Amenity.create(req.body);

  res.status(201).json({
    success: true,
    amenity,
  });
});

export const deleteAmenity = catchAsync(async (req, res, next) => {
  const amenity = await Amenity.findByIdAndDelete(req.params.id);

  if (!amenity) {
    return next(new AppError("Amenity not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Amenity deleted.",
  });
});