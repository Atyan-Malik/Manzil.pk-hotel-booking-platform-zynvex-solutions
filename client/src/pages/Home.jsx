
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Wallet,
} from "lucide-react";

import HeroSearch from "../components/HeroSearch";
import HotelCarousel from "../components/HotelCarousel";
import { getHotels } from "../services/hotelService";
import { PAKISTAN_CITIES } from "../utils/constants";

const stats = [
  { value: "1,200+", label: "Verified Hotels" },
  { value: "10", label: "Pakistani Cities" },
  { value: "40,000+", label: "Happy Travelers" },
  { value: "4.8/5", label: "Average Rating" },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified Properties",
    description:
      "Every hotel is checked and approved by our team before it goes live.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description:
      "The price you see is the price you pay. No hidden charges at check-in.",
  },
  {
    icon: BadgeCheck,
    title: "Free Cancellation",
    description:
      "Plans change. Most stays can be cancelled up to 24 hours before check-in.",
  },
];

const Home = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    getHotels({ sort: "rating", limit: 8 })
      .then((data) => setHotels(data.hotels || []))
      .catch(() => setHotels([]));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="container-page pt-4 sm:pt-6">
        <div
          className="
            relative
            min-h-[680px]
            overflow-hidden
            rounded-2xl

            sm:min-h-[620px]
            sm:rounded-xl2

            lg:h-[560px]
            lg:min-h-0
          "
        >
          {/* Hero Image */}
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
            alt="Luxury hotel in Pakistan"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          {/* Overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-ink/90
              via-ink/35
              to-ink/10
            "
          />

          {/* ================= TOP BADGE ================= */}
          <div
            className="
              absolute
              right-3
              top-3
              sm:right-5
              sm:top-5
              lg:right-6
              lg:top-6
            "
          >
            <div
              className="
                rounded-xl
                bg-white/95
                px-3
                py-2
                shadow-soft
                backdrop-blur-sm

                sm:rounded-2xl
                sm:px-4
                sm:py-3
              "
            >
              <p className="text-[10px] text-muted sm:text-xs">
                Free cancellation
              </p>

              <p className="mt-0.5 text-xs font-semibold text-ink sm:text-sm">
                Up to 24 hours before
              </p>
            </div>
          </div>

          {/* ================= HERO CONTENT ================= */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              px-4
              pb-5

              sm:px-6
              sm:pb-7

              md:px-8
              md:pb-8

              lg:px-10
              lg:pb-10
            "
          >
            <div className="w-full">
              {/* Heading */}
              <h1
                className="
                  max-w-2xl
                  font-display
                  text-3xl
                  font-extrabold
                  leading-[1.08]
                  tracking-tight
                  text-white

                  xs:text-4xl
                  sm:text-5xl

                  lg:max-w-xl
                  lg:text-5xl
                "
              >
                Find your next stay{" "}
                <span className="text-accent">
                  across Pakistan
                </span>
              </h1>

              {/* Description */}
              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-white/80

                  sm:text-base
                  lg:max-w-md
                "
              >
                From Islamabad city hotels to Hunza guesthouses — book with
                confidence.
              </p>

              {/* Search */}
              <div className="mt-5 w-full sm:mt-6">
                <HeroSearch />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section
        className="
          container-page
          mt-10
          grid
          grid-cols-2
          gap-y-7
          gap-x-4

          sm:mt-14
          sm:grid-cols-4
          sm:gap-6
        "
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="
              text-center

              sm:text-left
            "
          >
            <p
              className="
                font-display
                text-2xl
                font-extrabold
                text-ink

                sm:text-3xl
              "
            >
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-muted sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* ================= POPULAR HOTELS ================= */}
      <section
        className="
          container-page
          mt-14

          sm:mt-20
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p className="text-sm font-semibold text-accent-dark">
              Top Rated
            </p>

            <h2
              className="
                mt-1
                font-display
                text-2xl
                font-bold
                leading-tight
                text-ink

                sm:text-3xl
              "
            >
              Popular stays this month
            </h2>
          </div>

          <Link
            to="/hotels"
            className="
              hidden
              shrink-0
              items-center
              gap-1
              text-sm
              font-semibold
              text-ink
              transition-opacity
              hover:opacity-70

              sm:flex
            "
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 sm:mt-8">
          <HotelCarousel hotels={hotels} />
        </div>

        {/* Mobile View All */}
        <div className="mt-5 sm:hidden">
          <Link
            to="/hotels"
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slateline
              px-4
              py-3
              text-sm
              font-semibold
              text-ink
              transition-colors
              hover:border-accent
            "
          >
            View all hotels
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section
        className="
          container-page
          mt-14

          sm:mt-20
        "
      >
        <div
          className="
            grid
            gap-4

            sm:grid-cols-3
            sm:gap-6
          "
        >
          {highlights.map(
            ({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="
                  card
                  p-5

                  sm:p-6
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-accent/15

                    sm:h-11
                    sm:w-11
                  "
                >
                  <Icon
                    size={19}
                    className="text-accent-dark"
                  />
                </div>

                <h3
                  className="
                    mt-4
                    font-display
                    text-base
                    font-semibold
                    text-ink

                    sm:text-lg
                  "
                >
                  {title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-relaxed
                    text-muted
                  "
                >
                  {description}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= DESTINATIONS ================= */}
      <section
        className="
          container-page
          mt-14
          mb-14

          sm:mt-20
          sm:mb-20
        "
      >
        <h2
          className="
            font-display
            text-2xl
            font-bold
            leading-tight
            text-ink

            sm:text-3xl
          "
        >
          Explore by destination
        </h2>

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3

            sm:mt-8
            sm:grid-cols-3
            sm:gap-4

            lg:grid-cols-5
          "
        >
          {PAKISTAN_CITIES.map((city) => (
            <Link
              key={city}
              to={`/hotels?city=${encodeURIComponent(city)}`}
              className="
                card
                flex
                min-h-[70px]
                items-center
                justify-center
                px-3
                py-4
                text-center
                font-display
                text-sm
                font-semibold
                text-ink
                transition-all

                hover:border-accent
                hover:-translate-y-0.5

                sm:min-h-[80px]
                sm:px-4
                sm:py-6
              "
            >
              {city}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
