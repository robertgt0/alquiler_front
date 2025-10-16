'use client';

import React from 'react';

interface MapControlsProps {
  onCenterUser: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onCenterUser,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={onCenterUser}
        className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
        title="Centrar en mi ubicación"
      >
        📍
      </button>
      <button
        onClick={onZoomIn}
        className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
        title="Acercar"
      >
        ➕
      </button>
      <button
        onClick={onZoomOut}
        className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
        title="Alejar"
      >
        ➖
      </button>
    </div>
  );
};