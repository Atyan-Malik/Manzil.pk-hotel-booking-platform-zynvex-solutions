import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary credentials check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "MISSING",
  api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
});

cloudinary.api.ping()
  .then(() => console.log("✅ Cloudinary connection successful"))
  .catch((err) => {
  console.error("❌ Cloudinary connection failed");
  console.error("Error:", err);
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "manzil-hotels",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1600, crop: "limit" }],
  },
});

export const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });
export default cloudinary;
