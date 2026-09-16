
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  Building2,
  CalendarCheck,
  Clock3,
  Wallet,
  ArrowUpRight,
  ChevronRight,
  Star,
} from "lucide-react";

import Topbar from "../layout/Topbar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

import { getDashboardStats } from "../services/adminDashboardService";
import { formatCurrency, formatDate } from "../utils/format";

const Dashboard = () => {
  const { openSidebar } = useOutletContext();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-full bg-surface-muted">
      <Topbar
        title="Overview"
        subtitle="What's happening across Manzil.pk today"
        onMenuClick={openSidebar}
      />

      <main className="px-4 py-5 sm:px-5 sm:py-6 md:px-8 md:py-7">
        {/* -------------------------------------------------
            LOADING
        ------------------------------------------------- */}
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* -------------------------------------------------
                STAT CARDS
            ------------------------------------------------- */}
            <section>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Active hotels"
                  value={stats?.activeHotels ?? 0}
                  icon={Building2}
                  trend={`${stats?.totalHotels ?? 0} total listed`}
                  accent
                />

                <StatCard
                  label="Total bookings"
                  value={stats?.totalBookings ?? 0}
                  icon={CalendarCheck}
                  trend={`${stats?.pendingBookings ?? 0} awaiting confirmation`}
                />

                <StatCard
                  label="Pending bookings"
                  value={stats?.pendingBookings ?? 0}
                  icon={Clock3}
                  trend="Needs a decision"
                />

                <StatCard
                  label="Confirmed revenue"
                  value={formatCurrency(stats?.totalRevenue ?? 0)}
                  icon={Wallet}
                  trend="Confirmed & completed stays"
                />
              </div>
            </section>

            {/* -------------------------------------------------
                MAIN CONTENT
            ------------------------------------------------- */}
            <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
              {/* Recent bookings */}
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="font-display text-base font-bold text-ink">
                      Recent bookings
                    </h2>

                    <p className="mt-1 text-xs text-ink-faint">
                      Latest reservation activity
                    </p>
                  </div>

                  <Link
                    to="/admin/bookings"
                    className="
                      inline-flex items-center gap-1.5
                      rounded-lg px-2.5 py-2
                      text-xs font-semibold text-ink-soft
                      transition
                      hover:bg-surface-muted
                      hover:text-ink
                    "
                  >
                    View all
                    <ArrowUpRight size={14} />
                  </Link>
                </div>

                {/* Content */}
                {stats?.recentBookings?.length === 0 ? (
                  <EmptyState
                    icon={CalendarCheck}
                    title="No bookings yet"
                    description="New reservations will appear here."
                  />
                ) : (
                  <div className="divide-y divide-line">
                    {stats?.recentBookings?.map((booking) => (
                      <div
                        key={booking._id}
                        className="
                          flex flex-col gap-3 px-5 py-4
                          transition-colors
                          hover:bg-surface-muted/60
                          sm:flex-row sm:items-center sm:justify-between
                          sm:px-6
                        "
                      >
                        {/* Guest / hotel */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-ink">
                              {getInitials(booking.guest?.name)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-ink">
                                {booking.guest?.name || "Guest"}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-ink-faint">
                                {booking.hotel?.name || "Hotel"}{" "}
                                <span className="px-1">·</span>
                                {formatDate(booking.checkIn)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Amount / status */}
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <span className="text-sm font-bold text-ink">
                            {formatCurrency(
                              booking.totalAmount,
                              booking.currency
                            )}
                          </span>

                          <StatusBadge status={booking.status} />

                          <ChevronRight
                            size={15}
                            className="hidden text-ink-faint sm:block"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top rated hotels */}
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-line px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-ink">
                      <Star size={17} fill="currentColor" />
                    </div>

                    <div>
                      <h2 className="font-display text-base font-bold text-ink">
                        Top rated hotels
                      </h2>

                      <p className="mt-1 text-xs text-ink-faint">
                        Highest guest ratings
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hotels */}
                {stats?.topHotels?.length === 0 ? (
                  <EmptyState
                    icon={Building2}
                    title="No hotels yet"
                    description="Add hotels to see ratings here."
                  />
                ) : (
                  <div className="divide-y divide-line">
                    {stats?.topHotels?.map((hotel, index) => (
                      <div
                        key={hotel._id}
                        className="
                          flex items-center justify-between
                          gap-3 px-5 py-4
                          transition-colors
                          hover:bg-surface-muted/60
                          sm:px-6
                        "
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {/* Rank */}
                          <div
                            className={`
                              flex h-8 w-8 shrink-0 items-center
                              justify-center rounded-lg text-xs font-bold
                              ${
                                index === 0
                                  ? "bg-primary text-ink"
                                  : "bg-surface-muted text-ink-faint"
                              }
                            `}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          {/* Hotel info */}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                              {hotel.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-ink-faint">
                              {hotel.location?.city || "Location unavailable"}
                            </p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1.5">
                          <Star
                            size={12}
                            fill="currentColor"
                            className="text-ink"
                          />

                          <span className="text-xs font-bold text-ink">
                            {hotel.avgRating
                              ? hotel.avgRating.toFixed(1)
                              : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-ink-faint">
        <Icon size={19} />
      </div>

      <p className="mt-3 text-sm font-semibold text-ink">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-ink-faint">
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   LOADING SKELETON
========================================================= */

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[126px] rounded-2xl border border-line bg-white"
          />
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="h-[390px] rounded-2xl border border-line bg-white" />

        <div className="h-[390px] rounded-2xl border border-line bg-white" />
      </div>
    </div>
  );
};

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name) => {
  if (!name) return "G";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

export default Dashboard;