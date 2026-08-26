import { Link } from "react-router-dom";
import { PAKISTAN_CITIES } from "../utils/constants";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-slateline bg-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
              SS
            </span>
            <span className="font-display text-lg font-bold">SafarStay</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Discover and book stays across Pakistan's most loved destinations, from Islamabad city hotels
            to Hunza guesthouses.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            Company
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/about" className="text-ink hover:text-accent-dark">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-ink hover:text-accent-dark">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-ink hover:text-accent-dark">
                List Your Hotel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            Destinations
          </h4>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {PAKISTAN_CITIES.slice(0, 6).map((city) => (
              <li key={city}>
                <Link to={`/hotels?city=${city}`} className="text-ink hover:text-accent-dark">
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            Get in touch
          </h4>
          <p className="mt-4 text-sm text-muted">support@safarstay.pk</p>
          <p className="mt-1 text-sm text-muted">+92 300 1234567</p>
        </div>
      </div>

      <div className="border-t border-slateline py-6">
        <p className="container-page text-center text-xs text-muted">
          © {new Date().getFullYear()} SafarStay. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
