require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const userRoutes = require("./routes/userRoutes");
const adminauthRoutes = require("./admin/routes/adminauthRoutes")
const adminbookingRoutes = require("./admin/routes/adminbookingRoutes")
const admindashboardRoutes = require("./admin/routes/admindashboardRoutes")
const adminhotelRoutes = require("./admin/routes/adminhotelRoutes")

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "SafarStay API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/users", userRoutes);
// admin starts from here
app.use("/api/admin/auth", adminauthRoutes);
app.use("/api/admin/hotels", adminhotelRoutes);
app.use("/api/admin/bookings", adminbookingRoutes);
app.use("/api/admin/dashboard", admindashboardRoutes);


app.all('/*splat', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SafarStay server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
