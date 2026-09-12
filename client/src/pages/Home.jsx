import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, BadgeCheck, Wallet } from "lucide-react";

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
    "/images/lahore.jpg",

  Islamabad:
    "/images/islamabad.jpg",

  Karachi:
    "/images/karachi.jpg",

  Murree:
    "/images/murree.jpg",

  Hunza:
    "/images/hunza.jpg",

  Skardu:
  "/images/skardu.jpg"
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
            src="/images/hero.jfif"
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
                <span className="text-accent">across Pakistan</span>
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

            ${index === 1 ? "border-l border-[#E3E8DE]" : ""}

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
            <p className="text-sm font-semibold text-accent-dark">Top Rated</p>

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
                  We keep hotel discovery simple, transparent, and focused on
                  what actually matters when you're planning your journey.
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
            {highlights.map(({ icon: Icon, title, description }, index) => (
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
            ))}
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
                  destinationImages[city] || "/images/destinations/default.jpg"
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

                  <div
                    className="
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
            "
                  >
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

{/* ================= HOW IT WORKS ================= */}
<section className="container-page mt-20 sm:mt-28">
  {/* Section heading */}
  <div className="mx-auto max-w-2xl text-center">
    <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8D2] bg-[#F4F8EF] px-3.5 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#8FE13D]" />
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#50643F]">
        Simple by design
      </span>
    </div>

    <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
      Your next stay, <span className="text-[#6FAE2F]">made simple.</span>
    </h2>

    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
      From discovering the right hotel to confirming your reservation,
      Manzil.pk keeps every step simple and stress-free.
    </p>
  </div>

  {/* Steps */}
  <div className="relative mt-12 lg:mt-14">
    {/* Desktop connecting line */}
    <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[46px] hidden h-px bg-gradient-to-r from-transparent via-[#C9DDBB] to-transparent lg:block" />

    <div className="grid gap-5 lg:grid-cols-3 lg:gap-7">
      {[
        {
          number: "01",
          title: "Search your stay",
          description:
            "Enter your destination, dates, and guests to discover stays that match your trip.",
          label: "Discover",
        },
        {
          number: "02",
          title: "Find your match",
          description:
            "Compare hotels, prices, amenities, ratings, and reviews before making your choice.",
          label: "Compare",
        },
        {
          number: "03",
          title: "Book with confidence",
          description:
            "Confirm your reservation and keep track of your booking easily from your account.",
          label: "Book",
        },
      ].map((step) => (
        <div
          key={step.number}
          className="
            group relative overflow-hidden
            rounded-[1.75rem]
            border border-[#E1E8DC]
            bg-white
            p-6
            shadow-[0_8px_30px_rgba(23,33,15,0.035)]
            transition-all duration-300
            hover:-translate-y-1.5
            hover:border-[#CFE5B9]
            hover:shadow-[0_20px_45px_rgba(23,33,15,0.08)]
            sm:p-7
          "
        >
          {/* Soft background glow */}
          <div
            className="
              pointer-events-none absolute -right-16 -top-16
              h-36 w-36 rounded-full
              bg-[#8FE13D]/10 blur-2xl
              transition-transform duration-500
              group-hover:scale-150
            "
          />

          {/* Top row */}
          <div className="relative flex items-center justify-between">
            {/* Number */}
            <div
              className="
                flex h-[3.4rem] w-[3.4rem]
                items-center justify-center
                rounded-2xl
                bg-[#8FE13D]
                font-display text-sm font-extrabold
                tracking-wide text-[#17210F]
                shadow-[0_8px_20px_rgba(143,225,61,0.22)]
                transition-transform duration-300
                group-hover:scale-105
              "
            >
              {step.number}
            </div>

            {/* Small label */}
            <span
              className="
                rounded-full
                border border-[#E1E9DA]
                bg-[#F7FAF4]
                px-3 py-1
                text-[11px] font-bold uppercase
                tracking-[0.14em] text-[#65745A]
              "
            >
              {step.label}
            </span>
          </div>

          {/* Content */}
          <div className="relative mt-7">
            <h3 className="font-display text-xl font-bold tracking-tight text-ink sm:text-[1.35rem]">
              {step.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted sm:text-[0.95rem]">
              {step.description}
            </p>
          </div>

          {/* Bottom accent */}
          <div className="relative mt-7 flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-[#8FE13D] transition-all duration-300 group-hover:w-14" />
            <div className="h-1 w-1 rounded-full bg-[#D8E5D0]" />
            <div className="h-1 w-1 rounded-full bg-[#D8E5D0]" />
          </div>

          {/* Corner number */}
          <span
            className="
              pointer-events-none absolute
              -bottom-7 -right-2
              font-display text-[7rem]
              font-black leading-none
              text-[#F4F7F1]
              transition-colors duration-300
              group-hover:text-[#F0F6E9]
            "
          >
            {step.number}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Bottom reassurance */}
  <div className="mt-8 flex justify-center">
    <div className="inline-flex items-center gap-2 rounded-full bg-[#F7F9F5] px-4 py-2 text-xs font-medium text-[#66725E]">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8FE13D] text-[10px] font-black text-[#17210F]">
        ✓
      </span>
      Everything you need for a smoother stay
    </div>
  </div>
</section>


{/* ================= FAQ ================= */}
<section className="container-page mt-20 sm:mt-28">
  <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
    
    {/* ================= INTRO ================= */}
    <div className="lg:sticky lg:top-24">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8D2] bg-[#F4F8EF] px-3.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8FE13D]" />
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#50643F]">
          Need to know?
        </span>
      </div>

      {/* Heading */}
      <h2 className="mt-5 max-w-lg font-display text-3xl font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.7rem]">
        Questions?
        <br />
        <span className="text-[#6FAE2F]">We've got answers.</span>
      </h2>

      {/* Description */}
      <p className="mt-5 max-w-md text-sm leading-7 text-muted sm:text-base">
        Everything you need to know about finding, booking, and managing
        your stay with Manzil.pk.
      </p>

      {/* Contact card */}
      <div
        className="
          mt-8 max-w-md
          rounded-[1.5rem]
          border border-[#E0E8DA]
          bg-[#F7FAF4]
          p-5
          sm:p-6
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl
              bg-[#8FE13D]
              text-[#17210F]
              shadow-[0_6px_16px_rgba(143,225,61,0.2)]
            "
          >
            <ArrowRight size={18} />
          </div>

          <div>
            <p className="font-display text-sm font-bold text-ink">
              Still need help?
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Our support team is here if you need a hand with your booking.
            </p>

            <Link
              to="/contact"
              className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-bold
                text-[#5F9824]
                transition-all
                hover:gap-2.5
                hover:text-[#4F801E]
              "
            >
              Contact us
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* ================= QUESTIONS ================= */}
    <div className="space-y-3">
      {[
        {
          question: "How do I book a hotel on Manzil.pk?",
          answer:
            "Search for your destination, select your dates and guests, choose a hotel and available room, then complete the booking process.",
        },
        {
          question: "Can I cancel my booking?",
          answer:
            "Cancellation depends on the hotel's cancellation policy. You can review the applicable policy before confirming your booking.",
        },
        {
          question: "How can I check my booking?",
          answer:
            "After booking, you can view and manage your reservations from your account's booking section.",
        },
        {
          question: "Are the hotels on Manzil.pk verified?",
          answer:
            "Manzil.pk focuses on verified properties. Hotels are reviewed and approved before being made available on the platform.",
        },
        {
          question: "Can I change my booking after confirmation?",
          answer:
            "Booking changes depend on the hotel's policy and availability. Check your booking details or contact support for assistance.",
        },
      ].map((faq, index) => (
        <details
          key={faq.question}
          className="
            group
            overflow-hidden
            rounded-[1.35rem]
            border border-[#E2E8DE]
            bg-white
            shadow-[0_4px_20px_rgba(23,33,15,0.025)]
            transition-all
            duration-300
            hover:border-[#D2E2C5]
            hover:shadow-[0_10px_28px_rgba(23,33,15,0.05)]
            open:border-[#CFE5B9]
            open:bg-[#FBFDF9]
            open:shadow-[0_12px_32px_rgba(23,33,15,0.06)]
          "
        >
          <summary
            className="
              flex
              cursor-pointer
              list-none
              items-center
              gap-4
              px-5
              py-5
              sm:px-6
              sm:py-5.5
            "
          >
            {/* Number */}
            <span
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#F1F6EC]
                font-display
                text-[11px]
                font-extrabold
                tracking-wide
                text-[#6B8B55]
                transition-all
                duration-300
                group-open:bg-[#8FE13D]
                group-open:text-[#17210F]
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Question */}
            <span
              className="
                flex-1
                font-display
                text-sm
                font-bold
                leading-6
                text-ink
                sm:text-[15px]
              "
            >
              {faq.question}
            </span>

            {/* Plus */}
            <span
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full
                border border-[#DFE8D8]
                bg-[#F7FAF5]
                text-[#6DAF24]
                transition-all
                duration-300
                group-hover:border-[#CFE5B9]
                group-hover:bg-[#EEF8E4]
                group-open:rotate-45
                group-open:border-[#8FE13D]
                group-open:bg-[#8FE13D]
                group-open:text-[#17210F]
              "
            >
              <span className="text-xl font-light leading-none">+</span>
            </span>
          </summary>

          {/* Answer */}
          <div className="px-5 pb-5 pl-[4.55rem] sm:px-6 sm:pb-6 sm:pl-[4.9rem]">
            <div className="mb-4 h-px w-10 bg-[#DCE8D4]" />

            <p className="max-w-2xl text-sm leading-7 text-muted">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  </div>
</section>
<br />
 
      {/* ================= CTA BANNER ================= */}
<section className="container-page pb-16 sm:pb-24">
  <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
    
    {/* Subtle accent glow */}
    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#8FE13D]/15 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#8FE13D]/10 blur-3xl" />

    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      
      {/* Content */}
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8FE13D]">
          Your next stay awaits
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Find a place worth
          <span className="text-[#8FE13D]"> staying for.</span>
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
          From city escapes to mountain retreats, discover verified stays
          across Pakistan and book with confidence.
        </p>
      </div>

      {/* CTA */}
      <div className="relative shrink-0">
        <Link
          to="/hotels"
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#8FE13D]
            px-6
            py-3.5
            text-sm
            font-bold
            text-[#17210F]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-[#9BEA4E]
            hover:shadow-[0_12px_30px_rgba(143,225,61,0.2)]
            sm:w-auto
          "
        >
          Explore Hotels
          <ArrowRight size={17} />
        </Link>

        <p className="mt-3 text-center text-xs text-white/40">
          1,200+ verified properties
        </p>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default Home;
