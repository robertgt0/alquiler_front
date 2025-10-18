'use client';

import React from 'react';

interface MarkerTooltipProps {
  fixerName: string;
  category: string;
  rating: number;
  price: number;
}

export const MarkerTooltip: React.FC<MarkerTooltipProps> = ({
  fixerName,
  category,
  rating,
  price
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
      <h3 className="font-bold text-gray-800 mb-2">{fixerName}</h3>
      <div className="space-y-1 text-sm">
        <p className="text-gray-600">
          <span className="font-semibold">Categoría:</span> {category}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Rating:</span> ⭐ {rating}/5
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Precio:</span> Bs. {price}
        </p>
      </div>
    </div>
  );
};