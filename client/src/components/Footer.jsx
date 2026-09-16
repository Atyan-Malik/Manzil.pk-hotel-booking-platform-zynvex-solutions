
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowUpRight,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

import { PAKISTAN_CITIES } from "../utils/constants";

const Footer = () => {
  const companyLinks = [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
  
    { label: "List Your Hotel", to: "/register" },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-white">
      {/* =====================================================
          Main Footer
      ===================================================== */}

      <div className="container-page py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr] lg:gap-10">
          {/* =================================================
              Brand
          ================================================= */}

          <div className="max-w-sm">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
            >
              <span
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  bg-primary
                  text-sm font-extrabold text-ink
                  shadow-sm
                  transition-transform duration-200
                  group-hover:scale-105
                "
              >
                M.
              </span>

              <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                Manzil<span className="text-accent-dark">.Pk</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-muted">
              Discover and book comfortable stays across Pakistan's
              most loved destinations — from city hotels to mountain
              guesthouses.
            </p>

            {/* Small brand statement */}
            <div
              className="
                mt-6 inline-flex items-center gap-2
                rounded-full
                border border-line
                bg-surface-muted
                px-3.5 py-2
                text-xs font-semibold text-ink-soft
              "
            >
              <MapPin size={14} className="text-accent-dark" />
              <span>Explore Pakistan, one stay at a time.</span>
            </div>
          </div>

          {/* =================================================
              Company
          ================================================= */}

          <div>
            <FooterHeading>Company</FooterHeading>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <FooterLink to={item.to}>
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* =================================================
              Destinations
          ================================================= */}

          <div>
            <FooterHeading>Destinations</FooterHeading>

            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
              {PAKISTAN_CITIES.slice(0, 6).map((city) => (
                <li key={city}>
                  <Link
                    to={`/hotels?city=${encodeURIComponent(city)}`}
                    className="
                      group inline-flex items-center gap-1
                      text-sm text-ink-soft
                      transition-colors
                      hover:text-accent-dark
                    "
                  >
                    {city}

                    <ArrowUpRight
                      size={12}
                      className="
                        opacity-0
                        -translate-y-0.5
                        transition-all duration-200
                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/hotels"
              className="
                mt-5 inline-flex items-center gap-1.5
                text-xs font-bold text-ink
                transition-colors
                hover:text-accent-dark
              "
            >
              Explore all hotels
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* =================================================
              Get in Touch
          ================================================= */}

          <div>
            <FooterHeading>Get in touch</FooterHeading>

            <div className="mt-5 space-y-4">
              <a
                href="mailto:support@Manzil.pk"
                className="
                  group flex items-start gap-3
                  text-sm text-ink-soft
                  transition-colors
                  hover:text-ink
                "
              >
                <span
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-lg
                    bg-surface-muted
                    text-ink-soft
                    transition-colors
                    group-hover:bg-primary-light
                    group-hover:text-ink
                  "
                >
                  <Mail size={15} />
                </span>

                <span className="pt-1.5">
                  support@Manzil.pk
                </span>
              </a>

              <a
                href="tel:+923001234567"
                className="
                  group flex items-start gap-3
                  text-sm text-ink-soft
                  transition-colors
                  hover:text-ink
                "
              >
                <span
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-lg
                    bg-surface-muted
                    text-ink-soft
                    transition-colors
                    group-hover:bg-primary-light
                    group-hover:text-ink
                  "
                >
                  <Phone size={15} />
                </span>

                <span className="pt-1.5">
                  +92 300 1234567
                </span>
              </a>
            </div>

            {/* Hotel CTA */}
            <Link
              to="/register"
              className="
                group mt-6 inline-flex items-center gap-2
                rounded-xl
                bg-ink
                px-4 py-2.5
                text-xs font-bold text-white
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-black
              "
            >
              List your hotel
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          Bottom Bar
      ===================================================== */}

      <div className="border-t border-line">
        <div
          className="
            container-page
            flex flex-col gap-3
            py-5
            text-center
            sm:flex-row sm:items-center sm:justify-between
            sm:text-left
          "
        >
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Manzil.Pk. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-5 sm:justify-end">
            <Link
              to="/privacy-policy"
              className="text-xs text-muted transition-colors hover:text-ink"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-muted transition-colors hover:text-ink"
            >
              Terms
            </Link>

            <Link
              to="/cancellation-policy"
              className="text-xs text-muted transition-colors hover:text-ink"
            >
              Cancellation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* =========================================================
   Footer Heading
========================================================= */

const FooterHeading = ({ children }) => {
  return (
    <h4
      className="
        font-display
        text-xs font-extrabold
        uppercase
        tracking-[0.14em]
        text-ink
      "
    >
      {children}
    </h4>
  );
};

/* =========================================================
   Footer Link
========================================================= */

const FooterLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="
        group inline-flex items-center gap-1
        text-sm text-ink-soft
        transition-colors
        hover:text-ink
      "
    >
      {children}

      <ArrowUpRight
        size={12}
        className="
          opacity-0
          -translate-y-0.5
          transition-all duration-200
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      />
    </Link>
  );
};

export default Footer;
