const Spinner = ({ label = "Loading..." }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    <p className="text-sm text-muted">{label}</p>
  </div>
);

export default Spinner;
