import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2, BedDouble, Star, CalendarCheck, Wallet } from "lucide-react";
import toast from "react-hot-toast";

import { getHotel } from "../../../services/hotelService";
import { getRoomsByHotel, createRoom, updateRoom, deleteRoom } from "../../../services/roomService";
import { getHotelBookings } from "../../../services/bookingService";

import Spinner from "../../components/owner/Spinner";
import ErrorState from "../../components/owner/ErrorState";
import EmptyState from "../../components/owner/EmptyState";
import StatusBadge from "../../components/owner/StatusBadge";
import StatCard from "../../components/owner/StatCard";

const emptyRoom = {
  roomType: "",
  pricePerNight: "",
  totalRooms: "",
  bedType: "Double",
  capacity: { adults: 2, children: 0 },
  description: "",
};

const REVENUE_STATUSES = ["confirmed", "completed"];

const OwnerHotelDetail = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("loading");
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [savingRoom, setSavingRoom] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [hotelData, roomsData, bookingsData] = await Promise.all([
        getHotel(id),
        getRoomsByHotel(id),
        getHotelBookings(id).catch(() => ({ bookings: [] })),
      ]);
      setHotel(hotelData.hotel);
      setRooms(roomsData.rooms || []);
      setBookings(bookingsData.bookings || []);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const openNewRoom = () => {
    setEditingRoom(null);
    setRoomForm(emptyRoom);
    setShowRoomForm(true);
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      totalRooms: room.totalRooms,
      bedType: room.bedType,
      capacity: room.capacity,
      description: room.description || "",
    });
    setShowRoomForm(true);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!roomForm.roomType || !roomForm.pricePerNight || !roomForm.totalRooms) {
      toast.error("Room type, price, and total rooms are required.");
      return;
    }

    setSavingRoom(true);
    try {
      if (editingRoom) {
        await updateRoom(editingRoom._id, roomForm);
        toast.success("Room updated.");
      } else {
        await createRoom({ ...roomForm, hotel: id });
        toast.success("Room added.");
      }
      setShowRoomForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save room.");
    } finally {
      setSavingRoom(false);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Delete room type "${room.roomType}"?`)) return;
    try {
      await deleteRoom(room._id);
      setRooms((prev) => prev.filter((r) => r._id !== room._id));
      toast.success("Room deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete room.");
    }
  };

  if (status === "loading") return <Spinner label="Loading hotel..." />;
  if (status === "error") return <ErrorState message="Could not load this hotel." onRetry={load} />;

  const revenue = bookings
    .filter((b) => REVENUE_STATUSES.includes(b.status))
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div>
      <Link
        to="/owner/hotels"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft size={15} />
        Back to My Hotels
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold text-ink">{hotel.name}</h1>
            <StatusBadge status={hotel.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {hotel.address}, {hotel.city}
          </p>
        </div>
        <Link
          to={`/owner/hotels/${id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8DE] px-4 py-2.5 text-sm font-bold text-ink hover:bg-[#F1F6EC]"
        >
          <Pencil size={15} />
          Edit Details
        </Link>
      </div>

      {hotel.status === "rejected" && hotel.rejectionReason && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Rejected:</strong> {hotel.rejectionReason}
        </div>
      )}

      {/* Performance */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarCheck} label="Bookings" value={bookings.length} />
        <StatCard icon={Wallet} label="Revenue" value={`PKR ${revenue.toLocaleString()}`} />
        <StatCard
          icon={Star}
          label="Rating"
          value={hotel.avgRating?.toFixed(1) || "—"}
          hint={`${hotel.totalReviews} review${hotel.totalReviews === 1 ? "" : "s"}`}
        />
      </div>

      {/* Rooms */}
      <div className="mt-8 rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">Rooms</h2>
          <button
            onClick={openNewRoom}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8FE13D] px-3.5 py-2 text-xs font-bold text-[#17210F] hover:bg-[#9BEA4E]"
          >
            <Plus size={14} />
            Add Room
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={BedDouble} title="No rooms added yet" description="Add a room type so guests can book this hotel." />
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {rooms.map((room) => (
              <div key={room._id} className="rounded-2xl border border-[#E9EFE4] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{room.roomType}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {room.bedType} · Up to {room.capacity?.adults} adults
                      {room.capacity?.children ? `, ${room.capacity.children} children` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditRoom(room)}
                      className="rounded-lg p-1.5 text-muted hover:bg-[#F1F6EC] hover:text-ink"
                      aria-label="Edit room"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room)}
                      className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete room"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-bold text-ink">
                    PKR {room.pricePerNight?.toLocaleString()}
                    <span className="font-normal text-muted"> / night</span>
                  </span>
                  <span className="text-xs text-muted">{room.totalRooms} rooms total</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room form modal */}
      {showRoomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <form
            onSubmit={handleRoomSubmit}
            className="w-full max-w-md rounded-[1.5rem] bg-white p-5 sm:p-6"
          >
            <h3 className="font-display text-lg font-bold text-ink">
              {editingRoom ? "Edit Room" : "Add Room"}
            </h3>

            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-[#E2E8DE] px-3.5 py-2.5 text-sm outline-none focus:border-[#8FE13D]"
                placeholder="Room type (e.g. Deluxe Double)"
                value={roomForm.roomType}
                onChange={(e) => setRoomForm((f) => ({ ...f, roomType: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-[#E2E8DE] px-3.5 py-2.5 text-sm outline-none focus:border-[#8FE13D]"
                  placeholder="Price / night (PKR)"
                  value={roomForm.pricePerNight}
                  onChange={(e) => setRoomForm((f) => ({ ...f, pricePerNight: Number(e.target.value) }))}
                />
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-[#E2E8DE] px-3.5 py-2.5 text-sm outline-none focus:border-[#8FE13D]"
                  placeholder="Total rooms"
                  value={roomForm.totalRooms}
                  onChange={(e) => setRoomForm((f) => ({ ...f, totalRooms: Number(e.target.value) }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-[#E2E8DE] px-3.5 py-2.5 text-sm outline-none focus:border-[#8FE13D]"
                  placeholder="Adults capacity"
                  value={roomForm.capacity.adults}
                  onChange={(e) =>
                    setRoomForm((f) => ({ ...f, capacity: { ...f.capacity, adults: Number(e.target.value) } }))
                  }
                />
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-[#E2E8DE] px-3.5 py-2.5 text-sm outline-none focus:border-[#8FE13D]"
                  placeholder="Children capacity"
                  value={roomForm.capacity.children}
                  onChange={(e) =>
                    setRoomForm((f) => ({ ...f, capacity: { ...f.capacity, children: Number(e.target.value) } }))
                  }
                />
              </div>
              <input
                className="w-full rounded-xl border border-[#E2E8DE] px-3.5 py-2.5 text-sm outline-none focus:border-[#8FE13D]"
                placeholder="Bed type (e.g. Double, Twin)"
                value={roomForm.bedType}
                onChange={(e) => setRoomForm((f) => ({ ...f, bedType: e.target.value }))}
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRoomForm(false)}
                className="rounded-xl border border-[#E2E8DE] px-4 py-2.5 text-sm font-bold text-ink hover:bg-[#F1F6EC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingRoom}
                className="rounded-xl bg-[#8FE13D] px-4 py-2.5 text-sm font-bold text-[#17210F] hover:bg-[#9BEA4E] disabled:opacity-60"
              >
                {savingRoom ? "Saving..." : "Save Room"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OwnerHotelDetail;
