import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Building2, CalendarCheck, Clock, Wallet, ArrowUpRight } from "lucide-react";
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
    <>
      <Topbar title="Overview" subtitle="What's happening across Manzil.pk today" onMenuClick={openSidebar} />
      <main className="flex-1 px-5 py-6 md:px-8">
        {loading ? (
          <p className="text-sm text-ink-faint">Loading dashboard…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Active hotels" value={stats.activeHotels} icon={Building2} trend={`${stats.totalHotels} total listed`} accent />
              <StatCard label="Total bookings" value={stats.totalBookings} icon={CalendarCheck} trend={`${stats.pendingBookings} awaiting confirmation`} />
              <StatCard label="Pending bookings" value={stats.pendingBookings} icon={Clock} trend="Needs a decision" />
              <StatCard label="Confirmed revenue" value={formatCurrency(stats.totalRevenue)} icon={Wallet} trend="Confirmed & completed stays" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="card lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-base font-bold">Recent bookings</h2>
                  <Link to="/admin/bookings" className="flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink">
                    View all <ArrowUpRight size={14} />
                  </Link>
                </div>
                {stats.recentBookings.length === 0 ? (
                  <p className="py-6 text-center text-sm text-ink-faint">No bookings yet.</p>
                ) : (
                  <div className="divide-y divide-line">
                    {stats.recentBookings.map((b) => (
                      <div key={b._id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-semibold text-ink">{b.guest?.name}</p>
                          <p className="text-xs text-ink-faint">{b.hotel?.name} · {formatDate(b.checkIn)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{formatCurrency(b.totalAmount, b.currency)}</span>
                          <StatusBadge status={b.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <h2 className="mb-4 font-display text-base font-bold">Top rated hotels</h2>
                {stats.topHotels.length === 0 ? (
                  <p className="py-6 text-center text-sm text-ink-faint">No hotels yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topHotels.map((h) => (
                      <div key={h._id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-ink">{h.name}</p>
                          <p className="text-xs text-ink-faint">{h.location?.city}</p>
                        </div>
                        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-ink">
                          ★ {h.avgRating?.toFixed(1) || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Dashboard;
