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

  const handleGoogleAuth = useCallback(async (type: AuthType = 'register') => {
    setIsLoading(true);
    setError(null);

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      // ✅ CORRECCIÓN: Usar exactamente la misma URI que está en el backend
      const redirectUri = 'http://localhost:3000/auth/google/callback';
      
      console.log('🔐 Configuración OAuth:', { 
        clientId: clientId ? '✅ Configurado' : '❌ Faltante',
        redirectUri,
        type 
      });

      if (!clientId) {
        throw new Error('Google Client ID no configurado');
      }

      const state = btoa(JSON.stringify({ 
        type: type,
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substring(2, 15)
      }));

      const authParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri, // ✅ URI exacta
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        state: state,
        nonce: Math.random().toString(36).substring(2, 15)
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;
      
      console.log(`🔗 Iniciando OAuth para: ${type}`);
      
      // Redirección directa
      window.location.href = googleAuthUrl;

      return { success: true };
    } catch (err) {
      console.error('❌ Error en autenticación con Google:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

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