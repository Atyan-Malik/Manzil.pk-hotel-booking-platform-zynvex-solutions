import { useEffect, useState, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Search, CalendarCheck } from "lucide-react";
import Topbar from "../layout/Topbar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { getBookings } from "../services/adminBookingService";
import { formatCurrency, formatDate } from "../utils/format";

const STATUS_FILTERS = ["all", "pending", "confirmed", "checked_in", "checked_out", "cancelled"];

const Bookings = () => {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback((page = 1) => {
    setLoading(true);
    getBookings({ search: search || undefined, status: status === "all" ? undefined : status, page })
      .then((data) => {
        setBookings(data.bookings);
        setMeta({ page: data.page, pages: data.pages, total: data.total });
      })
      .finally(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(() => load(1), 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <>
      <Topbar title="Bookings" subtitle={`${meta.total} reservations`} onMenuClick={openSidebar} />
      <main className="flex-1 px-5 py-6 md:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              className="field-input pl-9"
              placeholder="Search by guest or ref…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition ${
                  status === s ? "bg-ink text-white" : "bg-white text-ink-soft border border-line hover:border-ink/30"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden !p-0">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-ink-faint">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={CalendarCheck} title="No bookings found" description="Reservations will appear here once guests start booking." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-5 py-3 font-semibold">Reference</th>
                    <th className="px-5 py-3 font-semibold">Guest</th>
                    <th className="px-5 py-3 font-semibold">Hotel</th>
                    <th className="px-5 py-3 font-semibold">Dates</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="cursor-pointer hover:bg-surface-muted/60"
                      onClick={() => navigate(`/admin/bookings/${b._id}`)}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-ink-soft">{b.bookingRef}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-ink">{b.guest?.name}</p>
                        <p className="text-xs text-ink-faint">{b.guest?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">{b.hotel?.name}</td>
                      <td className="px-5 py-3.5 text-ink-soft">{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</td>
                      <td className="px-5 py-3.5 font-medium">{formatCurrency(b.totalAmount, b.currency)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={meta.page} pages={meta.pages} onChange={load} />
        </div>
      </main>
    </>
  );
};

export default Bookings;
