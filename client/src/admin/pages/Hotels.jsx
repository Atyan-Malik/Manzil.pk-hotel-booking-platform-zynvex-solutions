import { useEffect, useState, useCallback } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { Plus, Search, Star, MapPin, MoreVertical, Pencil, Trash2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../layout/Topbar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { getHotels, deleteHotel, updateHotelStatus } from "../services/adminHotelService";
import { formatCurrency } from "../utils/format";

const STATUS_FILTERS = ["all", "active", "draft", "inactive"];

const Hotels = () => {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback((page = 1) => {
    setLoading(true);
    getHotels({ search: search || undefined, status: status === "all" ? undefined : status, page })
      .then((data) => {
        setHotels(data.hotels);
        setMeta({ page: data.page, pages: data.pages, total: data.total });
      })
      .finally(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(() => load(1), 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteHotel(toDelete._id);
      toast.success(`${toDelete.name} was deleted`);
      setToDelete(null);
      load(meta.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete this hotel");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (hotel, next) => {
    try {
      await updateHotelStatus(hotel._id, next);
      toast.success(`${hotel.name} is now ${next}`);
      load(meta.page);
    } catch {
      toast.error("Could not update status");
    }
    setOpenMenu(null);
  };

  return (
    <>
      <Topbar
        title="Hotels"
        subtitle={`${meta.total} properties listed`}
        onMenuClick={openSidebar}
        actions={
          <button className="btn-primary" onClick={() => navigate("/admin/hotels/new")}>
            <Plus size={16} /> Add hotel
          </button>
        }
      />
      <main className="flex-1 px-5 py-6 md:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              className="field-input pl-9"
              placeholder="Search hotels or cities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition ${
                  status === s ? "bg-ink text-white" : "bg-white text-ink-soft border border-line hover:border-ink/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden !p-0">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-ink-faint">Loading hotels…</p>
          ) : hotels.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Building2}
                title="No hotels found"
                description="Add your first property or adjust your search filters."
                action={
                  <button className="btn-primary" onClick={() => navigate("/admin/hotels/new")}>
                    <Plus size={16} /> Add hotel
                  </button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-5 py-3 font-semibold">Property</th>
                    <th className="px-5 py-3 font-semibold">City</th>
                    <th className="px-5 py-3 font-semibold">Price / night</th>
                    <th className="px-5 py-3 font-semibold">Rating</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {hotels.map((hotel) => {
                    const cover = hotel.images?.find((i) => i.isCover) || hotel.images?.[0];
                    return (
                      <tr key={hotel._id} className="hover:bg-surface-muted/60">
                        <td className="px-5 py-3.5">
                          <Link to={`/admin/hotels/${hotel._id}`} className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                              {cover ? (
                                <img src={cover.url} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-ink-faint">
                                  <Building2 size={16} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-ink">{hotel.name}</p>
                              <p className="flex items-center gap-1 text-xs text-ink-faint">
                                <MapPin size={11} /> {hotel.location?.area || hotel.location?.city}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-ink-soft">{hotel.location?.city}</td>
                        <td className="px-5 py-3.5 font-medium">{formatCurrency(hotel.basePrice, hotel.currency)}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Star size={13} className="fill-primary text-primary" /> {hotel.avgRating?.toFixed(1) || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={hotel.status} />
                        </td>
                        <td className="relative px-5 py-3.5 text-right">
                          <button
                            className="rounded-lg p-1.5 text-ink-faint hover:bg-surface-muted hover:text-ink"
                            onClick={() => setOpenMenu(openMenu === hotel._id ? null : hotel._id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenu === hotel._id && (
                            <div className="absolute right-5 top-11 z-10 w-44 rounded-xl border border-line bg-white py-1.5 shadow-soft text-left">
                              <button
                                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm hover:bg-surface-muted"
                                onClick={() => navigate(`/admin/hotels/${hotel._id}`)}
                              >
                                <Pencil size={14} /> Edit hotel
                              </button>
                              {hotel.status !== "active" && (
                                <button
                                  className="flex w-full items-center gap-2 px-3.5 py-2 text-sm hover:bg-surface-muted"
                                  onClick={() => handleStatusChange(hotel, "active")}
                                >
                                  <Star size={14} /> Publish (active)
                                </button>
                              )}
                              {hotel.status === "active" && (
                                <button
                                  className="flex w-full items-center gap-2 px-3.5 py-2 text-sm hover:bg-surface-muted"
                                  onClick={() => handleStatusChange(hotel, "inactive")}
                                >
                                  <Star size={14} /> Mark inactive
                                </button>
                              )}
                              <button
                                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-danger hover:bg-danger/5"
                                onClick={() => { setToDelete(hotel); setOpenMenu(null); }}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={meta.page} pages={meta.pages} onChange={load} />
        </div>
      </main>

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete ${toDelete?.name}?`}
        description="This can't be undone. Hotels with active bookings can't be deleted — set them to inactive instead."
        confirmLabel="Delete hotel"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
};

export default Hotels;
