import { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../layout/Topbar";
import ImageUploader from "../components/ImageUploader";
import {
  getHotelById,
  createHotel,
  updateHotel,
  uploadHotelImages,
  deleteHotelImage,
  setCoverImage,
} from "../services/adminHotelService";

const TABS = ["Basic info", "Amenities", "Policies", "Contact", "Photos"];

const AMENITY_CATEGORIES = ["general", "wellness", "food", "connectivity", "safety", "family", "accessibility"];

const emptyHotel = {
  name: "",
  shortDescription: "",
  description: "",
  starRating: 3,
  basePrice: "",
  currency: "PKR",
  location: { address: "", city: "", area: "" },
  amenities: [],
  policies: {
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "moderate",
    cancellationNote: "",
    petsAllowed: false,
    smokingAllowed: false,
    partiesAllowed: false,
    childrenAllowed: true,
    houseRules: [],
  },
  contact: { phone: "", whatsapp: "", email: "", website: "" },
  images: [],
  status: "draft",
  featured: false,
};

const HotelForm = () => {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [tab, setTab] = useState(0);
  const [hotel, setHotel] = useState(emptyHotel);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [amenityDraft, setAmenityDraft] = useState({ name: "", category: "general" });
  const [ruleDraft, setRuleDraft] = useState("");

  useEffect(() => {
    if (isEdit) {
      getHotelById(id)
        .then(setHotel)
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const set = (path, value) => {
    setHotel((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys.at(-1)] = value;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...hotel, basePrice: Number(hotel.basePrice) };
      delete payload.images;
      if (isEdit) {
        await updateHotel(id, payload);
        toast.success("Hotel updated");
      } else {
        const created = await createHotel(payload);
        toast.success("Hotel created — now add some photos");
        navigate(`/admin/hotels/${created._id}`, { replace: true });
        setTab(4);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save this hotel");
    } finally {
      setSaving(false);
    }
  };

  const addAmenity = () => {
    if (!amenityDraft.name.trim()) return;
    set("amenities", [...hotel.amenities, amenityDraft]);
    setAmenityDraft({ name: "", category: "general" });
  };

  const removeAmenity = (idx) => set("amenities", hotel.amenities.filter((_, i) => i !== idx));

  const addRule = () => {
    if (!ruleDraft.trim()) return;
    set("policies.houseRules", [...hotel.policies.houseRules, ruleDraft.trim()]);
    setRuleDraft("");
  };

  const removeRule = (idx) =>
    set("policies.houseRules", hotel.policies.houseRules.filter((_, i) => i !== idx));

  const handleImageUpload = async (files) => {
    setUploading(true);
    try {
      const images = await uploadHotelImages(id, files);
      setHotel((prev) => ({ ...prev, images }));
      toast.success("Photos uploaded");
    } catch {
      toast.error("Upload failed. Check your Cloudinary credentials.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    const images = await deleteHotelImage(id, imageId);
    setHotel((prev) => ({ ...prev, images }));
  };

  const handleSetCover = async (imageId) => {
    const images = await setCoverImage(id, imageId);
    setHotel((prev) => ({ ...prev, images }));
  };

  if (loading) return <p className="p-8 text-sm text-ink-faint">Loading hotel…</p>;

  return (
    <>
      <Topbar
        title={isEdit ? `Edit ${hotel.name}` : "Add a new hotel"}
        subtitle={isEdit ? "Update property details, photos and policies" : "Fill in the details to list a new property"}
        onMenuClick={openSidebar}
        actions={
          <button className="btn-ghost gap-1.5" onClick={() => navigate("/admin/hotels")}>
            <ArrowLeft size={15} /> All hotels
          </button>
        }
      />
      <main className="flex-1 px-5 py-6 md:px-8">
        <div className="mb-5 flex gap-1.5 overflow-x-auto">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(i)}
              disabled={i === 4 && !isEdit}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-40 ${
                tab === i ? "bg-ink text-white" : "bg-white text-ink-soft border border-line hover:border-ink/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 0 && (
            <div className="card space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label">Hotel name</label>
                  <input required className="field-input" value={hotel.name} onChange={(e) => set("name", e.target.value)} placeholder="Serena Islamabad" />
                </div>
                <div>
                  <label className="field-label">Star rating</label>
                  <select className="field-input" value={hotel.starRating} onChange={(e) => set("starRating", Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">Short description</label>
                <input className="field-input" maxLength={200} value={hotel.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="One line shown on search results" />
              </div>

              <div>
                <label className="field-label">Full description</label>
                <textarea required rows={5} className="field-textarea" value={hotel.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the property, its setting and what makes it stand out…" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label">Base price / night</label>
                  <input required type="number" min="0" className="field-input" value={hotel.basePrice} onChange={(e) => set("basePrice", e.target.value)} placeholder="15000" />
                </div>
                <div>
                  <label className="field-label">Currency</label>
                  <input className="field-input" value={hotel.currency} onChange={(e) => set("currency", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className="field-label">City</label>
                  <input required className="field-input" value={hotel.location.city} onChange={(e) => set("location.city", e.target.value)} placeholder="Islamabad" />
                </div>
                <div>
                  <label className="field-label">Area / neighbourhood</label>
                  <input className="field-input" value={hotel.location.area} onChange={(e) => set("location.area", e.target.value)} placeholder="F-8" />
                </div>
                <div>
                  <label className="field-label">Full address</label>
                  <input required className="field-input" value={hotel.location.address} onChange={(e) => set("location.address", e.target.value)} placeholder="Street, sector, city" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-line bg-surface-muted px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Publish status</p>
                  <p className="text-xs text-ink-faint">Draft hotels aren't visible to guests</p>
                </div>
                <select className="field-input w-40" value={hotel.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="card space-y-5">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[160px]">
                  <label className="field-label">Amenity</label>
                  <input className="field-input" value={amenityDraft.name} onChange={(e) => setAmenityDraft({ ...amenityDraft, name: e.target.value })} placeholder="Free WiFi" />
                </div>
                <div className="w-44">
                  <label className="field-label">Category</label>
                  <select className="field-input" value={amenityDraft.category} onChange={(e) => setAmenityDraft({ ...amenityDraft, category: e.target.value })}>
                    {AMENITY_CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <button type="button" className="btn-secondary" onClick={addAmenity}>
                  <Plus size={15} /> Add
                </button>
              </div>

              {hotel.amenities.length === 0 ? (
                <p className="text-sm text-ink-faint">No amenities added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((a, i) => (
                    <span key={i} className="flex items-center gap-2 rounded-full border border-line bg-surface-muted px-3 py-1.5 text-sm">
                      {a.name} <span className="text-ink-faint text-xs capitalize">· {a.category}</span>
                      <button type="button" onClick={() => removeAmenity(i)} className="text-ink-faint hover:text-danger">
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 2 && (
            <div className="card space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label">Check-in time</label>
                  <input type="time" className="field-input" value={hotel.policies.checkInTime} onChange={(e) => set("policies.checkInTime", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Check-out time</label>
                  <input type="time" className="field-input" value={hotel.policies.checkOutTime} onChange={(e) => set("policies.checkOutTime", e.target.value)} />
                </div>
              </div>

              <div>
                <label className="field-label">Cancellation policy</label>
                <select className="field-input" value={hotel.policies.cancellationPolicy} onChange={(e) => set("policies.cancellationPolicy", e.target.value)}>
                  <option value="flexible">Flexible</option>
                  <option value="moderate">Moderate</option>
                  <option value="strict">Strict</option>
                  <option value="non_refundable">Non-refundable</option>
                </select>
              </div>

              <div>
                <label className="field-label">Cancellation note</label>
                <input className="field-input" value={hotel.policies.cancellationNote} onChange={(e) => set("policies.cancellationNote", e.target.value)} placeholder="Free cancellation up to 24 hours before check-in" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["petsAllowed", "Pets allowed"],
                  ["smokingAllowed", "Smoking allowed"],
                  ["partiesAllowed", "Parties allowed"],
                  ["childrenAllowed", "Children welcome"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-xl border border-line bg-surface-muted px-3 py-2.5 text-sm">
                    <input type="checkbox" className="accent-primary-dark" checked={hotel.policies[key]} onChange={(e) => set(`policies.${key}`, e.target.checked)} />
                    {label}
                  </label>
                ))}
              </div>

              <div>
                <label className="field-label">House rules</label>
                <div className="flex gap-2">
                  <input className="field-input" value={ruleDraft} onChange={(e) => setRuleDraft(e.target.value)} placeholder="No loud music after 11 PM" />
                  <button type="button" className="btn-secondary shrink-0" onClick={addRule}><Plus size={15} /></button>
                </div>
                {hotel.policies.houseRules.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {hotel.policies.houseRules.map((r, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-sm">
                        {r}
                        <button type="button" onClick={() => removeRule(i)} className="text-ink-faint hover:text-danger"><X size={14} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === 3 && (
            <div className="card grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Phone</label>
                <input className="field-input" value={hotel.contact.phone} onChange={(e) => set("contact.phone", e.target.value)} placeholder="+92 51 1234567" />
              </div>
              <div>
                <label className="field-label">WhatsApp</label>
                <input className="field-input" value={hotel.contact.whatsapp} onChange={(e) => set("contact.whatsapp", e.target.value)} placeholder="+92 300 1234567" />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" className="field-input" value={hotel.contact.email} onChange={(e) => set("contact.email", e.target.value)} placeholder="frontdesk@hotel.com" />
              </div>
              <div>
                <label className="field-label">Website</label>
                <input className="field-input" value={hotel.contact.website} onChange={(e) => set("contact.website", e.target.value)} placeholder="https://" />
              </div>
            </div>
          )}

          {tab === 4 && isEdit && (
            <div className="card">
              <ImageUploader
                images={hotel.images}
                uploading={uploading}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
                onSetCover={handleSetCover}
              />
            </div>
          )}

          {tab !== 4 && (
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => navigate("/admin/hotels")}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isEdit ? "Save changes" : "Create hotel"}
              </button>
            </div>
          )}
        </form>
      </main>
    </>
  );
};

export default HotelForm;
