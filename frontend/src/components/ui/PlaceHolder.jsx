import React from 'react';

function PlaceHolder() {
  return (
    <div className="h-full border rounded-xl shadow-lg p-4 bg-white animate-pulse flex flex-col justify-between">
      {/* Simulated image */}
      <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>

      {/* Simulated title */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* Simulated price */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>

      {/* Simulated button */}
      <div className="h-10 bg-gray-300 rounded w-full"></div>
    </div>
  );
}

export default PlaceHolder;
