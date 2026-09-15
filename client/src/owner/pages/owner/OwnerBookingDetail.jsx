import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Building2, BedDouble, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { getBooking, cancelBooking } from "../../../services/bookingService";

import Spinner from "../../components/owner/Spinner";
import ErrorState from "../../components/owner/ErrorState";
import StatusBadge from "../../components/owner/StatusBadge";

const CANCELLABLE = ["pending", "confirmed"];

const OwnerBookingDetail = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("loading");
  const [booking, setBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getBooking(id);
      setBooking(data.booking);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async () => {
    const reason = window.prompt("Reason for cancellation (optional):", "");
    if (reason === null) return;

    setCancelling(true);
    try {
      const data = await cancelBooking(id, reason);
      setBooking(data.booking);
      toast.success("Booking cancelled.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  if (status === "loading") return <Spinner label="Loading booking..." />;
  if (status === "error") return <ErrorState message="Could not load this booking." onRetry={load} />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/owner/bookings"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft size={15} />
        Back to Bookings
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">Booking Details</h1>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-6 space-y-5 rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5 sm:p-6">
        <Section icon={User} title="Customer">
          <Row label="Name" value={booking.guestName || booking.customer?.name} />
          <Row label="Email" value={booking.customer?.email} />
          <Row label="Phone" value={booking.guestPhone || booking.customer?.phone || "—"} />
        </Section>

        <Divider />

        <Section icon={Building2} title="Stay">
          <Row label="Hotel" value={booking.hotel?.name} />
          <Row label="Check-in" value={new Date(booking.checkIn).toLocaleDateString()} />
          <Row label="Check-out" value={new Date(booking.checkOut).toLocaleDateString()} />
          <Row label="Nights" value={booking.nights} />
          <Row
            label="Guests"
            value={`${booking.guests?.adults || 1} adult(s)${
              booking.guests?.children ? `, ${booking.guests.children} child(ren)` : ""
            }`}
          />
        </Section>

        <Divider />

        <Section icon={BedDouble} title="Room">
          <Row label="Type" value={booking.room?.roomType} />
          <Row label="Rooms Booked" value={booking.roomsBooked} />
          <Row label="Price / Night" value={`PKR ${booking.pricePerNight?.toLocaleString()}`} />
          <Row label="Total Price" value={`PKR ${booking.totalPrice?.toLocaleString()}`} bold />
        </Section>

        {booking.status === "cancelled" && booking.cancellationReason && (
          <>
            <Divider />
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <strong>Cancellation reason:</strong> {booking.cancellationReason}
            </div>
          </>
        )}

        {CANCELLABLE.includes(booking.status) && (
          <>
            <Divider />
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              <XCircle size={16} />
              {cancelling ? "Cancelling..." : "Cancel Booking"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, children }) => (
  <div>
    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
      <Icon size={14} />
      {title}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const Row = ({ label, value, bold }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted">{label}</span>
    <span className={bold ? "font-bold text-ink" : "font-semibold text-ink"}>{value || "—"}</span>
  </div>
);

const Divider = () => <div className="h-px bg-[#EFF3EA]" />;

export default OwnerBookingDetail;
