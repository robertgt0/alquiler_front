'use client';

import { useEffect, useState, useRef } from 'react';
import FixerModal from './FixerModal';
import useMapData from '../hooks/useMapData';

export default function MapView() {
  const { fixers, loading, selectedFixer, setSelectedFixer } = useMapData();
  const [userLocation, setUserLocation] = useState([-17.3935, -66.1570]);
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
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);

      return () => {
        if (link.parentNode) link.parentNode.removeChild(link);
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.log('No se pudo obtener ubicación, usando Cochabamba');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const map = L.map(mapRef.current).setView(userLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    const userIcon = L.divIcon({
      html: '<div style="font-size: 32px;">📍</div>',
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    L.marker(userLocation, { icon: userIcon })
      .addTo(map)
      .bindPopup('Tu ubicación');

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || loading) return;

    const L = window.L;
    const markers = [];

    const getIconByCategory = (category) => {
      const colors = {
        plomeria: '🔧',
        electricidad: '⚡',
        carpinteria: '🪚',
        pintura: '🎨',
        default: '📍'
      };

      return L.divIcon({
        html: `<div style="font-size: 32px;">${colors[category] || colors.default}</div>`,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
    };

    fixers.forEach((fixer) => {
      const marker = L.marker([fixer.lat, fixer.lng], {
        icon: getIconByCategory(fixer.category)
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="text-center">
            <p class="font-bold">${fixer.name}</p>
            <p class="text-sm text-gray-600">${fixer.category}</p>
          </div>
        `)
        .on('click', () => {
          setSelectedFixer(fixer);
        });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [mapLoaded, fixers, loading, setSelectedFixer]);

  if (!mapLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🗺️</div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold mb-2">🗺️ Mapa de Fixers</h2>
          <p className="text-sm text-gray-600">
            {loading ? 'Cargando fixers...' : `${fixers.length} fixers disponibles`}
          </p>
        </div>
      </div>

      <div ref={mapRef} className="h-full w-full z-0" />

      {selectedFixer && (
        <FixerModal
          fixer={selectedFixer}
          onClose={() => setSelectedFixer(null)}
        />
      )}

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h3 className="font-bold mb-2 text-sm">Leyenda:</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Tu ubicación</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <span>Plomería</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>Electricidad</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🪚</span>
            <span>Carpintería</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎨</span>
            <span>Pintura</span>
          </div>
        </div>
      </div>
    </div>
  );
}