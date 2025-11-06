// src/app/auth/google/callback/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthService } from '../../../metodosAutenticacion/services/googleAuthService';

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

        if (error) throw new Error(`Error de Google: ${error}`);
        if (!code) throw new Error('No se recibió el código de autorización');

        console.log('Código recibido:', code);
        
        // 1. Verificar si hay un email guardado para comparar (activación de método)
        const emailParaValidar = sessionStorage.getItem('emailParaValidarGoogle');
        const accionGoogle = sessionStorage.getItem('accionGoogle');
        
        // 2. Procesar el callback de Google normalmente
        const data = await GoogleAuthService.handleGoogleCallback(code);
        console.log('Respuesta del backend:', data);

        // 3. Si es una activación de método, comparar emails y activar método
        if (emailParaValidar && accionGoogle === 'activar-metodo') {
          console.log('🔍 Comparando emails para activación de método:');
          console.log('  - Email local:', emailParaValidar);
          
          // Obtener el email de Google desde la respuesta del backend
          const googleEmail = data.data?.user?.email || data.data?.user?.correo;
          console.log('  - Email Google:', googleEmail);

          if (!googleEmail) {
            throw new Error('No se pudo obtener el email de Google');
          }

          // Comparar emails (case-insensitive)
          const emailsCoinciden = emailParaValidar.toLowerCase() === googleEmail.toLowerCase();
          
          if (!emailsCoinciden) {
            console.error(' Los emails no coinciden');
            // Guardar resultado de error
            GoogleAuthService.saveActivationResult(false, 'El email de Google no coincide con tu cuenta actual');
            
          
          }
          
          // Configurar Google Auth en el backend
          await GoogleAuthService.setupGoogleAuth(emailParaValidar);
          
          // Guardar resultado exitoso
          GoogleAuthService.saveActivationResult(true, 'Google Auth activado correctamente');
          
          // Limpiar datos temporales
          GoogleAuthService.clearPendingActivation();
        
        }

        // 4. Flujo normal de login/registro (NO es activación de método)
        if (data.message === 'usuario ya registrado') {
          GoogleAuthService.handleExistingUser(data);
          router.push('/');
          return;
        }

        // Guardar datos de autenticación (para registro normal)
        GoogleAuthService.saveAuthData(data);

        // SOLO para registro normal: Redirigir a /ImagenLocalizacion
        setTimeout(() => {
          router.push('/ImagenLocalizacion');
        }, 1500);

      } catch (error) {
        console.error('Error en callback:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error desconocido');

        // Si era una activación, guardar error y redirigir al gestor de métodos
        const emailParaValidar = sessionStorage.getItem('emailParaValidarGoogle');
        if (emailParaValidar) {
          GoogleAuthService.saveActivationResult(false, error instanceof Error ? error.message : 'Error desconocido');
          GoogleAuthService.clearPendingActivation();
          
        } 
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Procesando...</h2>
            <p className="text-gray-500 mt-2">
              {sessionStorage.getItem('emailParaValidarGoogle') 
                ? 'Activando método Google...' 
                : 'Completando autenticación con Google'
              }
            </p>
          </>
        )}

        {status === 'error' && (
          // Overlay que cubre toda la pantalla y permite click para volver
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div 
              className="max-w-md w-full bg-white rounded-lg shadow-md p-6 mx-4 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-700">Error</h2>
                <p className="text-red-500 mt-2">{message}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {sessionStorage.getItem('emailParaValidarGoogle') 
                    ? '' 
                    : 'Los correos no son iguales'
                  }
                </p>
                <p className="text-gray-400 text-xs mt-4">
                  Haz click fuera de este mensaje para volver atrás
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<p>Redirigiendo…</p>}>
      <Inner />
    </Suspense>
  );
}