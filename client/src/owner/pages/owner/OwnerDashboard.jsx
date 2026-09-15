import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Building2, CalendarCheck, Wallet, Clock3, Plus, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { getMyHotels } from "../../../services/hotelService";
import { getHotelBookings } from "../../../services/bookingService";
import useAuth from "../../../hooks/useAuth";

import StatCard from "../../components/owner/StatCard";
import StatusBadge from "../../components/owner/StatusBadge";
import Spinner from "../../components/owner/Spinner";
import ErrorState from "../../components/owner/ErrorState";
import EmptyState from "../../components/owner/EmptyState";

const REVENUE_STATUSES = ["confirmed", "completed"];

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [state, setState] = useState({ status: "loading", hotels: [], bookings: [] });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const { hotels } = await getMyHotels();

      // Bookings for each hotel the owner manages. Backend enforces ownership
      // per-hotel (bookingController.getHotelBookings), so this never leaks
      // another owner's data even if a call fails or is retried.
      const bookingResults = await Promise.all(
        hotels.map((hotel) =>
          getHotelBookings(hotel._id).catch(() => ({ bookings: [] }))
        )
      );
      const bookings = bookingResults.flatMap((r) => r.bookings || []);

      setState({ status: "ready", hotels, bookings });
    } catch (err) {
      setState((s) => ({ ...s, status: "error" }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "loading") return <Spinner label="Loading your dashboard..." />;
  if (state.status === "error") {
    return (
      <ErrorState
        message="We couldn't load your dashboard data. Please try again."
        onRetry={load}
      />
    );
  }

  const { hotels, bookings } = state;

  if (hotels.length === 0) {
    return (
      <div>
        <PageHeader user={user} />
        <div className="mt-6">
          <EmptyState
            icon={Building2}
            title="You haven't listed a hotel yet"
            description="Add your first property to start receiving bookings on Manzil.pk."
            action={
              <Link
                to="/owner/hotels/new"
                className="inline-flex items-center gap-2 rounded-xl bg-[#8FE13D] px-4 py-2.5 text-sm font-bold text-[#17210F] transition hover:bg-[#9BEA4E]"
              >
                <Plus size={16} />
                List a hotel
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const approvedHotels = hotels.filter((h) => h.status === "approved").length;
  const pendingHotels = hotels.filter((h) => h.status === "pending").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const totalRevenue = bookings
    .filter((b) => REVENUE_STATUSES.includes(b.status))
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div>
      <PageHeader user={user} />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Total Hotels"
          value={hotels.length}
          hint={`${approvedHotels} approved · ${pendingHotels} pending`}
        />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={bookings.length} />
        <StatCard
          icon={Wallet}
          label="Revenue"
          value={`PKR ${totalRevenue.toLocaleString()}`}
          hint="Confirmed & completed stays"
        />
        <StatCard icon={Clock3} label="Pending Bookings" value={pendingBookings} />
      </div>

      {/* Recent bookings */}
      <div className="mt-8 rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">Recent Bookings</h2>
          <Link
            to="/owner/bookings"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#5F9824] hover:gap-2"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No bookings yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-[#E9EFE4] text-left text-xs font-bold uppercase tracking-wide text-muted">
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Hotel</th>
                  <th className="pb-3 pr-4">Check-in</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id} className="border-b border-[#F1F5EC] last:border-0">
                    <td className="py-3 pr-4 font-semibold text-ink">
                      {b.guestName || b.customer?.name || "Guest"}
                    </td>
                    <td className="py-3 pr-4 text-muted">
                      {hotels.find((h) => h._id === b.hotel)?.name || "—"}
                    </td>
                    <td className="py-3 pr-4 text-muted">
                      {new Date(b.checkIn).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-ink">
                      PKR {b.totalPrice?.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hotels quick list */}
      <div className="mt-8 rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">Your Hotels</h2>
          <Link
            to="/owner/hotels"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#5F9824] hover:gap-2"
          >
            Manage
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.slice(0, 6).map((hotel) => (
            <Link
              key={hotel._id}
              to={`/owner/hotels/${hotel._id}`}
              className="rounded-2xl border border-[#E9EFE4] p-4 transition hover:border-[#CFE5B9] hover:bg-[#FBFDF9]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-sm font-bold text-ink">{hotel.name}</p>
                <StatusBadge status={hotel.status} />
              </div>
              <p className="mt-1 text-xs text-muted">{hotel.city}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageHeader = ({ user }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6FAE2F]">
      Owner Panel
    </p>
    <h1 className="mt-1 font-display text-2xl font-extrabold text-ink sm:text-3xl">
      Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
    </h1>
    <p className="mt-1 text-sm text-muted">Here's how your properties are performing.</p>
  </div>
);

export default OwnerDashboard;
