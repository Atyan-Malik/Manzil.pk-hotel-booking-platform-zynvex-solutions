
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

const destinationImages = {
  Lahore:
    "https://images.unsplash.com/photo-1582972236019-ea9c7a8e5f0a?w=900&q=80",

  Islamabad:
    "https://images.unsplash.com/photo-1591018653367-5f1f6b7c8b6f?w=900&q=80",

  Karachi:
    "https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?w=900&q=80",

  Multan:
    "https://images.unsplash.com/photo-1609947017136-9daf32a3f8f5?w=900&q=80",

  Hunza:
    "https://images.unsplash.com/photo-1590050752117-23a9d0c7b7a4?w=900&q=80",
};

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
<section className="container-page mt-10 flex justify-center sm:mt-14">
  <div
    className="
      relative
      w-full
      max-w-5xl
      overflow-hidden
      rounded-[2rem]
      border
      border-[#DDE5D6]
      bg-[#F8FAF5]
      shadow-[0_18px_50px_rgba(23,33,15,0.08)]
    "
  >
    {/* Subtle accent glow */}
    <div
      className="
        pointer-events-none
        absolute
        -right-24
        -top-24
        h-48
        w-48
        rounded-full
        bg-[#8FE13D]/10
        blur-3xl
      "
    />

    <div
      className="
        relative
        grid
        grid-cols-2
        sm:grid-cols-4
      "
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            group
            relative
            flex
            min-h-[125px]
            flex-col
            items-center
            justify-center
            px-4
            py-7
            text-center
            transition-all
            duration-300
            hover:bg-white

            ${
              index === 1
                ? "border-l border-[#E3E8DE]"
                : ""
            }

            ${
              index === 2
                ? "border-t border-[#E3E8DE] sm:border-l sm:border-t-0"
                : ""
            }

            ${
              index === 3
                ? "border-l border-t border-[#E3E8DE] sm:border-t-0"
                : ""
            }
          `}
        >
          {/* Accent dot */}
          <span
            className="
              absolute
              top-5
              h-1
              w-1
              rounded-full
              bg-[#8FE13D]
              opacity-70
              transition-all
              duration-300
              group-hover:w-5
            "
          />

          {/* Number */}
          <p
            className="
              font-display
              text-3xl
              font-extrabold
              tracking-tight
              text-ink
              sm:text-4xl
            "
          >
            {stat.value}
          </p>

          {/* Label */}
          <p
            className="
              mt-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#7F8979]
              sm:text-xs
            "
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </div>
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
<section className="container-page mt-20 sm:mt-28">
  <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">

    {/* Featured Intro */}
    <div className="relative overflow-hidden rounded-[2rem] bg-ink p-7 md:p-9 lg:p-10">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#8FE13D]/15 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8FE13D]">
            Why Manzil.pk
          </span>

          <h2 className="mt-5 max-w-md font-display text-3xl font-bold leading-tight text-white md:text-4xl">
            Everything you need for a better stay.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/60 md:text-base">
            We keep hotel discovery simple, transparent, and focused on what
            actually matters when you're planning your journey.
          </p>
        </div>

        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8FE13D] text-[#17210F]">
            <ShieldCheck size={19} />
          </div>

          <p className="text-sm font-medium text-white/80">
            Travel with confidence
          </p>
        </div>
      </div>
    </div>


    {/* Benefits */}
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">

      {highlights.map(
        ({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className="
              group
              rounded-[1.5rem]
              border
              border-[#E3E8DE]
              bg-[#F8FAF5]
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CFE6B5]
              hover:shadow-md
              lg:flex
              lg:items-center
              lg:gap-6
            "
          >
            {/* Number + Icon */}
            <div className="flex items-center gap-3 lg:shrink-0">
              <span className="text-xs font-semibold text-[#9BA493]">
                0{index + 1}
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F6D9]">
                <Icon
                  size={19}
                  strokeWidth={2}
                  className="text-[#6DAF24]"
                />
              </div>
            </div>

            <div className="mt-5 lg:mt-0">
              <h3 className="font-display text-lg font-semibold text-ink">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                {description}
              </p>
            </div>

            <ArrowRight
              size={17}
              className="
                mt-5
                text-[#AAB2A4]
                transition-transform
                duration-300
                group-hover:translate-x-1
                lg:ml-auto
                lg:mt-0
              "
            />
          </div>
        )
      )}

    </div>
  </div>
</section>
     

{/* ================= DESTINATIONS ================= */}
<section className="container-page mt-20 mb-16 sm:mt-28 sm:mb-24">

  {/* Heading */}
  <div className="flex items-end justify-between gap-5">
    <div>
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Explore Pakistan
      </span>

      <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
        Explore by destination
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        From lively cities to peaceful mountain escapes, discover stays in
        destinations worth exploring.
      </p>
    </div>

    <Link
      to="/hotels"
      className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-ink transition-opacity hover:opacity-60 sm:flex"
    >
      View all hotels
      <ArrowRight size={16} />
    </Link>
  </div>


  {/* Destination Grid */}
  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">

    {PAKISTAN_CITIES.map((city, index) => (
      <Link
        key={city}
        to={`/hotels?city=${encodeURIComponent(city)}`}
        className={`
          group
          relative
          overflow-hidden
          rounded-[1.5rem]
          bg-ink
          ${index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
          ${index === 0 ? "min-h-[250px] sm:min-h-[330px]" : "min-h-[200px] sm:min-h-[250px]"}
        `}
      >

        {/* Image */}
        <img
          src={
            destinationImages[city] ||
            "/images/destinations/default.jpg"
          }
          alt={`${city} destination`}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">

          <div className="flex items-end justify-between gap-3">

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                Discover stays
              </p>

              <h3 className="mt-1 font-display text-xl font-semibold text-white md:text-2xl">
                {city}
              </h3>
            </div>

            <div className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-ink
              transition-all
              duration-300
              group-hover:bg-[#8FE13D]
              group-hover:translate-x-1
            ">
              <ArrowRight size={16} />
            </div>

          </div>

        </div>
      </Link>
    ))}

  </div>


  {/* Mobile View All */}
  <div className="mt-6 sm:hidden">
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
    </div>
  );
};

export default Home;
