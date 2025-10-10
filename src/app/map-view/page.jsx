'use client';

import { useEffect, useState, useRef } from 'react';

// Hook de datos
function useMapData() {
  const [fixers, setFixers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFixer, setSelectedFixer] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const mockFixers = [
        {
          id: 1,
          name: 'Juan Pérez',
          description: 'Plomero con 10 años de experiencia.',
          whatsapp: '59171234567',
          lat: -17.3895,
          lng: -66.1568,
          category: 'plomeria',
          rating: 4.5,
          photos: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500']
        },
        {
          id: 2,
          name: 'María García',
          description: 'Electricista certificada.',
          whatsapp: '59172345678',
          lat: -17.3945,
          lng: -66.1620,
          category: 'electricidad',
          rating: 4.8,
          photos: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500']
        }
      ];
      setFixers(mockFixers);
      setLoading(false);
    }, 1000);
  }, []);

  return { fixers, loading, selectedFixer, setSelectedFixer };
}

// Modal Component
function FixerModal({ fixer, onClose }) {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${fixer.whatsapp}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-black">{fixer.name}</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900 text-4xl font-bold">×</button>
        </div>
        <img src={fixer.photos[0]} alt={fixer.name} className="w-full h-80 object-cover" />
        <div className="p-6 space-y-4">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">{fixer.category}</span>
          <p className="text-gray-800 text-base leading-relaxed">{fixer.description}</p>
          <button onClick={handleWhatsAppClick} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
            💬 Contactar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function MapViewPage() {
  const { fixers, loading, selectedFixer, setSelectedFixer } = useMapData();
  const [userLocation] = useState([-17.3935, -66.1570]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current).setView(userLocation, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    mapInstanceRef.current = map;
  }, [mapLoaded, userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || loading) return;
    const L = window.L;
    fixers.forEach((fixer) => {
      L.marker([fixer.lat, fixer.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(fixer.name)
        .on('click', () => setSelectedFixer(fixer));
    });
  }, [mapLoaded, fixers, loading, setSelectedFixer]);

  if (!mapLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-spin">🗺️</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-900">🗺️ Mapa de Fixers</h2>
        <p className="text-sm text-gray-800 font-medium">{fixers.length} fixers disponibles</p>
      </div>
      <div ref={mapRef} className="h-full w-full" />
      {selectedFixer && <FixerModal fixer={selectedFixer} onClose={() => setSelectedFixer(null)} />}
    </div>
  );
}