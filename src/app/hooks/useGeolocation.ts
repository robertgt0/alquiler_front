"use client";

import { useState, useEffect } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export const useGeolocation = (options: PositionOptions = {}) => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada en este navegador');
      setLoading(false);
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({ lat: latitude, lng: longitude, accuracy, timestamp: position.timestamp });
      setLoading(false);
      setError(null);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let msg = 'Error desconocido al obtener ubicación';
      switch (error.code) {
        case error.PERMISSION_DENIED: msg = 'Permiso de ubicación denegado'; break;
        case error.POSITION_UNAVAILABLE: msg = 'Información de ubicación no disponible'; break;
        case error.TIMEOUT: msg = 'Tiempo de espera agotado'; break;
      }
      setError(msg);
      setLoading(false);
    };

    setLoading(true);
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, defaultOptions);
  }, [defaultOptions]);

  const refreshLocation = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ lat: latitude, lng: longitude, accuracy, timestamp: position.timestamp });
        setLoading(false);
      },
      (err) => {
        let msg = 'Error desconocido al obtener ubicación';
        switch (err.code) {
          case err.PERMISSION_DENIED: msg = 'Permiso de ubicación denegado'; break;
          case err.POSITION_UNAVAILABLE: msg = 'Información de ubicación no disponible'; break;
          case err.TIMEOUT: msg = 'Tiempo de espera agotado'; break;
        }
        setError(msg);
        setLoading(false);
      },
      defaultOptions
    );
  };

  return { location, loading, error, refreshLocation };
};
