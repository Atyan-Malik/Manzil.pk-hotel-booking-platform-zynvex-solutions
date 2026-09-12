import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    caption: { type: String, default: "" },
    isCover: { type: Boolean, default: false },
  },
  { _id: true }
);

const amenitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "check" },
    category: {
      type: String,
      enum: ["general", "wellness", "food", "connectivity", "safety", "family", "accessibility"],
      default: "general",
    },
  },
  { _id: false }
);

const policySchema = new mongoose.Schema(
  {
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "12:00" },
    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict", "non_refundable"],
      default: "moderate",
    },
    cancellationNote: { type: String, default: "Free cancellation up to 24 hours before check-in." },
    petsAllowed: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    partiesAllowed: { type: Boolean, default: false },
    childrenAllowed: { type: Boolean, default: true },
    houseRules: [{ type: String }],
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, default: "" },
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "", maxlength: 200 },
    starRating: { type: Number, min: 1, max: 5, default: 3 },
    basePrice: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    location: { type: locationSchema, required: true },
    images: [imageSchema],
    amenities: [amenitySchema],
    policies: { type: policySchema, default: () => ({}) },
    contact: { type: contactSchema, default: () => ({}) },
    totalRooms: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "active", "inactive"], default: "draft" },
    featured: { type: Boolean, default: false },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

hotelSchema.index({ name: "text", "location.city": "text" });

const Hotel =
  mongoose.models.Hotel ||
  mongoose.model("Hotel", hotelSchema);

export default Hotel;