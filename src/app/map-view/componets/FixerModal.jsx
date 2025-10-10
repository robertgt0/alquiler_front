'use client';

import { useState } from 'react';

export default function FixerModal({ fixer, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { name, description, whatsapp, photos, category, rating } = fixer;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        {/* Carrusel de fotos */}
        {photos && photos.length > 0 ? (
          <div className="relative bg-gray-900">
            <img
              src={photos[currentImageIndex]}
              alt={`${name} - foto ${currentImageIndex + 1}`}
              className="w-full h-80 object-cover"
            />
            
            {/* Controles del carrusel */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-80 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Sin fotos disponibles</p>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Categoría y rating */}
          <div className="flex items-center justify-between">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {category}
            </span>
            {rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-semibold">{rating}</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Descripción:</h3>
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* WhatsApp */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Contacto:</h3>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <span className="text-2xl">💬</span>
              <span>Contactar por WhatsApp</span>
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              {whatsapp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}