import { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../layout/Topbar";
import StatusBadge from "../components/StatusBadge";
import { getBookingById, updateBookingStatus, updatePaymentStatus } from "../services/adminBookingService";
import { formatCurrency, formatDate, formatDateTime, nightsBetween } from "../utils/format";

const STATUS_OPTIONS = ["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"];
const PAYMENT_OPTIONS = ["unpaid", "partial", "paid", "refunded"];

const BookingDetail = () => {
  const { openSidebar } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = () => getBookingById(id).then(setBooking).finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const handleStatus = async (status) => {
    setUpdating(true);
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status.replace("_", " ")}`);
      load();
    } catch {
      toast.error("Could not update booking status");
    } finally {
      setUpdating(false);
    }
  };

  const handlePayment = async (paymentStatus) => {
    setUpdating(true);
    try {
      await updatePaymentStatus(id, paymentStatus);
      toast.success(`Payment marked as ${paymentStatus}`);
      load();
    } catch {
      toast.error("Could not update payment status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-8 text-sm text-ink-faint">Loading booking…</p>;
  if (!booking) return <p className="p-8 text-sm text-ink-faint">Booking not found.</p>;

  return (
    <>
      <Topbar
        title={booking.bookingRef}
        subtitle="Booking details"
        onMenuClick={openSidebar}
        actions={
          <button className="btn-ghost gap-1.5" onClick={() => navigate("/admin/bookings")}>
            <ArrowLeft size={15} /> All bookings
          </button>
        }
      />
      <main className="flex-1 px-5 py-6 md:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="card lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold">Stay details</h2>
              <StatusBadge status={booking.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-ink-faint">Check-in</p>
                <p className="font-medium">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Check-out</p>
                <p className="font-medium">{formatDate(booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Nights</p>
                <p className="font-medium">{nightsBetween(booking.checkIn, booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Room type</p>
                <p className="font-medium">{booking.roomType}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Guests</p>
                <p className="font-medium">{booking.guests?.adults} adults, {booking.guests?.children} children</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Booked on</p>
                <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface-muted p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Building2 size={15} /> {booking.hotel?.name}
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">{booking.hotel?.location?.address}, {booking.hotel?.location?.city}</p>
            </div>

            {booking.notes && (
              <div>
                <p className="text-xs text-ink-faint mb-1">Notes</p>
                <p className="text-sm text-ink-soft">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="card">
              <h2 className="mb-3 font-display text-base font-bold">Guest</h2>
              <p className="font-semibold">{booking.guest?.name}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft"><Mail size={14} /> {booking.guest?.email}</p>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft"><Phone size={14} /> {booking.guest?.phone}</p>
            </div>

            <div className="card">
              <h2 className="mb-3 font-display text-base font-bold">Payment</h2>
              <p className="font-display text-2xl font-bold">{formatCurrency(booking.totalAmount, booking.currency)}</p>
              <p className="mt-1 text-xs text-ink-faint">Status: <StatusBadge status={booking.paymentStatus} /></p>
              <select
                disabled={updating}
                value={booking.paymentStatus}
                onChange={(e) => handlePayment(e.target.value)}
                className="field-input mt-3"
              >
                {PAYMENT_OPTIONS.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>

            <div className="card">
              <h2 className="mb-3 font-display text-base font-bold">Booking status</h2>
              <select
                disabled={updating}
                value={booking.status}
                onChange={(e) => handleStatus(e.target.value)}
                className="field-input"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BookingDetail;
