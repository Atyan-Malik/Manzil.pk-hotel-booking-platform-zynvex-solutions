
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Contact as ContactIcon,
} from "lucide-react";

const EMPTY_CONTACT = {
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
};

const DEFAULT_INPUT =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 pl-10 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10";

const DEFAULT_LABEL =
  "text-xs font-semibold text-ink";

const DEFAULT_HELPER =
  "mt-1.5 text-[11px] leading-5 text-ink-faint";

const ContactSection = ({
  contact,
  set,
  inputClass = DEFAULT_INPUT,
  labelClass = DEFAULT_LABEL,
  helperClass = DEFAULT_HELPER,
}) => {
  const safeContact = {
    ...EMPTY_CONTACT,
    ...(contact || {}),
  };

  const updateField = (field, value) => {
    if (typeof set === "function") {
      set(`contact.${field}`, value);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-ink">
            <ContactIcon size={18} strokeWidth={2} />
          </div>

          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Contact information
            </h3>

            <p className="mt-1 text-xs leading-5 text-ink-faint">
              Contact details guests can use to reach the property.
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Phone */}
          <div>
            <label className={labelClass}>Phone number</label>

            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-ink-faint"
              />

              <input
                type="tel"
                value={safeContact.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value)
                }
                placeholder="+92 300 1234567"
                className={inputClass}
              />
            </div>

            <p className={helperClass}>
              Main phone number for guest inquiries.
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <label className={labelClass}>WhatsApp</label>

            <div className="relative">
              <MessageCircle
                size={16}
                className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-ink-faint"
              />

              <input
                type="tel"
                value={safeContact.whatsapp}
                onChange={(e) =>
                  updateField("whatsapp", e.target.value)
                }
                placeholder="+92 300 1234567"
                className={inputClass}
              />
            </div>

            <p className={helperClass}>
              WhatsApp number guests can use for quick contact.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email address</label>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-ink-faint"
              />

              <input
                type="email"
                value={safeContact.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                placeholder="reservations@hotel.com"
                className={inputClass}
              />
            </div>

            <p className={helperClass}>
              Booking or reservations email.
            </p>
          </div>

          {/* Website */}
          <div>
            <label className={labelClass}>Website</label>

            <div className="relative">
              <Globe
                size={16}
                className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-ink-faint"
              />

              <input
                type="url"
                value={safeContact.website}
                onChange={(e) =>
                  updateField("website", e.target.value)
                }
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>

            <p className={helperClass}>
              Official hotel website, if available.
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-primary/20 bg-primary-light/50 p-4">
          <p className="text-sm font-semibold text-ink">
            Guest contact details
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-soft">
            These details can be displayed on the hotel details page
            so guests can contact the property directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
