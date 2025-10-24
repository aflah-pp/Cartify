import React from 'react';

function Page404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-300">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default Page404;
