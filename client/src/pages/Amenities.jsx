
import { useEffect, useState } from "react";
import {
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Utensils,
  Wind,
  Tv,
  Coffee,
  ShieldCheck,
  Sparkles,
  Bath,
  Bell,
} from "lucide-react";

import { getAmenities } from "../services/amenities";

// Backend icon value → Lucide icon
const iconMap = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  swimming: Waves,
  fitness: Dumbbell,
  gym: Dumbbell,
  restaurant: Utensils,
  ac: Wind,
  "air-conditioning": Wind,
  tv: Tv,
  "smart-tv": Tv,
  breakfast: Coffee,
  security: ShieldCheck,
  "24/7-security": ShieldCheck,
  housekeeping: Sparkles,
  "daily-housekeeping": Sparkles,
  bathroom: Bath,
  "private-bathroom": Bath,
  "room-service": Bell,
};

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);

        const data = await getAmenities();

        setAmenities(data?.amenities || data || []);
      } catch (err) {
        console.error("Failed to fetch amenities:", err);
        setError("Unable to load amenities.");
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  if (loading) {
    return (
      <section className="mt-12">
        <div className="mb-7">
          <div className="h-4 w-32 animate-pulse rounded bg-[#E8F6D9]" />
          <div className="mt-3 h-8 w-52 animate-pulse rounded bg-[#F8FAF5]" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-2xl bg-[#F8FAF5]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12">
        <p className="text-sm text-red-500">{error}</p>
      </section>
    );
  }

  if (!amenities.length) {
    return (
      <section className="mt-12">
        <p className="text-sm font-semibold text-accent-dark">
          Everything you need
        </p>

        <h2 className="mt-1 font-display text-2xl font-bold text-ink">
          Hotel amenities
        </h2>

        <p className="mt-4 text-sm text-muted">
          No amenities have been added for this property yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12">
      {/* Heading */}
      <div className="mb-7">
        <p className="text-sm font-semibold text-accent-dark">
          Everything you need
        </p>

        <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
          Hotel amenities
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Enjoy thoughtful facilities and services designed to make your stay
          comfortable and convenient.
        </p>
      </div>

      {/* Amenities */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {amenities.map((amenity) => {
          const Icon = iconMap[amenity.icon] || Sparkles;

          return (
            <div
              key={amenity._id}
              className="
                group
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-[#E3E8DE]
                bg-[#F8FAF5]
                px-4
                py-4
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#CFE6B5]
                hover:bg-white
                hover:shadow-md
              "
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#E8F6D9]
                  transition-all
                  duration-300
                  group-hover:bg-[#8FE13D]
                "
              >
                <Icon
                  size={18}
                  strokeWidth={2}
                  className="text-[#6DAF24]"
                />
              </div>

              {/* Name */}
              <span className="text-sm font-medium text-ink">
                {amenity.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Amenities;
