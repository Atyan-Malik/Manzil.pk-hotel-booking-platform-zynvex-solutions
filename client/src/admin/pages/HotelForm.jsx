
import { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Save,
  Hotel as HotelIcon,
  Star,
  Image as ImageIcon,
  Check,
  Trash2,
  Contact as ContactIcon,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import Topbar from "../layout/Topbar";
import ImageUploader from "../components/ImageUploader";
import ContactSection from "../components/ContactSection";
import PoliciesSection from "../components/PoliciesSection";

import {
  getHotelById,
  createHotel,
  updateHotel,
  uploadHotelImages,
  deleteHotelImage,
  setCoverImage,
} from "../services/adminHotelService";

const TABS = [
  {
    label: "Basic information",
    icon: HotelIcon,
  },
  {
    label: "Amenities",
    icon: Check,
  },
  {
    label: "Contact",
    icon: ContactIcon,
  },
  {
    label: "Policies",
    icon: ShieldCheck,
  },
  {
    label: "Photos",
    icon: ImageIcon,
  },
];

const AMENITY_CATEGORIES = [
  "general",
  "wellness",
  "food",
  "connectivity",
  "safety",
  "family",
  "accessibility",
];

const emptyHotel = {
  name: "",
  shortDescription: "",
  description: "",
  starRating: 3,
  basePrice: "",
  currency: "PKR",

  location: {
    address: "",
    city: "",
    area: "",
    lat: "",
    lng: "",
  },

  amenities: [],

  contact: {
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
  },

  policies: {
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
  },

  images: [],

  status: "draft",
  featured: false,
};

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-ink-faint/60 focus:border-primary focus:ring-4 focus:ring-primary/10";

const textareaClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-ink-faint/60 focus:border-primary focus:ring-4 focus:ring-primary/10";

const labelClass = "block text-sm font-semibold text-ink";

const helperClass = "mt-1 text-xs text-ink-faint";

const HotelForm = () => {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [tab, setTab] = useState(0);
  const [hotel, setHotel] = useState(emptyHotel);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [amenityDraft, setAmenityDraft] = useState({
    name: "",
    category: "general",
  });

  /*
   * LOAD HOTEL
   */
  useEffect(() => {
    if (!isEdit) return;

    const loadHotel = async () => {
      try {
        const data = await getHotelById(id);

        setHotel({
          ...emptyHotel,
          ...data,

          location: {
            ...emptyHotel.location,
            ...(data.location || {}),
          },

          contact: {
            ...emptyHotel.contact,
            ...(data.contact || {}),
          },

          policies: {
            ...emptyHotel.policies,
            ...(data.policies || {}),
          },

          amenities: data.amenities || [],
          images: data.images || [],
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Could not load hotel"
        );

        navigate("/admin/hotels");
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [id, isEdit, navigate]);

  /*
   * NESTED STATE HELPER
   *
   * Example:
   * set("contact.phone", "03001234567")
   * set("policies.petsAllowed", true)
   */
  const set = (path, value) => {
    setHotel((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");

      let current = next;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return next;
    });
  };

  /*
   * SUBMIT HOTEL
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
     * BASIC VALIDATION
     */
    if (!hotel.name.trim()) {
      toast.error("Hotel name is required");
      setTab(0);
      return;
    }

    if (!hotel.description.trim()) {
      toast.error("Hotel description is required");
      setTab(0);
      return;
    }

    if (!hotel.location.city.trim()) {
      toast.error("City is required");
      setTab(0);
      return;
    }

    if (!hotel.location.address.trim()) {
      toast.error("Hotel address is required");
      setTab(0);
      return;
    }

    if (
      hotel.basePrice === "" ||
      hotel.basePrice === null ||
      Number(hotel.basePrice) < 0
    ) {
      toast.error("Please enter a valid base price");
      setTab(0);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...hotel,
        basePrice: Number(hotel.basePrice),
      };

      /*
       * Images are managed separately through Cloudinary.
       */
      delete payload.images;

      if (isEdit) {
        await updateHotel(id, payload);

        toast.success("Hotel updated successfully");
      } else {
        const created = await createHotel(payload);

        toast.success("Hotel created successfully");

        /*
         * After creation we now have an ID,
         * so the Photos tab becomes available.
         */
        navigate(`/admin/hotels/${created._id}`, {
          replace: true,
        });

        setTab(4);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not save this hotel"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ADD AMENITY
   */
  const addAmenity = () => {
    const name = amenityDraft.name.trim();

    if (!name) {
      toast.error("Enter an amenity name");
      return;
    }

    const alreadyExists = hotel.amenities.some(
      (amenity) =>
        amenity.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      toast.error("This amenity has already been added");
      return;
    }

    set("amenities", [
      ...hotel.amenities,
      {
        name,
        category: amenityDraft.category,
      },
    ]);

    setAmenityDraft({
      name: "",
      category: "general",
    });
  };

  /*
   * REMOVE AMENITY
   */
  const removeAmenity = (index) => {
    set(
      "amenities",
      hotel.amenities.filter((_, i) => i !== index)
    );
  };

  /*
   * IMAGE UPLOAD
   */
  const handleImageUpload = async (files) => {
    if (!isEdit) return;

    setUploading(true);

    try {
      const images = await uploadHotelImages(id, files);

      setHotel((prev) => ({
        ...prev,
        images,
      }));

      toast.success("Photos uploaded successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Photo upload failed. Check your Cloudinary configuration."
      );
    } finally {
      setUploading(false);
    }
  };

  /*
   * IMAGE DELETE
   */
  const handleImageDelete = async (imageId) => {
    try {
      const images = await deleteHotelImage(id, imageId);

      setHotel((prev) => ({
        ...prev,
        images,
      }));

      toast.success("Photo deleted");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not delete photo"
      );
    }
  };

  /*
   * SET COVER IMAGE
   */
  const handleSetCover = async (imageId) => {
    try {
      const images = await setCoverImage(id, imageId);

      setHotel((prev) => ({
        ...prev,
        images,
      }));

      toast.success("Cover photo updated");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not update cover photo"
      );
    }
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-ink-faint">
          <Loader2
            size={17}
            className="animate-spin"
          />
          Loading hotel...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* TOPBAR */}
      <Topbar
        title={
          isEdit
            ? `Edit ${hotel.name}`
            : "Add a new hotel"
        }
        subtitle={
          isEdit
            ? "Update property details, policies and photos"
            : "Create a new property for Manzil.pk"
        }
        onMenuClick={openSidebar}
        actions={
          <button
            type="button"
            onClick={() => navigate("/admin/hotels")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-ink/20 hover:text-ink"
          >
            <ArrowLeft size={15} />

            <span className="hidden sm:inline">
              All hotels
            </span>
          </button>
        }
      />

      <main className="flex-1 bg-surface-muted px-4 py-5 sm:px-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          {/* PAGE HEADING */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-ink">
                <HotelIcon size={19} />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  {isEdit
                    ? "Property details"
                    : "Create property"}
                </h2>

                <p className="text-xs text-ink-faint">
                  Add accurate information guests can rely on.
                </p>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="mb-5 overflow-x-auto">
            <div className="inline-flex min-w-full gap-1 rounded-2xl border border-line bg-white p-1 sm:min-w-0">
              {TABS.map((item, index) => {
                const Icon = item.icon;
                const active = tab === index;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTab(index)}
                    disabled={index === 4 && !isEdit}
                    className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:min-w-[150px] ${
                      active
                        ? "bg-ink text-white shadow-sm"
                        : "text-ink-soft hover:bg-surface-muted hover:text-ink"
                    } ${
                      index === 4 && !isEdit
                        ? "cursor-not-allowed opacity-40"
                        : ""
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ======================================================
                BASIC INFORMATION
            ====================================================== */}
            {tab === 0 && (
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="border-b border-line px-5 py-4 sm:px-6">
                  <h3 className="font-display text-base font-bold text-ink">
                    Basic information
                  </h3>

                  <p className="mt-1 text-xs text-ink-faint">
                    Core information about the hotel and its location.
                  </p>
                </div>

                <div className="space-y-6 p-5 sm:p-6">
                  {/* NAME + RATING */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_180px]">
                    <div>
                      <label className={labelClass}>
                        Hotel name
                      </label>

                      <input
                        required
                        className={inputClass}
                        value={hotel.name}
                        onChange={(e) =>
                          set("name", e.target.value)
                        }
                        placeholder="e.g. Serena Islamabad"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Star rating
                      </label>

                      <div className="relative">
                        <Star
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 fill-primary text-primary"
                        />

                        <select
                          className={`${inputClass} pl-9`}
                          value={hotel.starRating}
                          onChange={(e) =>
                            set(
                              "starRating",
                              Number(e.target.value)
                            )
                          }
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option
                              key={n}
                              value={n}
                            >
                              {n} star
                              {n > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <div>
                    <label className={labelClass}>
                      Short description
                    </label>

                    <input
                      maxLength={200}
                      className={inputClass}
                      value={hotel.shortDescription}
                      onChange={(e) =>
                        set(
                          "shortDescription",
                          e.target.value
                        )
                      }
                      placeholder="A short summary shown in search results"
                    />

                    <p className={helperClass}>
                      Keep it concise. Maximum 200 characters.
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className={labelClass}>
                      Full description
                    </label>

                    <textarea
                      required
                      rows={5}
                      className={textareaClass}
                      value={hotel.description}
                      onChange={(e) =>
                        set(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe the property, rooms, location, atmosphere and what makes it special..."
                    />
                  </div>

                  {/* PRICE */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_150px]">
                    <div>
                      <label className={labelClass}>
                        Base price / night
                      </label>

                      <input
                        required
                        type="number"
                        min="0"
                        className={inputClass}
                        value={hotel.basePrice}
                        onChange={(e) =>
                          set(
                            "basePrice",
                            e.target.value
                          )
                        }
                        placeholder="15000"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Currency
                      </label>

                      <select
                        className={inputClass}
                        value={hotel.currency}
                        onChange={(e) =>
                          set(
                            "currency",
                            e.target.value
                          )
                        }
                      >
                        <option value="PKR">
                          PKR
                        </option>
                        <option value="USD">
                          USD
                        </option>
                        <option value="AED">
                          AED
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* LOCATION */}
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-ink">
                        Location
                      </h4>

                      <p className="mt-1 text-xs text-ink-faint">
                        Where guests can find this property.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          City
                        </label>

                        <input
                          required
                          className={inputClass}
                          value={hotel.location.city}
                          onChange={(e) =>
                            set(
                              "location.city",
                              e.target.value
                            )
                          }
                          placeholder="Islamabad"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Area / neighbourhood
                        </label>

                        <input
                          className={inputClass}
                          value={hotel.location.area}
                          onChange={(e) =>
                            set(
                              "location.area",
                              e.target.value
                            )
                          }
                          placeholder="F-8"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelClass}>
                          Full address
                        </label>

                        <input
                          required
                          className={inputClass}
                          value={hotel.location.address}
                          onChange={(e) =>
                            set(
                              "location.address",
                              e.target.value
                            )
                          }
                          placeholder="Street, sector, city"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        Publishing status
                      </p>

                      <p className="mt-1 text-xs text-ink-faint">
                        Draft hotels aren't visible to guests.
                      </p>
                    </div>

                    <select
                      className="h-10 rounded-xl border border-line bg-white px-3 text-sm font-medium text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-40"
                      value={hotel.status}
                      onChange={(e) =>
                        set(
                          "status",
                          e.target.value
                        )
                      }
                    >
                      <option value="draft">
                        Draft
                      </option>

                      <option value="active">
                        Active
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>
                      <option value="approved">
                        Approved
                      </option>
                    </select>
                  </div>

                  {/* FEATURED */}
                  <div className="flex items-center justify-between rounded-2xl border border-line bg-surface-muted p-4">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        Featured hotel
                      </p>

                      <p className="mt-1 text-xs text-ink-faint">
                        Highlight this hotel on the platform.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "featured",
                          !hotel.featured
                        )
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        hotel.featured
                          ? "bg-primary"
                          : "bg-ink/15"
                      }`}
                      aria-label="Toggle featured hotel"
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          hotel.featured
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================
                AMENITIES
            ====================================================== */}
            {tab === 1 && (
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="border-b border-line px-5 py-4 sm:px-6">
                  <h3 className="font-display text-base font-bold text-ink">
                    Hotel amenities
                  </h3>

                  <p className="mt-1 text-xs text-ink-faint">
                    Add facilities and services available at the property.
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
                    <div>
                      <label className={labelClass}>
                        Amenity
                      </label>

                      <input
                        className={inputClass}
                        value={amenityDraft.name}
                        onChange={(e) =>
                          setAmenityDraft({
                            ...amenityDraft,
                            name: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addAmenity();
                          }
                        }}
                        placeholder="Free WiFi"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Category
                      </label>

                      <select
                        className={inputClass}
                        value={amenityDraft.category}
                        onChange={(e) =>
                          setAmenityDraft({
                            ...amenityDraft,
                            category: e.target.value,
                          })
                        }
                      >
                        {AMENITY_CATEGORIES.map(
                          (category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category
                                .charAt(0)
                                .toUpperCase() +
                                category.slice(1)}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={addAmenity}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink/90"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>

                  <div className="my-6 h-px bg-line" />

                  {hotel.amenities.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line bg-surface-muted px-6 py-10 text-center">
                      <Check
                        size={22}
                        className="mx-auto text-ink-faint"
                      />

                      <p className="mt-3 text-sm font-semibold text-ink">
                        No amenities added
                      </p>

                      <p className="mt-1 text-xs text-ink-faint">
                        Add facilities such as WiFi, parking,
                        pool or gym.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {hotel.amenities.map(
                        (amenity, index) => (
                          <div
                            key={`${amenity.name}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-line bg-surface-muted px-3.5 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-ink">
                                {amenity.name}
                              </p>

                              <p className="mt-0.5 text-xs capitalize text-ink-faint">
                                {amenity.category}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeAmenity(index)
                              }
                              className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-faint transition hover:bg-danger/10 hover:text-danger"
                              aria-label={`Remove ${amenity.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================
                CONTACT
            ====================================================== */}
            {tab === 2 && (
              <ContactSection
                contact={hotel.contact}
                set={set}
                inputClass={inputClass}
                labelClass={labelClass}
                helperClass={helperClass}
              />
            )}

            {/* ======================================================
                POLICIES
            ====================================================== */}
            {tab === 3 && (
              <PoliciesSection
                policies={hotel.policies}
                set={set}
                inputClass={inputClass}
                textareaClass={textareaClass}
                labelClass={labelClass}
                helperClass={helperClass}
              />
            )}

            {/* ======================================================
                PHOTOS
            ====================================================== */}
            {tab === 4 && isEdit && (
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="border-b border-line px-5 py-4 sm:px-6">
                  <h3 className="font-display text-base font-bold text-ink">
                    Property photos
                  </h3>

                  <p className="mt-1 text-xs text-ink-faint">
                    Upload high-quality photos of the hotel and its rooms.
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <ImageUploader
                    images={hotel.images}
                    uploading={uploading}
                    onUpload={handleImageUpload}
                    onDelete={handleImageDelete}
                    onSetCover={handleSetCover}
                  />
                </div>
              </div>
            )}

            {/* ======================================================
                ACTIONS
            ====================================================== */}

            {tab !== 4 && (
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/hotels")
                  }
                  className="h-11 rounded-xl border border-line bg-white px-5 text-sm font-semibold text-ink-soft transition hover:border-ink/20 hover:text-ink"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-ink transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />

                      {isEdit
                        ? "Save changes"
                        : "Create hotel"}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* PHOTO TAB ACTION */}
            {tab === 4 && isEdit && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/hotels")
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
                >
                  <ArrowLeft size={16} />
                  Back to hotels
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default HotelForm;
