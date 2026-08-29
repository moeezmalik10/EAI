import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-32 text-center">
      <p className="font-serif text-6xl font-bold text-navy-800">404</p>
      <h1 className="font-serif text-2xl font-semibold text-navy-900">Page not found</h1>
      <p className="text-navy-500">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-2">
        Return Home
      </Link>
    </div>
  );
}
