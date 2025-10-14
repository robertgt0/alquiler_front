// app/tu_epic/hooks/useGoogleAuth.ts
'use client';

import { useState } from 'react';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando autenticación con Google...');
      
      // Simulación - aquí integrarás con tu backend
      
      console.log('Autenticación con Google exitosa');
      return { success: true };
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleGoogleAuth
  };
};