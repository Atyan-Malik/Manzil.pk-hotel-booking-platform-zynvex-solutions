import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { formatPKR } from "../utils/helpers";

const HotelCard = ({ hotel }) => {
  const coverImage = hotel.images?.[0]?.url || "https://placehold.co/600x400?text=SafarStay";
  const startingPrice = hotel.startingPrice;

  return (
    <Link to={`/hotels/${hotel._id}`} className="group block">
      <div className="card overflow-hidden transition-shadow group-hover:shadow-soft">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={coverImage}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {startingPrice && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-soft">
              From {formatPKR(startingPrice)}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug text-ink">{hotel.name}</h3>
            {hotel.avgRating > 0 && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-1 text-xs font-semibold text-accent-dark">
                <Star size={12} className="fill-accent-dark text-accent-dark" />
                {hotel.avgRating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} />
            {hotel.city}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
