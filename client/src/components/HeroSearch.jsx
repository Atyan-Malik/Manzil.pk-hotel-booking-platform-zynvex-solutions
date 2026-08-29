
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, CalendarDays } from "lucide-react";
import { PAKISTAN_CITIES } from "../utils/constants";

const HeroSearch = () => {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="
        w-full
        max-w-4xl
        rounded-2xl
        bg-white
        p-3
        shadow-soft

        sm:rounded-3xl
        sm:p-4

        lg:flex
        lg:items-center
        lg:gap-1
        lg:rounded-full
        lg:p-2
      "
    >
      {/* Destination */}
      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-3
          rounded-xl
          border
          border-slateline
          bg-slate-50
          px-4
          py-3

          sm:py-3.5

          lg:border-0
          lg:bg-transparent
          lg:px-4
          lg:py-2
        "
      >
        <MapPin
          size={19}
          strokeWidth={2}
          className="shrink-0 text-muted"
        />

        <div className="min-w-0 flex-1">
          <label
            htmlFor="destination"
            className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-muted lg:hidden"
          >
            Destination
          </label>

          <select
            id="destination"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="
              w-full
              cursor-pointer
              bg-transparent
              text-sm
              font-medium
              text-ink
              outline-none
            "
          >
            <option value="">Where are you going?</option>

            {PAKISTAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Divider */}
      <div className="my-2 h-px w-full bg-slateline lg:mx-1 lg:my-0 lg:h-7 lg:w-px" />

      {/* Check-in */}
      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-3
          rounded-xl
          border
          border-slateline
          bg-slate-50
          px-4
          py-3

          sm:py-3.5

          lg:border-0
          lg:bg-transparent
          lg:px-4
          lg:py-2
        "
      >
        <CalendarDays
          size={19}
          strokeWidth={2}
          className="shrink-0 text-muted"
        />

        <div className="min-w-0 flex-1">
          <label
            htmlFor="check-in"
            className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-muted lg:hidden"
          >
            Check-in
          </label>

          <input
            id="check-in"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);

              if (checkOut && e.target.value > checkOut) {
                setCheckOut("");
              }
            }}
            className="
              w-full
              min-w-0
              cursor-pointer
              bg-transparent
              text-sm
              font-medium
              text-ink
              outline-none
            "
          />
        </div>
      </div>

      {/* Divider */}
      <div className="my-2 h-px w-full bg-slateline lg:mx-1 lg:my-0 lg:h-7 lg:w-px" />

      {/* Check-out */}
      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-3
          rounded-xl
          border
          border-slateline
          bg-slate-50
          px-4
          py-3

          sm:py-3.5

          lg:border-0
          lg:bg-transparent
          lg:px-4
          lg:py-2
        "
      >
        <CalendarDays
          size={19}
          strokeWidth={2}
          className="shrink-0 text-muted"
        />

        <div className="min-w-0 flex-1">
          <label
            htmlFor="check-out"
            className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-muted lg:hidden"
          >
            Check-out
          </label>

          <input
            id="check-out"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="
              w-full
              min-w-0
              cursor-pointer
              bg-transparent
              text-sm
              font-medium
              text-ink
              outline-none
            "
          />
        </div>
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="
          mt-2
          flex
          w-full
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-xl
          btn-accent
          px-5
          py-3.5
          text-sm
          font-semibold
          transition
          hover:opacity-90
          active:scale-[0.98]

          sm:mt-3
          sm:py-4

          lg:mt-0
          lg:w-auto
          lg:rounded-full
          lg:px-6
          lg:py-3
        "
      >
        <Search size={18} strokeWidth={2.2} />

        <span>Search</span>
      </button>
    </form>
  );
};

export default HeroSearch;
