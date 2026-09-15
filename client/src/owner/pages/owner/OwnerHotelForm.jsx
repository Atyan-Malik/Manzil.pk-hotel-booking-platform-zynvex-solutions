import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

import { getHotel, createHotel, updateHotel } from "../../../services/hotelService";
import { getAmenities } from "../../../services/amenities";
import { PAKISTAN_CITIES } from "../../../utils/constants";

import Spinner from "../../components/owner/Spinner";
import ErrorState from "../../components/owner/ErrorState";

const inputClass =
  "w-full rounded-xl border border-[#E2E8DE] bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-[#8FE13D] focus:ring-2 focus:ring-[#8FE13D]/30";

const emptyForm = {
  name: "",
  description: "",
  city: "",
  address: "",
  contactPhone: "",
  contactEmail: "",
  starRating: 3,
  amenities: [],
  policies: {
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
  },
};

const OwnerHotelForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [status, setStatus] = useState(isEdit ? "loading" : "ready");
  const [amenityOptions, setAmenityOptions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAmenities()
      .then((data) => setAmenityOptions(data.amenities || []))
      .catch(() => setAmenityOptions([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getHotel(id)
      .then((data) => {
        const h = data.hotel;
        setForm({
          name: h.name || "",
          description: h.description || "",
          city: h.city || "",
          address: h.address || "",
          contactPhone: h.contactPhone || "",
          contactEmail: h.contactEmail || "",
          starRating: h.starRating || 3,
          amenities: (h.amenities || []).map((a) => a._id || a),
          policies: {
            checkInTime: h.policies?.checkInTime || "14:00",
            checkOutTime: h.policies?.checkOutTime || "12:00",
            cancellationPolicy:
              h.policies?.cancellationPolicy ||
              "Free cancellation up to 24 hours before check-in",
          },
        });
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id, isEdit]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const updatePolicy = (field, value) =>
    setForm((f) => ({ ...f, policies: { ...f.policies, [field]: value } }));

  const toggleAmenity = (amenityId) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenityId)
        ? f.amenities.filter((a) => a !== amenityId)
        : [...f.amenities, amenityId],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.city || !form.address) {
      toast.error("Please fill in name, description, city, and address.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateHotel(id, form);
        toast.success("Hotel updated.");
      } else {
        await createHotel(form);
        toast.success("Hotel submitted for review.");
      }
      navigate("/owner/hotels");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save hotel.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return <Spinner label="Loading hotel..." />;
  if (status === "error") return <ErrorState message="Could not load this hotel." />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/owner/hotels"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft size={15} />
        Back to My Hotels
      </Link>

      <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">
        {isEdit ? "Edit Hotel" : "Add a New Hotel"}
      </h1>
      {!isEdit && (
        <p className="mt-1 text-sm text-muted">
          New listings are reviewed by our team before they go live on Manzil.pk.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5 sm:p-6"
      >
        {/* Basic info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hotel Name" required>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Serena View Hotel"
            />
          </Field>

          <Field label="City" required>
            <select
              className={inputClass}
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            >
              <option value="">Select a city</option>
              {PAKISTAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Description" required>
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe your property..."
          />
        </Field>

        <Field label="Address" required>
          <input
            className={inputClass}
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Street, area, landmark"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact Phone">
            <input
              className={inputClass}
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              placeholder="03xx-xxxxxxx"
            />
          </Field>
          <Field label="Contact Email">
            <input
              type="email"
              className={inputClass}
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              placeholder="reservations@yourhotel.com"
            />
          </Field>
        </div>

        <Field label="Star Rating">
          <select
            className={`${inputClass} max-w-[140px]`}
            value={form.starRating}
            onChange={(e) => update("starRating", Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </Field>

        {/* Amenities */}
        <Field label="Amenities">
          {amenityOptions.length === 0 ? (
            <p className="text-sm text-muted">No amenities configured yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((a) => {
                const active = form.amenities.includes(a._id);
                return (
                  <button
                    type="button"
                    key={a._id}
                    onClick={() => toggleAmenity(a._id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-[#8FE13D] bg-[#8FE13D]/20 text-[#3F6019]"
                        : "border-[#E2E8DE] text-muted hover:border-[#CFE5B9]"
                    }`}
                  >
                    {a.name}
                  </button>
                );
              })}
            </div>
          )}
        </Field>

        {/* Policies */}
        <div className="rounded-2xl bg-[#F8FAF5] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Policies</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Check-in Time">
              <input
                type="time"
                className={inputClass}
                value={form.policies.checkInTime}
                onChange={(e) => updatePolicy("checkInTime", e.target.value)}
              />
            </Field>
            <Field label="Check-out Time">
              <input
                type="time"
                className={inputClass}
                value={form.policies.checkOutTime}
                onChange={(e) => updatePolicy("checkOutTime", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Cancellation Policy" className="mt-4">
            <textarea
              className={`${inputClass} min-h-[70px]`}
              value={form.policies.cancellationPolicy}
              onChange={(e) => updatePolicy("cancellationPolicy", e.target.value)}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/owner/hotels"
            className="rounded-xl border border-[#E2E8DE] px-4 py-2.5 text-sm font-bold text-ink hover:bg-[#F1F6EC]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8FE13D] px-5 py-2.5 text-sm font-bold text-[#17210F] transition hover:bg-[#9BEA4E] disabled:opacity-60"
          >
            <Save size={16} />
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Submit for Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, required, children, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-xs font-bold text-ink">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
  </label>
);

export default OwnerHotelForm;
