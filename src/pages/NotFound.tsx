import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <p className="text-2xl font-semibold mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
