import { AlertTriangle, RotateCw } from "lucide-react";

const ErrorState = ({ message = "Unable to load this data. Please try again.", onRetry }) => (
  <div
    className="
      flex flex-col items-center justify-center gap-3
      rounded-[1.5rem] border border-red-100 bg-red-50/60
      px-6 py-14 text-center
    "
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
      <AlertTriangle size={22} className="text-red-500" />
    </div>
    <p className="font-display text-base font-bold text-ink">Something went wrong</p>
    <p className="max-w-sm text-sm text-muted">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="
          mt-2 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5
          text-sm font-bold text-white transition hover:bg-ink/90
        "
      >
        <RotateCw size={15} />
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
