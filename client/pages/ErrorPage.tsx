import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 px-6 text-center">
      <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </p>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
