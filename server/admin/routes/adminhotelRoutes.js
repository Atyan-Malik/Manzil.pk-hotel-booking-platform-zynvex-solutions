import express from "express";
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  updateHotelStatus,
  addHotelImages,
  deleteHotelImage,
  setCoverImage,
} from "../controllers/hotelController.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();
 
router.use(protectAdmin);

router.route("/").get(getHotels).post(createHotel);
router.route("/:id").get(getHotelById).put(updateHotel).delete(deleteHotel);
router.patch("/:id/status", updateHotelStatus);
router.post("/:id/images", upload.array("images", 10), addHotelImages);
router.delete("/:id/images/:imageId", deleteHotelImage);
router.patch("/:id/images/:imageId/cover", setCoverImage);

export default router;
