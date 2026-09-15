import mongoose from "mongoose";

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

const Amenity = mongoose.model("Amenity", amenitySchema);

export default Amenity;