
import {
  Clock3,
  ShieldCheck,
  PawPrint,
  Cigarette,
  PartyPopper,
  Users,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";

const EMPTY_POLICIES = {
  checkInTime: "14:00",
  checkOutTime: "12:00",
  cancellationPolicy: "moderate",
  cancellationNote:
    "Free cancellation up to 24 hours before check-in.",
  petsAllowed: false,
  smokingAllowed: false,
  partiesAllowed: false,
  childrenAllowed: true,
  houseRules: [],
};

const DEFAULT_INPUT =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10";

const DEFAULT_TEXTAREA =
  "mt-2 min-h-[100px] w-full resize-y rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10";

const DEFAULT_LABEL =
  "text-xs font-semibold text-ink";

const DEFAULT_HELPER =
  "mt-1.5 text-[11px] leading-5 text-ink-faint";

const PoliciesSection = ({
  policies,
  set,
  inputClass = DEFAULT_INPUT,
  textareaClass = DEFAULT_TEXTAREA,
  labelClass = DEFAULT_LABEL,
  helperClass = DEFAULT_HELPER,
}) => {
  const safePolicies = {
    ...EMPTY_POLICIES,
    ...(policies || {}),
    houseRules: Array.isArray(policies?.houseRules)
      ? policies.houseRules
      : [],
  };

  const updateField = (field, value) => {
    if (typeof set === "function") {
      set(`policies.${field}`, value);
    }
  };

  const addHouseRule = () => {
    const updatedRules = [
      ...safePolicies.houseRules,
      "",
    ];

    updateField("houseRules", updatedRules);
  };

  const updateHouseRule = (index, value) => {
    const updatedRules = [...safePolicies.houseRules];

    updatedRules[index] = value;

    updateField("houseRules", updatedRules);
  };

  const removeHouseRule = (index) => {
    const updatedRules = safePolicies.houseRules.filter(
      (_, ruleIndex) => ruleIndex !== index
    );

    updateField("houseRules", updatedRules);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-ink">
            <ShieldCheck size={18} strokeWidth={2} />
          </div>

          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Hotel policies
            </h3>

            <p className="mt-1 text-xs leading-5 text-ink-faint">
              Configure check-in, cancellation, guest and property rules.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        {/* Check-in / Check-out */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Clock3 size={16} className="text-ink-soft" />

            <h4 className="text-sm font-bold text-ink">
              Check-in & check-out
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Check-in time
              </label>

              <input
                type="time"
                value={safePolicies.checkInTime}
                onChange={(e) =>
                  updateField("checkInTime", e.target.value)
                }
                className={inputClass}
              />

              <p className={helperClass}>
                Standard time guests can check in.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Check-out time
              </label>

              <input
                type="time"
                value={safePolicies.checkOutTime}
                onChange={(e) =>
                  updateField("checkOutTime", e.target.value)
                }
                className={inputClass}
              />

              <p className={helperClass}>
                Standard time guests should check out.
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-ink-soft" />

            <h4 className="text-sm font-bold text-ink">
              Cancellation policy
            </h4>
          </div>

          <div>
            <label className={labelClass}>
              Policy type
            </label>

            <select
              value={safePolicies.cancellationPolicy}
              onChange={(e) =>
                updateField(
                  "cancellationPolicy",
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="flexible">Flexible</option>
              <option value="moderate">Moderate</option>
              <option value="strict">Strict</option>
              <option value="non_refundable">
                Non-refundable
              </option>
            </select>

            <p className={helperClass}>
              Determines how cancellation is handled for bookings.
            </p>
          </div>

          <div className="mt-5">
            <label className={labelClass}>
              Cancellation note
            </label>

            <textarea
              value={safePolicies.cancellationNote}
              onChange={(e) =>
                updateField(
                  "cancellationNote",
                  e.target.value
                )
              }
              placeholder="Describe your cancellation terms..."
              className={textareaClass}
            />

            <p className={helperClass}>
              This message can be displayed to guests before booking.
            </p>
          </div>
        </div>

        {/* Property rules */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Users size={16} className="text-ink-soft" />

            <h4 className="text-sm font-bold text-ink">
              Property rules
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PolicyToggle
              icon={PawPrint}
              title="Pets allowed"
              description="Guests may bring pets."
              checked={safePolicies.petsAllowed}
              onChange={(value) =>
                updateField("petsAllowed", value)
              }
            />

            <PolicyToggle
              icon={Cigarette}
              title="Smoking allowed"
              description="Smoking is permitted on the property."
              checked={safePolicies.smokingAllowed}
              onChange={(value) =>
                updateField("smokingAllowed", value)
              }
            />

            <PolicyToggle
              icon={PartyPopper}
              title="Parties allowed"
              description="Events and parties are permitted."
              checked={safePolicies.partiesAllowed}
              onChange={(value) =>
                updateField("partiesAllowed", value)
              }
            />

            <PolicyToggle
              icon={Users}
              title="Children allowed"
              description="Children are welcome at this property."
              checked={safePolicies.childrenAllowed}
              onChange={(value) =>
                updateField("childrenAllowed", value)
              }
            />
          </div>
        </div>

        {/* House rules */}
        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-ink-soft" />

              <div>
                <h4 className="text-sm font-bold text-ink">
                  House rules
                </h4>

                <p className="mt-1 text-[11px] text-ink-faint">
                  Add additional rules guests should know.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addHouseRule}
              className="
                inline-flex shrink-0 items-center gap-1.5
                rounded-xl bg-primary px-3 py-2
                text-xs font-bold text-ink
                transition hover:bg-primary-dark
              "
            >
              <Plus size={14} />
              Add rule
            </button>
          </div>

          <div className="space-y-3">
            {safePolicies.houseRules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line bg-surface-muted px-4 py-5 text-center">
                <p className="text-xs text-ink-faint">
                  No house rules added yet.
                </p>
              </div>
            ) : (
              safePolicies.houseRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) =>
                      updateHouseRule(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="e.g. No loud music after 10 PM"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => removeHouseRule(index)}
                    className="
                      mt-2 flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-xl border border-line
                      text-ink-faint
                      transition
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-red-500
                    "
                    aria-label="Remove house rule"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-primary/20 bg-primary-light/50 p-4">
          <p className="text-sm font-semibold text-ink">
            Guest-facing policies
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-soft">
            These policies can be shown on the hotel's details and
            booking pages so guests understand the property's rules
            before making a reservation.
          </p>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------
   POLICY TOGGLE
----------------------------------------------------------- */

const PolicyToggle = ({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        flex w-full items-center justify-between
        rounded-2xl border p-4 text-left
        transition-all duration-200
        ${
          checked
            ? "border-primary/40 bg-primary-light/50"
            : "border-line bg-white hover:border-primary/20 hover:bg-surface-muted"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-xl
            ${
              checked
                ? "bg-primary text-ink"
                : "bg-surface-muted text-ink-faint"
            }
          `}
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">
            {title}
          </p>

          <p className="mt-0.5 text-[11px] leading-4 text-ink-faint">
            {description}
          </p>
        </div>
      </div>

      <Toggle checked={checked} />
    </button>
  );
};

/* -----------------------------------------------------------
   TOGGLE
----------------------------------------------------------- */

const Toggle = ({ checked }) => {
  return (
    <span
      className={`
        relative ml-3 h-6 w-11 shrink-0 rounded-full
        transition-colors duration-200
        ${checked ? "bg-primary" : "bg-gray-200"}
      `}
    >
      <span
        className={`
          absolute top-1 h-4 w-4 rounded-full bg-white
          shadow-sm transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </span>
  );
};

export default PoliciesSection;
