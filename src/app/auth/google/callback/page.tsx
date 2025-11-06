// src/app/auth/google/callback/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          throw new Error(`Error de Google: ${error}`);
        }
        
        if (!code) {
          throw new Error('No se recibió código de autorización');
        }

        // Determinar tipo de autenticación (registro o login)
        let authType: 'register' | 'login' = 'register';
        if (state) {
          try {
            const decodedState = JSON.parse(atob(state));
            authType = decodedState.type || 'register';
          } catch {
            console.warn('No se pudo decodificar el state');
          }
        }

        console.log(`🔐 Procesando ${authType} con Google...`);

        const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
        
        // ENVIAR authType al backend
        const response = await fetch(`${backend}/api/teamsys/google/callback`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            code,
            authType
          }),
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : {};

        console.log('📊 Respuesta del backend:', { status: response.status, data });

        // ✅ FLUJO CORREGIDO
        if (!response.ok) {
          // CASO 1: Usuario ya registrado (durante REGISTRO) → Redirigir a LOGIN
          if (response.status === 400 && data.message === 'usuario ya registrado' && authType === 'register') {
            console.log('🔄 Usuario ya registrado durante registro - Redirigiendo a login');
            setStatus('success');
            setMessage('✅ Este correo ya está registrado. Redirigiendo al login...');
            setTimeout(() => router.push('/login'), 2000);
            return;
          }
          
          // CASO 2: Usuario no encontrado (durante LOGIN) → Error
          if (response.status === 400 && data.message === 'usuario no encontrado' && authType === 'login') {
            throw new Error('No existe una cuenta con este correo. Regístrate primero.');
          }

          // CASO 3: Otros errores
          throw new Error(data.message || `Error del servidor: ${response.status}`);
        }

        // ✅ AUTENTICACIÓN EXITOSA
        if (data.success && data.data) {
          const { user, accessToken, refreshToken } = data.data;

          // Guardar datos de sesión
          localStorage.setItem('authToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userData', JSON.stringify(user));

          // Disparar evento de login exitoso
          window.dispatchEvent(new CustomEvent("login-exitoso"));

          setStatus('success');

          if (authType === 'register') {
            // REGISTRO exitoso → Guardar datos y redirigir a ImagenLocalizacion
            sessionStorage.setItem('datosUsuarioParcial', JSON.stringify({
              nombre: user.nombre || '',
              correo: user.correo || '',
              fotoPerfil: user.fotoPerfil || '',
              terminosYCondiciones: true,
            }));
            setMessage('🎉 ¡Registro exitoso! Redirigiendo...');
            setTimeout(() => router.push('/ImagenLocalizacion'), 2000);
          } else {
            // LOGIN exitoso → Redirigir a Homepage
            setMessage('🎉 ¡Inicio de sesión exitoso! Redirigiendo a Homepage...');
            setTimeout(() => router.push('/Homepage'), 2000);
          }
        } else {
          throw new Error('Respuesta inválida del servidor');
        }

      } catch (error) {
        console.error('Error en autenticación:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error desconocido');
        
        // Redirigir después de error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700">Procesando autenticación...</h2>
              <p className="text-gray-500 mt-2">Completando con Google</p>
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
              {/* ✅ CORRECCIÓN: Cambiar break-words por break-all */}
              <p className="text-red-500 mt-2 break-all">{message}</p>
              <p className="text-gray-500 text-sm mt-2">Redirigiendo al login...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando...</p>
        </div>
      </div>
    }>
      <Inner />
    </Suspense>
  );
}