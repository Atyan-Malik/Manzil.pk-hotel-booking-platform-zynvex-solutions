import { Star } from "lucide-react";
import { formatDate } from "../utils/helpers";

const ReviewList = ({ reviews }) => {
  if (!reviews?.length) {
    return <p className="text-sm text-muted">No reviews yet. Be the first to stay and share your experience.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-slateline pb-6 last:border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 font-display text-sm font-bold text-accent-dark">
                {review.customer?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{review.customer?.name}</p>
                <p className="text-xs text-muted">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-ink">
              <Star size={14} className="fill-accent-dark text-accent-dark" />
              {review.rating}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">{review.comment}</p>
          {review.managerReply && (
            <div className="mt-3 rounded-xl bg-surface p-3">
              <p className="text-xs font-semibold text-muted">Response from the property</p>
              <p className="mt-1 text-sm text-ink">{review.managerReply}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
