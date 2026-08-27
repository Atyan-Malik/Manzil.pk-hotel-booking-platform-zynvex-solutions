import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import HotelCard from "../components/HotelCards";
import { getHotels } from "../services/hotelService";
import { PAKISTAN_CITIES } from "../utils/constants";

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const city = searchParams.get("city") || "";
  const sort = searchParams.get("sort") || "newest";
  const minRating = searchParams.get("minRating") || "";

  useEffect(() => {
    setIsLoading(true);
    const params = { city, sort, minRating, limit: 24 };
    getHotels(params)
      .then((data) => {
        setHotels(data.hotels);
        setTotal(data.total);
      })
      .catch(() => setHotels([]))
      .finally(() => setIsLoading(false));
  }, [city, sort, minRating]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-ink">
        {city ? `Hotels in ${city}` : "All Hotels"}
      </h1>
      <p className="mt-1 text-sm text-muted">{total} properties found</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted">
          <SlidersHorizontal size={16} /> Filters
        </div>

        <select
          value={city}
          onChange={(e) => updateParam("city", e.target.value)}
          className="rounded-full border border-slateline bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="">All Cities</option>
          {PAKISTAN_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={minRating}
          onChange={(e) => updateParam("minRating", e.target.value)}
          className="rounded-full border border-slateline bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="">Any Rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>

        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-full border border-slateline bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      ) : hotels.length === 0 ? (
        <div className="mt-16 rounded-xl2 border border-dashed border-slateline p-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">No hotels match these filters</p>
          <p className="mt-1 text-sm text-muted">Try a different city or clear your filters.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotels;
