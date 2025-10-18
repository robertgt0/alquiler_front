'use client';

import React from 'react';
import { Offer } from '../interfaces/types';
import { calculateDistance, formatDistance } from '../utils/mapHelpers';

interface OfferDetailModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number };
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offer,
  isOpen,
  onClose,
  userLocation
}) => {
  if (!isOpen || !offer) return null;

  const distance = calculateDistance(userLocation, offer.location);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-bold">{offer.fixerName}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-2 transition text-2xl font-bold leading-none"
            title="Cerrar"
          >
            X
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              {offer.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">⭐</span>
              <span className="font-bold text-lg text-gray-800">{offer.rating}/5</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Descripcion:</h3>
            <p className="text-gray-700">{offer.description}</p>
          </div>

          {offer.images && offer.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Galeria de trabajos:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {offer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={'Trabajo ' + (index + 1)}
                    className="w-full h-32 object-cover rounded-lg shadow hover:scale-105 transition"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">Distancia:</p>
              <p className="font-bold text-lg text-gray-800">{formatDistance(distance)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">Precio:</p>
              <p className="font-bold text-lg text-green-600">Bs. {offer.price}</p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={'https://wa.me/' + offer.whatsapp.replace('+', '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold w-full"
            >
              Contactar por WhatsApp
            </a>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};