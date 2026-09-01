import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Wifi,
  ChevronRight,
} from "lucide-react";

import { getHotel } from "../services/hotelService";
import { getHotelReviews } from "../services/reviewService";
import { getRoomsByHotel } from "../services/roomService";

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
console.log("HOTEL DETAIL ID:", id);
  Promise.all([
    getHotel(id),
    getRoomsByHotel(id),
    getHotelReviews(id),
  ])
    .then(([hotelData, roomData, reviewData]) => {
      console.log("Hotel:", hotelData);
      console.log("Rooms:", roomData);
      console.log("Reviews:", reviewData);

      setHotel(hotelData.hotel);
      setRooms(roomData.rooms || []);
      setReviews(reviewData.reviews || []);
    })
    .catch((error) => {
      console.error("Hotel detail error:", error);
      setHotel(null);
      setRooms([]);
      setReviews([]);
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

  if (!hotel) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          Hotel not found
        </h1>

        <p className="mt-2 text-sm text-muted">
          This property may no longer be available.
        </p>
      </div>
    );
  }

  const images = hotel.images?.length
    ? hotel.images
    : [
        {
          url: "https://placehold.co/1200x700?text=Manzil.pk",
        },
      ];

  return (
    <div className="overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <section className="container-page pt-8 sm:pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted">
              <span>Hotels</span>
              <ChevronRight size={14} />
              <span>{hotel.city}</span>
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {hotel.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {hotel.address}, {hotel.city}
              </span>

              {hotel.avgRating > 0 && (
                <span className="flex items-center gap-1.5 font-semibold text-ink">
                  <Star
                    size={16}
                    className="fill-accent-dark text-accent-dark"
                  />

                  {hotel.avgRating.toFixed(1)}

                  <span className="font-normal text-muted">
                    ({hotel.totalReviews} reviews)
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Verified badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DDE8D2] bg-[#F6F8F2] px-4 py-2 text-xs font-semibold text-accent-dark">
            <ShieldCheck size={16} />
            Verified property
          </div>
        </div>
      </section>

      {/* ================= IMAGE GALLERY ================= */}
      <section className="container-page mt-6">
        <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-[1.5rem] sm:grid-cols-4 sm:gap-3">
          <img
            src={images[0].url}
            alt={hotel.name}
            className="col-span-2 row-span-2 h-[300px] w-full object-cover sm:h-[430px]"
          />

          {images.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`${hotel.name} ${index + 2}`}
              className="h-[145px] w-full object-cover sm:h-[208px]"
            />
          ))}
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="container-page mt-12 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.55fr_0.75fr] lg:gap-14">
          {/* LEFT */}
          <div>
            {/* ABOUT */}
            <section>
              <p className="text-sm font-semibold text-accent-dark">
                About the property
              </p>

              <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                A comfortable stay, thoughtfully prepared
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                {hotel.description ||
                  "Enjoy a comfortable and memorable stay with modern facilities, convenient access to the city, and everything you need for a relaxing trip."}
              </p>
            </section>

            {/* AMENITIES */}
            {hotel.amenities?.length > 0 && (
              <section className="mt-12">
                <p className="text-sm font-semibold text-accent-dark">
                  Everything you need
                </p>

                <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                  Hotel amenities
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity._id}
                      className="flex items-center gap-3 rounded-2xl border border-slateline bg-white px-4 py-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15">
                        <Wifi
                          size={17}
                          className="text-accent-dark"
                        />
                      </div>

                      <span className="text-sm font-medium text-ink">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ROOMS */}
            <section className="mt-12">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-accent-dark">
                    Choose your stay
                  </p>

                  <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                    Available rooms
                  </h2>
                </div>

                {rooms.length > 0 && (
                  <p className="text-sm text-muted">
                    {rooms.length} room types available
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-5">
                {rooms.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slateline bg-surface p-10 text-center">
                    <p className="font-display text-lg font-semibold text-ink">
                      No rooms available
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      This property currently has no rooms available for
                      booking.
                    </p>
                  </div>
                ) : (
                  rooms.map((room) => (
                    <RoomBookingCard
                      key={room._id}
                      room={room}
                      searchDates={searchDates}
                    />
                  ))
                )}
              </div>
            </section>

            {/* REVIEWS */}
            <section className="mt-12">
              <div>
                <p className="text-sm font-semibold text-accent-dark">
                  Guest experiences
                </p>

                <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                  Guest reviews
                </h2>
              </div>

              <div className="mt-5">
                {reviews.length > 0 ? (
                  <ReviewList reviews={reviews} />
                ) : (
                  <div className="rounded-2xl bg-surface p-8 text-center">
                    <p className="font-display font-semibold text-ink">
                      No reviews yet
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      Be the first guest to share your experience.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="card overflow-hidden">
              {/* Booking prompt */}
              <div className="bg-ink p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                      Ready to stay?
                    </p>

                    <h3 className="mt-2 font-display text-xl font-bold">
                      Choose a room below
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <ShieldCheck size={19} />
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Select your dates, check availability, and confirm your
                  booking directly from the room options.
                </p>
              </div>

              {/* Policies */}
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Hotel policies
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <Clock
                        size={17}
                        className="text-accent-dark"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-muted">
                        Check-in
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-ink">
                        {hotel.policies?.checkInTime || "12:00 PM"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <Clock
                        size={17}
                        className="text-accent-dark"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-muted">
                        Check-out
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-ink">
                        {hotel.policies?.checkOutTime || "11:00 AM"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slateline pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Cancellation
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-ink">
                      {hotel.policies?.cancellationPolicy ||
                        "Cancellation policies may vary depending on the selected room."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default HotelDetail;
