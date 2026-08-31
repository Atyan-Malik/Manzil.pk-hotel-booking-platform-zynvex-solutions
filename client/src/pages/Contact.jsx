
import { Mail, Phone, MapPin, ArrowRight,MessageCircle  } from "lucide-react";

const Contact = () => {
  return (
    <div className="container-page py-16 md:py-24">
{/* Contact Hero */}
<section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">

  {/* Left */}
  <div>
    <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
      Get in touch
    </span>

    <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-5xl lg:text-6xl">
      We're here to help
      <span className="block text-primary">
        with your next stay.
      </span>
    </h1>

    <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
      Have a question about a booking, need help finding the right hotel,
      or want to list your property on Manzil.pk? Our team is ready to help.
    </p>
  </div>


  {/* Right - Supporting Card */}
  <div className="relative overflow-hidden rounded-[2rem] bg-[#F5F9F0] p-7 md:p-9">

    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#8FE13D]/20 blur-3xl" />

    <div className="relative">

     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8FE13D] text-[#17210F]">
  <MessageCircle size={21} strokeWidth={2} />
</div>

      <h2 className="mt-6 font-display text-2xl font-bold text-ink md:text-3xl">
        We're listening.
      </h2>

      <p className="mt-3 text-sm leading-7 text-muted">
        From booking questions to hotel partnerships, send us a message and
        we'll make sure it reaches the right person.
      </p>

      <div className="mt-7 flex items-center gap-3 border-t border-[#DDE8D2] pt-5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#8FE13D]" />

        <p className="text-sm font-medium text-ink">
          Usually replies within one business day
        </p>
      </div>

    </div>
  </div>

</section>


{/* Contact Form Section */}
<section className="mt-16 md:mt-20">
  {/* your existing contact form section here */}
</section>



      {/* Contact Layout */}
      <section className="grid overflow-hidden rounded-[2rem] bg-ink lg:grid-cols-[0.8fr_1.2fr]">

        {/* Contact Information */}
        <div className="relative overflow-hidden px-7 py-10 md:px-12 md:py-14 lg:px-14 lg:py-16">

          {/* Decorative circles */}
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#8FE13D]/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#8FE13D]/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8FE13D]">
              Contact Manzil.pk
            </p>

            <h2 className="mt-5 max-w-md font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              Let's make your journey easier.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
              Whether you're a traveler looking for the perfect stay or a
              hotel owner ready to reach more guests, we'd love to hear from
              you.
            </p>


            {/* Contact Details */}
            <div className="mt-10 space-y-6">

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8FE13D]">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-white">
                    support@manzil.pk
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8FE13D]">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-white">
                    +92 300 1234567
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8FE13D]">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">
                    Serving
                  </p>

                  <p className="mt-1 text-sm text-white">
                    Destinations across Pakistan
                  </p>
                </div>
              </div>

            </div>


            {/* Response Time */}
            <div className="mt-12 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-wider text-white/35">
                Response time
              </p>

              <p className="mt-2 text-sm text-white/70">
                Usually within one business day.
              </p>
            </div>
          </div>
        </div>


        {/* Contact Form */}
        <div className="bg-[#F6F8F2] px-7 py-10 md:px-12 md:py-14 lg:px-14 lg:py-16">

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Send a message
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold text-ink md:text-3xl">
              How can we help?
            </h2>
          </div>


          <form className="space-y-5">

            {/* Name + Email */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Your name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#DDE3D7] bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-[#8FE13D] focus:ring-2 focus:ring-[#8FE13D]/20"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#DDE3D7] bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-[#8FE13D] focus:ring-2 focus:ring-[#8FE13D]/20"
                />
              </div>

            </div>


            {/* Subject */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Subject
              </label>

              <select
                className="w-full rounded-xl border border-[#DDE3D7] bg-white px-4 py-3.5 text-sm text-ink outline-none transition focus:border-[#8FE13D] focus:ring-2 focus:ring-[#8FE13D]/20"
              >
                <option>Booking support</option>
                <option>Hotel listing</option>
                <option>General question</option>
                <option>Partnership</option>
              </select>
            </div>


            {/* Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Message
              </label>

              <textarea
                rows="5"
                placeholder="Tell us how we can help..."
                className="w-full resize-none rounded-xl border border-[#DDE3D7] bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-[#8FE13D] focus:ring-2 focus:ring-[#8FE13D]/20"
              />
            </div>


            {/* Button */}
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8FE13D] px-6 py-3.5 text-sm font-semibold text-[#17210F] transition duration-300 hover:-translate-y-0.5 hover:bg-[#7FD02F] hover:shadow-lg"
            >
              Send Message

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <p className="text-center text-xs text-muted">
              We’ll get back to you as soon as possible.
            </p>

          </form>
        </div>

      </section>

    </div>
  );
};

export default Contact;