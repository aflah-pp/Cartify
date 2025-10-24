import React from 'react';
import PlaceHolder from './PlaceHolder';

function PlaceHolderContainer() {
  const placeNumbers = [...Array(12).keys()];

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Loading Products...
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {placeNumbers.map((num) => (
          <div key={num} className="h-full">
            <PlaceHolder />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceHolderContainer;
