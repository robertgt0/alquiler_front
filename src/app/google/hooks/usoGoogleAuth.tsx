// src/app/google/hooks/useGoogleAuth.tsx
'use client';

import { useState, useCallback } from 'react';

export const usoGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Google Client ID no configurado');
      }

      // Redirigir a Google OAuth
      const authParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: 'http://localhost:3000/auth/google/callback',
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        state: btoa(JSON.stringify({
          timestamp: Date.now().toString(),
          type: 'register'
        }))
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;
      
      window.location.href = googleAuthUrl;
      
      return { success: true };

    } catch (error) {
      console.error('❌ Error en autenticación con Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    handleGoogleAuth
  };
};