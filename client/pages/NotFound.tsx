import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 dark:from-background dark:via-muted dark:to-background px-6 text-center transition-colors">
      <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
      <p className="text-2xl font-semibold text-foreground mb-2">
        Page Not Found
      </p>
      <p className="text-muted-foreground mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
