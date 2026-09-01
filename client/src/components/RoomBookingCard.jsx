
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, BedDouble, CheckCircle2 } from "lucide-react";

import useAuth from "../hooks/useAuth";
import { checkRoomAvailability } from "../services/roomService";
import { createBooking } from "../services/bookingService";
import {
  formatPKR,
  nightsBetween,
  getErrorMessage,
} from "../utils/helpers";
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

  const totalPrice =
    nights > 0
      ? nights * room.pricePerNight * roomsBooked
      : room.pricePerNight * roomsBooked;

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Check-out must be after check-in.");
      return;
    }

    if (roomsBooked < 1) {
      toast.error("Please select at least one room.");
      return;
    }

    setIsChecking(true);

    try {
      const data = await checkRoomAvailability(room._id, {
        checkIn,
        checkOut,
        roomsRequested: roomsBooked,
      });

      setAvailability(data);

      if (!data.isAvailable) {
        toast.error(
          `Only ${data.roomsAvailable} room(s) available for these dates.`
        );
      } else {
        toast.success("Room available for your selected dates.");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      setAvailability(null);
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

    if (!checkIn || !checkOut) {
      toast.error("Please select your check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Check-out must be after check-in.");
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
        guests: {
          adults: room.capacity.adults,
          children: 0,
        },
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
    <div
      className="
        overflow-hidden
        rounded-[1.5rem]
        border
        border-[#E4E9DF]
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:border-[#D5E5C7]
        hover:shadow-md
      "
    >
      <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.15fr_1fr]">
        {/* ================= ROOM INFO ================= */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#7E8A76]">
                  Room
                </p>

                <h3 className="font-display text-xl font-bold text-ink">
                  {room.roomType}
                </h3>
              </div>

              <div className="text-right">
                <p className="font-display text-xl font-bold text-ink">
                  {formatPKR(room.pricePerNight)}
                </p>

                <p className="text-xs text-muted">per night</p>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              {room.description}
            </p>

            {/* Room Details */}
            <div className="mt-5 flex flex-wrap gap-3">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#F5F8F1]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-ink
                "
              >
                <Users size={15} className="text-[#6DAF24]" />
                {room.capacity.adults} Adults
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#F5F8F1]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-ink
                "
              >
                <BedDouble size={15} className="text-[#6DAF24]" />
                {room.bedType}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="mt-7 border-t border-[#E9EDE6] pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-muted">
                    {nights} night{nights !== 1 ? "s" : ""} × {roomsBooked}{" "}
                    room{roomsBooked !== 1 ? "s" : ""}
                  </p>

                  <p className="mt-1 text-sm font-medium text-ink">
                    Your estimated total
                  </p>
                </div>

                <p className="font-display text-xl font-bold text-ink">
                  {formatPKR(totalPrice)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= BOOKING PANEL ================= */}
        <div
          className="
            rounded-[1.25rem]
            bg-[#F6F9F3]
            p-4
            sm:p-5
          "
        >
          <div>
            <p className="font-display text-base font-semibold text-ink">
              Plan your stay
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Select your dates and number of rooms to check availability.
            </p>
          </div>

          {/* Dates */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`check-in-${room._id}`}
                className="text-xs font-semibold text-ink"
              >
                Check-in
              </label>

              <input
                id={`check-in-${room._id}`}
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setAvailability(null);
                }}
                className="
                  mt-1.5
                  w-full
                  rounded-xl
                  border
                  border-[#DDE5D7]
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-ink
                  outline-none
                  transition
                  focus:border-[#8FE13D]
                  focus:ring-2
                  focus:ring-[#8FE13D]/20
                "
              />
            </div>

            <div>
              <label
                htmlFor={`check-out-${room._id}`}
                className="text-xs font-semibold text-ink"
              >
                Check-out
              </label>

              <input
                id={`check-out-${room._id}`}
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setAvailability(null);
                }}
                className="
                  mt-1.5
                  w-full
                  rounded-xl
                  border
                  border-[#DDE5D7]
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-ink
                  outline-none
                  transition
                  focus:border-[#8FE13D]
                  focus:ring-2
                  focus:ring-[#8FE13D]/20
                "
              />
            </div>
          </div>

          {/* Number of Rooms */}
          <div className="mt-4">
            <label
              htmlFor={`rooms-${room._id}`}
              className="text-xs font-semibold text-ink"
            >
              Rooms
            </label>

            <input
              id={`rooms-${room._id}`}
              type="number"
              min={1}
              value={roomsBooked}
              onChange={(e) => {
                const value = Math.max(1, Number(e.target.value) || 1);
                setRoomsBooked(value);
                setAvailability(null);
              }}
              className="
                mt-1.5
                w-full
                rounded-xl
                border
                border-[#DDE5D7]
                bg-white
                px-3
                py-2.5
                text-sm
                text-ink
                outline-none
                transition
                focus:border-[#8FE13D]
                focus:ring-2
                focus:ring-[#8FE13D]/20
              "
            />
          </div>

          {/* Availability Status */}
          {availability && (
            <div
              className={`
                mt-4
                flex
                items-center
                gap-2
                rounded-xl
                px-3
                py-2.5
                text-xs
                font-semibold
                ${
                  availability.isAvailable
                    ? "bg-[#8FE13D]/15 text-[#568F18]"
                    : "bg-red-50 text-red-600"
                }
              `}
            >
              {availability.isAvailable && (
                <CheckCircle2 size={15} />
              )}

              <span>
                {availability.isAvailable
                  ? `✓ ${availability.roomsAvailable} room(s) available for your dates`
                  : "This room isn't available for the selected dates."}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={isChecking}
              className="
                flex-1
                rounded-xl
                border
                border-[#D6DFCF]
                bg-white
                px-4
                py-3
                text-sm
                font-semibold
                text-ink
                transition-all
                hover:border-[#8FE13D]
                hover:bg-[#FBFDF9]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isChecking ? "Checking..." : "Check availability"}
            </button>

            <button
              type="button"
              onClick={handleBook}
              disabled={isBooking || !availability?.isAvailable}
              className="
                flex-1
                rounded-xl
                bg-[#8FE13D]
                px-4
                py-3
                text-sm
                font-bold
                text-[#17210F]
                shadow-sm
                transition-all
                hover:bg-[#7FD02F]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {isBooking ? "Confirming..." : "Book Now"}
            </button>
          </div>

          {/* Small reassurance */}
          <p className="mt-4 text-center text-[11px] leading-5 text-muted">
            Check availability before booking to secure your selected room.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingCard;
