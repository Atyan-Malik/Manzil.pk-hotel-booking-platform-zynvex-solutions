import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      adults: {
        type: Number,
        required: true,
        default: 2,
      },
      children: {
        type: Number,
        default: 0,
      },
    },

    bedType: {
      type: String,
      default: "Double",
    },

    totalRooms: {
      type: Number,
      required: true,
      min: 1,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roomSchema.index({
  hotel: 1,
});

const Room = mongoose.model("Room", roomSchema);

export default Room;