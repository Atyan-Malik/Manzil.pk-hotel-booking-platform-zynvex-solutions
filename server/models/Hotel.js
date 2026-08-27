const mongoose = require("mongoose");
const { HOTEL_STATUS, PAKISTAN_CITIES } = require("../config/constants");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      enum: PAKISTAN_CITIES,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(HOTEL_STATUS),
      default: HOTEL_STATUS.PENDING,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    contactPhone: String,
    contactEmail: String,
    policies: {
      checkInTime: { type: String, default: "14:00" },
      checkOutTime: { type: String, default: "12:00" },
      cancellationPolicy: { type: String, default: "Free cancellation up to 24 hours before check-in" },
    },
  },
  { timestamps: true }
);

hotelSchema.index({ location: "2dsphere" });
hotelSchema.index({ city: 1, status: 1 });
hotelSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Hotel", hotelSchema);
