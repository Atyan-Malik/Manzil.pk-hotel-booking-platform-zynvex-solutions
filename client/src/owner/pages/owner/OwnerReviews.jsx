import { useEffect, useState, useCallback } from "react";
import { Star, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import { getMyHotels } from "../../../services/hotelService";
import { getHotelReviews, replyToReview } from "../../../services/reviewService";

import Spinner from "../../components/owner/Spinner";
import ErrorState from "../../components/owner/ErrorState";
import EmptyState from "../../components/owner/EmptyState";

const OwnerReviews = () => {
  const [status, setStatus] = useState("loading");
  const [reviews, setReviews] = useState([]);
  const [hotelsById, setHotelsById] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { hotels } = await getMyHotels();
      const map = Object.fromEntries(hotels.map((h) => [h._id, h]));
      setHotelsById(map);

      const results = await Promise.all(
        hotels.map((h) => getHotelReviews(h._id).catch(() => ({ reviews: [] })))
      );
      const all = results.flatMap((r, i) =>
        (r.reviews || []).map((rev) => ({ ...rev, hotel: hotels[i]._id }))
      );
      all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(all);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReply = async (reviewId) => {
    const reply = (replyDrafts[reviewId] || "").trim();
    if (!reply) {
      toast.error("Write a reply first.");
      return;
    }

    setSavingId(reviewId);
    try {
      const data = await replyToReview(reviewId, reply);
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, managerReply: data.review.managerReply } : r))
      );
      toast.success("Reply posted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post reply.");
    } finally {
      setSavingId(null);
    }
  };

  if (status === "loading") return <Spinner label="Loading reviews..." />;
  if (status === "error") return <ErrorState onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Reviews</h1>
      <p className="mt-1 text-sm text-muted">What guests are saying about your hotels.</p>

      {reviews.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Star}
            title="No reviews yet"
            description="Reviews from your guests will appear here once they check out."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-bold text-ink">
                    {review.customer?.name || "Guest"}
                  </p>
                  <p className="text-xs text-muted">{hotelsById[review.hotel]?.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < review.rating ? "fill-[#8FE13D] text-[#8FE13D]" : "text-[#E2E8DE]"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-ink/80">{review.comment}</p>

              {review.managerReply ? (
                <div className="mt-4 rounded-xl bg-[#F8FAF5] p-3">
                  <p className="text-xs font-bold text-[#5F9824]">Your reply</p>
                  <p className="mt-1 text-sm text-ink/80">{review.managerReply}</p>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={replyDrafts[review._id] || ""}
                    onChange={(e) =>
                      setReplyDrafts((d) => ({ ...d, [review._id]: e.target.value }))
                    }
                    placeholder="Write a reply..."
                    className="flex-1 rounded-xl border border-[#E2E8DE] px-3.5 py-2 text-sm outline-none focus:border-[#8FE13D]"
                  />
                  <button
                    onClick={() => handleReply(review._id)}
                    disabled={savingId === review._id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-ink/90 disabled:opacity-60"
                  >
                    <MessageSquare size={14} />
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerReviews;
