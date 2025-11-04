// src/app/google/hooks/useGoogleAuth.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type AuthType = 'register' | 'login';

type GoogleProfile = {
  name?: string;
  email?: string;
  picture?: string;
};

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1) Inicia OAuth con Google
  const handleGoogleAuth = useCallback(async (type: AuthType = 'register') => {
    setIsLoading(true);
    setError(null);

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
      
      if (!clientId) throw new Error('Google Client ID no configurado');

      const state = btoa(JSON.stringify({ 
        timestamp: Date.now().toString(), 
        type: type // ← ENVIAR EL TIPO CORRECTO
      }));

      const authParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        state: state,
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;
      
      console.log(`🔗 Redirigiendo a Google OAuth para: ${type}`);
      window.location.href = googleAuthUrl;

      return { success: true };
    } catch (err) {
      console.error('Error en autenticación con Google:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2) Finaliza el flujo: guarda y redirige
  const finalizeFromGoogleProfile = useCallback((profile: GoogleProfile) => {
    const datosFormularioGoogle = {
      nombre: profile?.name ?? '',
      correo: profile?.email ?? '',
      fotoPerfil: profile?.picture,
      terminosYCondiciones: true,
    };

    sessionStorage.setItem('datosUsuarioParcial', JSON.stringify(datosFormularioGoogle));
    router.push('/ImagenLocalizacion');
  }, [router]);

  return {
    isLoading,
    error,
    handleGoogleAuth,
    finalizeFromGoogleProfile,
  };
};