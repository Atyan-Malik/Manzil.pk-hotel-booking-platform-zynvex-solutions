const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["hotel", "room", "both"],
      default: "both",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Amenity", amenitySchema);
