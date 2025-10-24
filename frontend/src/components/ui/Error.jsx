import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

function Error({ error }) {
  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="bg-white/90 backdrop-blur-lg border border-red-200 rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops,{error || "An unexpected error occurred."}</h1>
        </div>
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-300"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;
