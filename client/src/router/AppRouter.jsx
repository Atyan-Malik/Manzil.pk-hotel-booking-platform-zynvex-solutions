import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ==================== WEBSITE ====================
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoutes";

import Home from "../pages/Home";
import Hotels from "../pages/Hotels";
import HotelDetail from "../pages/HotelDetail";
import Login from "../auth/Login";
import Register from "../auth/Register";
import MyBookings from "../pages/MyBookings";
import Notifications from "../pages/Notifications";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

import { ROLES } from "../utils/constants";

// ==================== ADMIN ====================
import { AdminAuthProvider } from "../admin/context/AdminAuthContext";
import AdminLayout from "../admin/layout/AdminLayout";

import AdminLogin from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard";
import AdminHotels from "../admin/pages/Hotels";
import HotelForm from "../admin/pages/HotelForm";
import AdminBookings from "../admin/pages/Bookings";
import BookingDetail from "../admin/pages/BookingDetail";

// ==================== OWNER ====================
import OwnerLayout from "../owner/layout/OwnerLayout";
import OwnerDashboard from "../owner/pages/owner/OwnerDashboard";
import OwnerHotels from "../owner/pages/owner/OwnerHotels";
import OwnerHotelForm from "../owner/pages/owner/OwnerHotelForm";
import OwnerHotelDetail from "../owner/pages/owner/OwnerHotelDetail";
import OwnerBookings from "../owner/pages/owner/OwnerBookings";
import OwnerBookingDetail from "../owner/pages/owner/OwnerBookingDetail";
import OwnerReviews from "../owner/pages/owner/OwnerReviews";
import OwnerProfile from "../owner/pages/owner/OwnerProfile";

function App() {
  return (
    <AdminAuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          },
        }}
      />

      <Routes>
        {/* =====================================================
            PUBLIC WEBSITE
        ===================================================== */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/hotels" element={<Hotels />} />

          <Route path="/hotels/:id" element={<HotelDetail />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          {/* Customer protected routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Website 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* =====================================================
            OWNER DASHBOARD
            Same site, same login as customers — gated by role.
        ===================================================== */}

        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={[ROLES.HOTEL_MANAGER]}>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          {/* /owner */}
          <Route index element={<OwnerDashboard />} />

          {/* /owner/hotels */}
          <Route path="hotels" element={<OwnerHotels />} />

          {/* /owner/hotels/new */}
          <Route path="hotels/new" element={<OwnerHotelForm />} />

          {/* /owner/hotels/:id — view details, rooms, performance */}
          <Route path="hotels/:id" element={<OwnerHotelDetail />} />

          {/* /owner/hotels/:id/edit */}
          <Route path="hotels/:id/edit" element={<OwnerHotelForm />} />

          {/* /owner/bookings */}
          <Route path="bookings" element={<OwnerBookings />} />

          {/* /owner/bookings/:id */}
          <Route path="bookings/:id" element={<OwnerBookingDetail />} />

          {/* /owner/reviews */}
          <Route path="reviews" element={<OwnerReviews />} />

          {/* /owner/profile */}
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* =====================================================
            ADMIN DASHBOARD
        ===================================================== */}

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute type="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin */}
          <Route index element={<Dashboard />} />

          {/* /admin/hotels */}
          <Route path="hotels" element={<AdminHotels />} />

          {/* /admin/hotels/new */}
          <Route path="hotels/new" element={<HotelForm />} />

          {/* /admin/hotels/:id */}
          <Route path="hotels/:id" element={<HotelForm />} />

          {/* /admin/bookings */}
          <Route path="bookings" element={<AdminBookings />} />

          {/* /admin/bookings/:id */}
          <Route path="bookings/:id" element={<BookingDetail />} />
        </Route>

        {/* =====================================================
            GLOBAL FALLBACK
        ===================================================== */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
