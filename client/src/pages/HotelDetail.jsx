import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import { getHotel } from "../services/hotelService";
import { getHotelReviews } from "../services/reviewService";
import RoomBookingCard from "../components/RoomBookingCard";
import ReviewList from "../components/ReviewList";

const HotelDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchDates = {
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getHotel(id), getHotelReviews(id)])
      .then(([hotelData, reviewData]) => {
        setHotel(hotelData.hotel);
        setRooms(hotelData.rooms);
        setReviews(reviewData.reviews);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!hotel) return null;

  const images = hotel.images?.length ? hotel.images : [{ url: "https://placehold.co/1200x600?text=SafarStay" }];

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{hotel.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <MapPin size={15} /> {hotel.address}, {hotel.city}
            </span>
            {hotel.avgRating > 0 && (
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Star size={15} className="fill-accent-dark text-accent-dark" />
                {hotel.avgRating.toFixed(1)} ({hotel.totalReviews} reviews)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3 overflow-hidden rounded-xl2">
        <img src={images[0].url} alt={hotel.name} className="col-span-4 h-96 w-full object-cover sm:col-span-2 sm:row-span-2" />
        {images.slice(1, 5).map((image, index) => (
          <img key={index} src={image.url} alt="" className="hidden h-[11.5rem] w-full object-cover sm:block" />
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">About this property</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{hotel.description}</p>
          </section>

          {hotel.amenities?.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-bold text-ink">Amenities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {hotel.amenities.map((amenity) => (
                  <span key={amenity._id} className="rounded-full bg-surface px-4 py-2 text-sm text-ink">
                    {amenity.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-ink">Rooms</h2>
            <div className="mt-4 space-y-4">
              {rooms.length === 0 ? (
                <p className="text-sm text-muted">No rooms available right now.</p>
              ) : (
                rooms.map((room) => <RoomBookingCard key={room._id} room={room} searchDates={searchDates} />)
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-ink">Guest Reviews</h2>
            <div className="mt-4">
              <ReviewList reviews={reviews} />
            </div>
          </section>
        </div>

        <aside className="card h-fit p-5">
          <h3 className="font-display text-base font-semibold text-ink">Hotel Policies</h3>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p className="flex items-center gap-2">
              <Clock size={15} /> Check-in: {hotel.policies?.checkInTime}
            </p>
            <p className="flex items-center gap-2">
              <Clock size={15} /> Check-out: {hotel.policies?.checkOutTime}
            </p>
            <p className="pt-2">{hotel.policies?.cancellationPolicy}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HotelDetail;
