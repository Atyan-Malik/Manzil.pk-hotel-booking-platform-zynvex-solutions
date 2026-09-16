
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  MapPin,
  Star,
  ArrowDownUp,
  RotateCcw,
  Building2,
} from "lucide-react";

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

    const params = {
      city,
      sort,
      minRating,
      limit: 24,
    };

    getHotels(params)
      .then((data) => {
        setHotels(data.hotels || []);
        setTotal(data.total || 0);
      })
      .catch(() => {
        setHotels([]);
        setTotal(0);
      })
      .finally(() => setIsLoading(false));
  }, [city, sort, minRating]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = Boolean(city || minRating || sort !== "newest");

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Header */}
      <section className="border-b border-line bg-white">
        <div className="container-page py-10 sm:py-12 lg:py-14">
          <div className="max-w-3xl">
           

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[42px]">
              {city ? (
                <>
                  Hotels in{" "}
                  <span className="text-accent-dark">{city}</span>
                </>
              ) : (
                <>
                  Find your next{" "}
                  <span className="text-accent-dark">stay</span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Explore comfortable stays across Pakistan and find a place
              that fits your trip, budget, and style.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b border-line bg-white">
        <div className="container-page py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="mr-1 flex items-center gap-2 text-sm font-bold text-ink">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
                  <SlidersHorizontal size={15} />
                </span>
                Filters
              </div>

              {/* City */}
              <FilterSelect
                icon={MapPin}
                value={city}
                onChange={(value) => updateParam("city", value)}
                ariaLabel="Filter by city"
              >
                <option value="">All Cities</option>

                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </FilterSelect>

              {/* Rating */}
              <FilterSelect
                icon={Star}
                value={minRating}
                onChange={(value) => updateParam("minRating", value)}
                ariaLabel="Filter by rating"
              >
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </FilterSelect>

              {/* Sort */}
              <FilterSelect
                icon={ArrowDownUp}
                value={sort}
                onChange={(value) => updateParam("sort", value)}
                ariaLabel="Sort hotels"
              >
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A-Z</option>
              </FilterSelect>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    inline-flex items-center gap-1.5
                    rounded-full
                    px-3 py-2
                    text-xs font-bold text-ink-soft
                    transition-colors
                    hover:bg-surface-muted
                    hover:text-ink
                  "
                >
                  <RotateCcw size={13} />
                  Clear
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-display font-extrabold text-ink">
                {isLoading ? "—" : total}
              </span>

              <span className="text-muted">
                {total === 1 ? "property" : "properties"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="container-page py-8 sm:py-10 lg:py-12">
        {isLoading ? (
          <HotelGridSkeleton />
        ) : hotels.length === 0 ? (
          <EmptyHotels clearFilters={clearFilters} hasFilters={hasFilters} />
        ) : (
          <>
            {/* Active filter summary */}
            {(city || minRating) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted">
                  Showing:
                </span>

                {city && (
                  <FilterPill
                    icon={MapPin}
                    label={city}
                    onRemove={() => updateParam("city", "")}
                  />
                )}

                {minRating && (
                  <FilterPill
                    icon={Star}
                    label={`${minRating}+ stars`}
                    onRemove={() => updateParam("minRating", "")}
                  />
                )}
              </div>
            )}

            {/* Hotels */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

/* ---------------------------------- */
/* Filter Select                      */
/* ---------------------------------- */

const FilterSelect = ({
  icon: Icon,
  value,
  onChange,
  children,
  ariaLabel,
}) => {
  return (
    <div className="relative">
      <Icon
        size={14}
        className="
          pointer-events-none
          absolute left-3.5 top-1/2
          -translate-y-1/2
          text-ink-soft
        "
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="
          h-10
          appearance-none
          rounded-full
          border border-line
          bg-white
          py-2 pl-9 pr-9
          text-xs font-semibold text-ink
          outline-none
          transition-all
          hover:border-ink/20
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
        "
      >
        {children}
      </select>

      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="
          pointer-events-none
          absolute right-3
          top-1/2
          h-3.5 w-3.5
          -translate-y-1/2
          text-ink-faint
        "
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

/* ---------------------------------- */
/* Filter Pill                        */
/* ---------------------------------- */

const FilterPill = ({ icon: Icon, label, onRemove }) => {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="
        inline-flex items-center gap-1.5
        rounded-full
        border border-primary/30
        bg-primary-light
        px-3 py-1.5
        text-xs font-bold text-ink
        transition-colors
        hover:border-primary
      "
    >
      <Icon size={12} />

      <span>{label}</span>

      <span className="ml-0.5 text-ink-soft">×</span>
    </button>
  );
};

/* ---------------------------------- */
/* Loading Skeleton                   */
/* ---------------------------------- */

const HotelGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-2xl
            border border-line
            bg-white
            shadow-sm
          "
        >
          <div className="aspect-[4/3] animate-pulse bg-surface-muted" />

          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-muted" />

            <div className="h-3 w-1/2 animate-pulse rounded-full bg-surface-muted" />

            <div className="h-3 w-2/3 animate-pulse rounded-full bg-surface-muted" />

            <div className="flex justify-between pt-2">
              <div className="h-5 w-20 animate-pulse rounded-full bg-surface-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-surface-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------------------------- */
/* Empty State                        */
/* ---------------------------------- */

const EmptyHotels = ({ clearFilters, hasFilters }) => {
  return (
    <div
      className="
        flex min-h-[420px]
        flex-col items-center justify-center
        rounded-2xl
        border border-dashed border-line
        bg-white
        px-6 py-14
        text-center
      "
    >
      <div
        className="
          flex h-16 w-16
          items-center justify-center
          rounded-2xl
          bg-primary-light
          text-ink
        "
      >
        <Building2 size={27} />
      </div>

      <h2 className="mt-5 font-display text-xl font-extrabold text-ink">
        No hotels found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        {hasFilters
          ? "We couldn't find any properties matching your current filters. Try changing your search criteria."
          : "There are no properties available right now. Please check again soon."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="
            mt-6
            inline-flex items-center gap-2
            rounded-xl
            bg-ink
            px-5 py-3
            text-sm font-bold text-white
            transition-all duration-200
            hover:-translate-y-0.5
            hover:bg-black
          "
        >
          <RotateCcw size={15} />
          Clear filters
        </button>
      )}
    </div>
  );
};

export default Hotels;
