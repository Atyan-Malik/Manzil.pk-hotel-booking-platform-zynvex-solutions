import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Eye } from "lucide-react";

import { getMyHotels } from "../../../services/hotelService";
import { getHotelBookings } from "../../../services/bookingService";

import Spinner from "../../components/owner/Spinner";
import ErrorState from "../../components/owner/ErrorState";
import EmptyState from "../../components/owner/EmptyState";
import StatusBadge from "../../components/owner/StatusBadge";

const FILTERS = ["all", "pending", "confirmed", "cancelled", "completed"];

const OwnerBookings = () => {
  const [status, setStatus] = useState("loading");
  const [bookings, setBookings] = useState([]);
  const [hotelsById, setHotelsById] = useState({});
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { hotels } = await getMyHotels();
      const map = Object.fromEntries(hotels.map((h) => [h._id, h]));
      setHotelsById(map);

      const results = await Promise.all(
        hotels.map((h) => getHotelBookings(h._id).catch(() => ({ bookings: [] })))
      );
      const all = results.flatMap((r) => r.bookings || []);
      all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(all);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") return <Spinner label="Loading bookings..." />;
  if (status === "error") return <ErrorState onRetry={load} />;

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Bookings</h1>
      <p className="mt-1 text-sm text-muted">All reservations across your hotels.</p>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold capitalize transition ${
              filter === f
                ? "border-[#8FE13D] bg-[#8FE13D] text-[#17210F]"
                : "border-[#E2E8DE] text-muted hover:border-[#CFE5B9]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={CalendarCheck}
            title="No bookings found"
            description={
              filter === "all"
                ? "Bookings for your hotels will show up here."
                : `No ${filter} bookings right now.`
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#E2E8DE] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-[#E9EFE4] bg-[#FBFDF9] text-left text-xs font-bold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Hotel</th>
                  <th className="px-5 py-3">Check-in</th>
                  <th className="px-5 py-3">Check-out</th>
                  <th className="px-5 py-3">Guests</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id} className="border-b border-[#F1F5EC] last:border-0">
                    <td className="px-5 py-4 font-semibold text-ink">{b.guestName || "Guest"}</td>
                    <td className="px-5 py-4 text-muted">{hotelsById[b.hotel]?.name || "—"}</td>
                    <td className="px-5 py-4 text-muted">
                      {new Date(b.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {b.guests?.adults || 1} adult{b.guests?.adults === 1 ? "" : "s"}
                      {b.guests?.children ? `, ${b.guests.children} child.` : ""}
                    </td>
                    <td className="px-5 py-4 font-semibold text-ink">
                      PKR {b.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/owner/bookings/${b._id}`}
                        className="inline-flex items-center gap-1 rounded-lg p-2 text-muted hover:bg-[#F1F6EC] hover:text-ink"
                        aria-label="View booking"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
