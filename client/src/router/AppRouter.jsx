import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
// import ProtectedRoute from "../components/ProtectedRoute";
// import Home from "../pages/Home";
// import Hotels from "../pages/Hotels";
// import HotelDetail from "../pages/HotelDetail";
import Login from "../auth/Login";
import Register from "../auth/Register";
// import MyBookings from "../pages/MyBookings";
// import Notifications from "../pages/Notifications";
// import About from "../pages/About";
// import Contact from "../pages/Contact";
// import NotFound from "../pages/NotFound";
// import { ROLES } from "../utils/constants";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Register/>} />
        {/* <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}

        {/* <Route
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

        <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRouter;
