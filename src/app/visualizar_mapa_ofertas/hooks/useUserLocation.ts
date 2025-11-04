'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location } from '../interfaces/types';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Función para forzar actualización manual
  const forceUpdate = useCallback(() => {
    if (userLocation) {
      // Crear nuevo objeto para forzar re-render
      setUserLocation({ ...userLocation });
    }
  }, [userLocation]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada por tu navegador');
      setUserLocation({ lat: -17.3935, lng: -66.1570 });
      setLoading(false);
      return;
    }

    const updateLocation = (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('📍 Ubicación actualizada:', newLocation);
      setUserLocation(newLocation);
      setLoading(false);
      setError(null);
    };

    const handleError = (err: GeolocationPositionError) => {
      console.error('❌ Error GPS:', err.message);
      setUserLocation({ lat: -17.3935, lng: -66.1570 });
      setError(`No se puede obtener GPS: ${err.message}`);
      setLoading(false);
    };

    // Obtener ubicación inicial
    navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    // Seguimiento continuo de ubicación (cada 5 segundos)
    const id = navigator.geolocation.watchPosition(
      updateLocation,
      handleError,
      {
        enableHighAccuracy: true, // GPS de alta precisión
        timeout: 10000,
        maximumAge: 0
      }
    );

    setWatchId(id);

    return () => {
      if (id) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, []);

  return { userLocation, loading, error, forceUpdate };
};