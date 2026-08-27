import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, BedDouble } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { checkRoomAvailability } from "../services/roomService";
import { createBooking } from "../services/bookingService";
import { formatPKR, nightsBetween, getErrorMessage } from "../utils/helpers";
import { ROLES } from "../utils/constants";

const RoomBookingCard = ({ room, searchDates }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(searchDates?.checkIn || "");
  const [checkOut, setCheckOut] = useState(searchDates?.checkOut || "");
  const [roomsBooked, setRoomsBooked] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const nights = nightsBetween(checkIn, checkOut);
  const totalPrice = nights * room.pricePerNight * roomsBooked;

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    setIsChecking(true);
    try {
      const data = await checkRoomAvailability(room._id, { checkIn, checkOut, roomsRequested: roomsBooked });
      setAvailability(data);
      if (!data.isAvailable) {
        toast.error(`Only ${data.roomsAvailable} room(s) available for these dates.`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsChecking(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== ROLES.CUSTOMER) {
      toast.error("Only customer accounts can book rooms.");
      return;
    }

    if (!availability?.isAvailable) {
      toast.error("Please check availability first.");
      return;
    }

    setIsBooking(true);
    try {
      await createBooking({
        room: room._id,
        checkIn,
        checkOut,
        roomsBooked,
        guests: { adults: room.capacity.adults, children: 0 },
      });
      toast.success("Booking confirmed!");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="card grid gap-6 p-5 sm:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-ink">{room.roomType}</h3>
          <p className="whitespace-nowrap font-display text-lg font-bold text-ink">
            {formatPKR(room.pricePerNight)}
            <span className="text-xs font-normal text-muted"> / night</span>
          </p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{room.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Users size={15} /> {room.capacity.adults} Adults
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={15} /> {room.bedType}
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-muted">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setAvailability(null);
              }}
              className="mt-1 w-full rounded-lg border border-slateline bg-white px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setAvailability(null);
              }}
              className="mt-1 w-full rounded-lg border border-slateline bg-white px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs font-semibold text-muted">Rooms</label>
          <input
            type="number"
            min={1}
            value={roomsBooked}
            onChange={(e) => {
              setRoomsBooked(Number(e.target.value));
              setAvailability(null);
            }}
            className="mt-1 w-full rounded-lg border border-slateline bg-white px-3 py-2 text-sm outline-none"
          />
        </div>

        {nights > 0 && (
          <p className="mt-3 text-sm text-muted">
            {nights} night(s) × {roomsBooked} room(s) ={" "}
            <span className="font-semibold text-ink">{formatPKR(totalPrice)}</span>
          </p>
        )}

        {availability && (
          <p className={`mt-2 text-xs font-semibold ${availability.isAvailable ? "text-accent-dark" : "text-red-600"}`}>
            {availability.isAvailable
              ? `${availability.roomsAvailable} room(s) available`
              : "Not available for these dates"}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleCheckAvailability}
            disabled={isChecking}
            className="btn-outline flex-1 py-2 text-sm"
          >
            {isChecking ? "Checking..." : "Check Availability"}
          </button>
          <button
            onClick={handleBook}
            disabled={isBooking || !availability?.isAvailable}
            className="btn-accent flex-1 py-2 text-sm disabled:opacity-50"
          >
            {isBooking ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingCard;
