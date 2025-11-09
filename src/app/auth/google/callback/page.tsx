// src/app/auth/google/callback/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleAuth } from '../../../google/hooks/useGoogleAuth';

// Evita prerender estático: esta ruta depende de query params
export const dynamic = 'force-dynamic';

function Inner() {
  const router = useRouter();
  const { finalizeFromGoogleProfile } = useGoogleAuth();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) throw new Error(`Error de Google: ${error}`);
        if (!code) throw new Error('No se recibió el código de autorización');

        
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
        const response = await fetch(`${backend}/api/teamsys/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        console.log(code)
        console.log(' Respuesta del backend:', data);

        if (!data.success) {
          if (data.message === 'usuario ya registrado') {
            if(data.data.user.authProvider=='local'){
              throw new Error("metodo de autenticacion no activado para este correo");
              
            }
            if (data) {
      const token = data.data.accessToken ?? data.data.token; 

      if (token) sessionStorage.setItem('authToken', token);

      sessionStorage.setItem('userData', JSON.stringify(data.data.user));
    }
      
      // Disparar evento de login exitoso para que el Header se actualice
      if(data.data.user.twoFactorEnabled){
      router.push('/loginSeguridad')
      return
      }
          const eventLogin = new CustomEvent("login-exitoso");
          window.dispatchEvent(eventLogin);
          router.push('/');
            return;
          } else {
            throw new Error(data.message || 'Error en la autenticación con Google');
          }
        }

        //Extraer datos correctamente desde data.data
        const user = data.data.user;
        const accessToken = data.data.accessToken;
        const refreshToken = data.data.refreshToken;

        //  Guardar token y usuario
        localStorage.setItem('userToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(user));

        //  Guardar en sessionStorage para ImagenLocalizacion
        sessionStorage.setItem('datosUsuarioParcial', JSON.stringify(user));

        // (Si luego usas finalizeFromGoogleProfile, aquí lo puedes llamar)
        // await finalizeFromGoogleProfile?.(user);

        // Redirigir a /ImagenLocalizacion
        setTimeout(() => {
          router.push('/ImagenLocalizacion');
        }, 1500);

      } catch (error) {
        console.error('Error en callback:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error desconocido');

        setTimeout(() => {
          router.push('/registro');
        }, 3000);
      }
    };

    handleCallback();
  }, [router, searchParams, finalizeFromGoogleProfile]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700">Procesando...</h2>
              <p className="text-gray-500 mt-2">Completando autenticación con Google</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">¡Éxito!</h2>
              <p className="text-gray-500 mt-2">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">Error</h2>
              <p className="text-red-500 mt-2">{message}</p>
              <p className="text-gray-500 text-sm mt-2">Redirigiendo al registro...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// La página (Server por defecto) solo envuelve en Suspense al componente cliente
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<p>Redirigiendo…</p>}>
      <Inner />
    </Suspense>
  );
}