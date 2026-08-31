const About = () => {
  return (
    <div className="container-page py-16 md:py-24">
      {/* Hero */}
    {/* About Manzil.pk */}
<section className="relative overflow-hidden rounded-[2rem] bg-ink">
  <div className="grid min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">

    {/* Left Content */}
    <div className="relative flex flex-col justify-center px-7 py-14 md:px-12 md:py-16 lg:px-16">
      <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-[#8FE13D]/10 blur-3xl" />

      <div className="relative">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8FE13D]">
          About Manzil.pk
        </span>

        <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
          Stay somewhere
          <span className="block text-[#8FE13D]">
            worth remembering.
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-8 text-white/65 md:text-lg">
          Manzil.pk brings together hotels and travelers across Pakistan,
          making it easier to discover beautiful stays, compare your options,
          and book with confidence.
        </p>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
          From the energy of Lahore and Islamabad to the breathtaking
          landscapes of Hunza and Skardu, your next stay is closer than you
          think.
        </p>
      </div>
    </div>

    {/* Right Destination Panel */}
    <div className="relative min-h-[340px] overflow-hidden lg:min-h-full">
      {/* Background image */}
      <img
        src="/manzil-about.jpg"
        alt="Beautiful destination in Pakistan"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Image overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Destination label */}
      <div className="absolute bottom-7 left-7 right-7 md:bottom-10 md:left-10 md:right-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
              Explore Pakistan
            </p>

            <p className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
              Find your next manzil.
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8FE13D] text-xl text-[#17210F]">
            →
          </div>
        </div>
      </div>
    </div>

  </div>
</section>


      {/* Our Purpose */}
      <section className="mt-20 md:mt-28">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

          {/* Main Content */}
          <div className="rounded-[2rem] bg-ink p-8 md:p-12">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8FE13D]">
              Our Purpose
            </span>

            <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Making every stay easier to find.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              We believe booking a hotel should feel effortless. Travelers
              should be able to discover great places, understand what they
              are getting, and make confident decisions without unnecessary
              complexity.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              That's why Manzil.pk brings hotel discovery, useful information,
              ratings, pricing, and a simple booking experience together in
              one place.
            </p>
          </div>

          {/* Purpose Highlights */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">

            <div className="rounded-[2rem] border border-[#DDE8D2] bg-[#F5F9F0] p-7">
              <p className="font-display text-4xl font-bold text-[#6DAF24]">
                01
              </p>

              <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                Discover with ease
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Find stays across Pakistan without getting lost in endless
                choices.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#E6E1D3] bg-[#FAF8F1] p-7">
              <p className="font-display text-4xl font-bold text-[#9A7D36]">
                02
              </p>

              <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                Choose confidently
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Explore ratings, prices, locations, and hotel details before
                making your choice.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* Why Manzil.pk */}
      <section className="mt-20 md:mt-28">
        <div className="mb-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Why Manzil.pk
          </span>

          <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
            Built around better travel.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#DDE8D2] bg-[#F5F9F0] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F6D5] text-lg text-[#6DAF24]">
              ✓
            </div>

            <h3 className="font-display text-xl font-semibold text-ink">
              Trusted Stays
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted">
              Discover carefully presented hotels and guesthouses with the
              information you need before making a decision.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#E6E1D3] bg-[#FAF8F1] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#F1EBD7] text-lg text-[#9A7D36]">
              ◆
            </div>

            <h3 className="font-display text-xl font-semibold text-ink">
              Clear Choices
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted">
              Compare destinations, ratings, prices, and hotel details so you
              can choose the stay that fits your journey.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#D9E3E7] bg-[#F2F7F8] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#DFEDF0] text-lg text-[#477985]">
              ↗
            </div>

            <h3 className="font-display text-xl font-semibold text-ink">
              Made for Pakistan
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted">
              From bustling cities to breathtaking northern landscapes,
              Manzil.pk is built around the places travelers love to explore.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 overflow-hidden rounded-3xl bg-ink px-7 py-14 text-center md:mt-28 md:px-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8FE13D]">
          Your next destination awaits
        </p>

        <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold text-white md:text-5xl">
          Find your stay. Start your journey. Find your manzil.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Wherever Pakistan takes you, Manzil.pk helps you find a place to
          stay along the way.
        </p>

        {/* Explore Hotels Button */}
        <a
          href="/hotels"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#8FE13D] px-7 py-3.5 text-sm font-semibold text-[#17210F] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#7FD02F] hover:shadow-lg"
        >
          Explore Hotels
          <span className="ml-2 text-base">→</span>
        </a>
      </section>
    </div>
  );
};

export default About;