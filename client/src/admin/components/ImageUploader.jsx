import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2, Loader2 } from "lucide-react";

const ImageUploader = ({ images = [], onUpload, onDelete, onSetCover, uploading }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    if (files?.length) onUpload(files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl2 border-2 border-dashed py-10 text-center transition ${
          dragOver ? "border-primary-dark bg-primary/10" : "border-line bg-surface-muted hover:border-primary/50"
        }`}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-ink-soft" size={22} />
        ) : (
          <ImagePlus size={22} className="text-ink-soft" />
        )}
        <p className="mt-2 text-sm font-medium text-ink">
          {uploading ? "Uploading…" : "Click or drag photos here"}
        </p>
        <p className="mt-0.5 text-xs text-ink-faint">JPG, PNG or WEBP — up to 10 at once</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div key={img._id} className="group relative overflow-hidden rounded-xl border border-line">
              <img src={img.url} alt={img.caption || ""} className="h-28 w-full object-cover" />
              {img.isCover && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-ink">
                  <Star size={11} fill="currentColor" /> Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-end justify-end gap-1.5 bg-gradient-to-t from-ink/60 via-transparent to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                {!img.isCover && (
                  <button
                    type="button"
                    onClick={() => onSetCover(img._id)}
                    className="rounded-full bg-white/90 p-1.5 text-ink hover:bg-white"
                    title="Set as cover"
                  >
                    <Star size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(img._id)}
                  className="rounded-full bg-white/90 p-1.5 text-danger hover:bg-white"
                  title="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
