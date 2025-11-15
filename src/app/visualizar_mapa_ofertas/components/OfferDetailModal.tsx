'use client';

import React, { useState, useEffect } from 'react';
import { Offer } from '../interfaces/types';
import { calculateDistance, formatDistance } from '../utils/mapHelpers';
import { getMarkerIcon } from '../config/markerIcons';

interface OfferDetailModalProps {
  offers?: Offer[];
  isOpen: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number };
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offers,
  isOpen,
  onClose,
  userLocation
}) => {
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

  // Reset al índice 0 cuando se abra el modal con nuevas ofertas
  useEffect(() => {
    if (isOpen && offers && offers.length > 0) {
      setSelectedOfferIndex(0);
    }
  }, [isOpen, offers]);

  if (!isOpen || !offers || offers.length === 0) return null;

  const currentOffer = offers[selectedOfferIndex];
  const distance = calculateDistance(userLocation, currentOffer.location);
  const hasMultipleOffers = offers.length > 1;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop transparente para cerrar al hacer clic fuera */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold">{currentOffer.fixerName}</h2>
            {hasMultipleOffers && (
              <p className="text-sm text-blue-100 mt-1">
                {offers.length} servicios disponibles
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-2 transition text-2xl font-bold leading-none"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Selector de ofertas - Solo si hay múltiples ofertas */}
        {hasMultipleOffers && (
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Selecciona un servicio:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {offers.map((offer, index) => {
                const isSelected = index === selectedOfferIndex;
                const emoji = getMarkerIcon(offer.category);
                
                return (
                  <button
                    key={offer.id}
                    onClick={() => setSelectedOfferIndex(index)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                      ${isSelected 
                        ? 'bg-blue-600 text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }
                    `}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span>{offer.category}</span>
                    {isSelected && <span className="ml-1">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <span className="text-lg">{getMarkerIcon(currentOffer.category)}</span>
              {currentOffer.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">⭐</span>
              <span className="font-bold text-lg text-gray-800">{currentOffer.rating}/5</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Descripción:</h3>
            <p className="text-gray-700">{currentOffer.description}</p>
          </div>

          {currentOffer.images && currentOffer.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Galería de trabajos:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentOffer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Trabajo ${index + 1}`}
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
              <p className="font-bold text-lg text-green-600">Bs. {currentOffer.price}</p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/${currentOffer.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold w-full"
            >
              <span className="text-xl">💬</span>
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