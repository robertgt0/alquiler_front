'use client';

import { useState, useEffect } from 'react';
import { Location } from '../interfaces/types';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada por tu navegador');
      setLoading(false);
      return;
    }

    // Obtener ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        // Si falla, usar ubicación por defecto (Centro de Cochabamba)
        console.warn('Error obteniendo ubicación:', err.message);
        setUserLocation({ lat: -17.3935, lng: -66.1570 });
        setError('Usando ubicación por defecto (Cochabamba)');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, []);

  return { userLocation, loading, error };
};