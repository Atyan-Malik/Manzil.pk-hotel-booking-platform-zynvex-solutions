import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Building2, Star } from "lucide-react";
import toast from "react-hot-toast";

import { getMyHotels, deleteHotel } from "../../../services/hotelService";

import Spinner from "../../components/owner/Spinner";
import ErrorState from "../../components/owner/ErrorState";
import EmptyState from "../../components/owner/EmptyState";
import StatusBadge from "../../components/owner/StatusBadge";

const OwnerHotels = () => {
  const [status, setStatus] = useState("loading");
  const [hotels, setHotels] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getMyHotels();
      setHotels(data.hotels);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (hotel) => {
    if (!window.confirm(`Delete "${hotel.name}"? This also removes its rooms. This cannot be undone.`)) {
      return;
    }
    setDeletingId(hotel._id);
    try {
      await deleteHotel(hotel._id);
      setHotels((prev) => prev.filter((h) => h._id !== hotel._id));
      toast.success("Hotel deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete hotel.");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") return <Spinner label="Loading your hotels..." />;
  if (status === "error") return <ErrorState onRetry={load} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">My Hotels</h1>
          <p className="mt-1 text-sm text-muted">Manage the properties you own on Manzil.pk.</p>
        </div>
        <Link
          to="/owner/hotels/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#8FE13D] px-4 py-2.5 text-sm font-bold text-[#17210F] transition hover:bg-[#9BEA4E]"
        >
          <Plus size={16} />
          Add Hotel
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Building2}
            title="No hotels yet"
            description="List your first property to start receiving bookings."
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
      ) : (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#E2E8DE] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#E9EFE4] bg-[#FBFDF9] text-left text-xs font-bold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Hotel</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="border-b border-[#F1F5EC] last:border-0">
                    <td className="px-5 py-4">
                      <Link
                        to={`/owner/hotels/${hotel._id}`}
                        className="font-display font-bold text-ink hover:text-[#5F9824]"
                      >
                        {hotel.name}
                      </Link>
                      {hotel.status === "rejected" && hotel.rejectionReason && (
                        <p className="mt-0.5 text-xs text-red-500">{hotel.rejectionReason}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted">{hotel.city}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={hotel.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-ink">
                        <Star size={14} className="fill-[#8FE13D] text-[#8FE13D]" />
                        {hotel.avgRating?.toFixed(1) || "—"}
                        <span className="text-xs text-muted">({hotel.totalReviews})</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/owner/hotels/${hotel._id}/edit`}
                          className="rounded-lg p-2 text-muted hover:bg-[#F1F6EC] hover:text-ink"
                          aria-label="Edit hotel"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(hotel)}
                          disabled={deletingId === hotel._id}
                          className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label="Delete hotel"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default OwnerHotels;
