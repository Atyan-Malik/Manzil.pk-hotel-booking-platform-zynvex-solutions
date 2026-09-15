import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import adminauthRoutes from "./admin/routes/adminauthRoutes.js";
import adminbookingRoutes from "./admin/routes/adminbookingRoutes.js";
import admindashboardRoutes from "./admin/routes/admindashboardRoutes.js";
import adminhotelRoutes from "./admin/routes/adminhotelRoutes.js";

dotenv.config({ path: "../.env" });

await connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());

// Cookies
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SafarStay API is running",
  });
});

// ==============================
// Public/User Routes
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/users", userRoutes);

// ==============================
// Admin Routes
// ==============================

app.use("/api/admin/auth", adminauthRoutes);
app.use("/api/admin/hotels", adminhotelRoutes);
app.use("/api/admin/bookings", adminbookingRoutes);
app.use("/api/admin/dashboard", admindashboardRoutes);

// ==============================
// 404 Handler
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ==============================
// Global Error Handler
// ==============================

app.use(errorHandler);

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Manzil.pk server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});