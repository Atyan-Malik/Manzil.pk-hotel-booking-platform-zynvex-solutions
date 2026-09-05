import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
      <p className="text-sm text-ink-faint">
        Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        <button
          className="btn-ghost border border-line disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          className="btn-ghost border border-line disabled:opacity-40"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
