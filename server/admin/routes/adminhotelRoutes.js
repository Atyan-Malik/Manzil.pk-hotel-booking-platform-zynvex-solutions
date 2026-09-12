const express = require("express");

const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  updateHotelStatus,
  addHotelImages,
  deleteHotelImage,
  setCoverImage,
} = require("../controllers/hotelController");

const { protectAdmin } = require("../middleware/adminAuth");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

router.use(protectAdmin);

router.route("/").get(getHotels).post(createHotel);

router
  .route("/:id")
  .get(getHotelById)
  .put(updateHotel)
  .delete(deleteHotel);

router.patch("/:id/status", updateHotelStatus);

router.post(
  "/:id/images",
  upload.array("images", 10),
  addHotelImages
);

router.delete("/:id/images/:imageId", deleteHotelImage);

router.patch(
  "/:id/images/:imageId/cover",
  setCoverImage
);

module.exports = router;