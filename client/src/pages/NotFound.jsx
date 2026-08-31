import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-accent mt-6 px-6 py-2.5 text-sm">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
