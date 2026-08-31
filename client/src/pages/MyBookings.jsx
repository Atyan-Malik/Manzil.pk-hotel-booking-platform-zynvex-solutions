import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import { formatPKR, formatDate, getErrorMessage } from "../utils/helpers";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from "../utils/constants";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = () => {
    setIsLoading(true);
    getMyBookings()
      .then((data) => setBookings(data.bookings))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id, "Cancelled by customer");
      toast.success("Booking cancelled");
      loadBookings();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-ink">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-slateline p-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">No bookings yet</p>
          <p className="mt-1 text-sm text-muted">Start exploring hotels to plan your next trip.</p>
          <Link to="/hotels" className="btn-accent mt-6 inline-flex px-6 py-2.5 text-sm">
            Browse Hotels
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card flex flex-col gap-4 p-5 sm:flex-row">
              <img
                src={booking.hotel?.images?.[0]?.url || "https://placehold.co/200x150?text=SafarStay"}
                alt={booking.hotel?.name}
                className="h-32 w-full rounded-xl object-cover sm:w-44"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{booking.hotel?.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                      <MapPin size={14} /> {booking.hotel?.city}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${BOOKING_STATUS_COLORS[booking.status]}`}
                  >
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted">Room</p>
                    <p className="font-medium text-ink">{booking.room?.roomType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Check-in</p>
                    <p className="font-medium text-ink">{formatDate(booking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Check-out</p>
                    <p className="font-medium text-ink">{formatDate(booking.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Total</p>
                    <p className="font-medium text-ink">{formatPKR(booking.totalPrice)}</p>
                  </div>
                </div>

                {["pending", "confirmed"].includes(booking.status) && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
