'use client';

import React, { useState } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import AppleIcon from '../assets/icons8-apple-50.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUsuario } from '@/app/teamsys/services/UserService';
import { useGoogleAuth } from '../../google/hooks/useGoogleAuth';
import { GoogleButton } from '../../google/components/GoogleButton';
import Image from 'next/image';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const {
    datosFormulario,
    errores,
    tocados,
    manejarCambio,
    manejarBlur,
    validarFormulario,
  } = useLoginForm();
  const [errorBackend, setErrorBackend] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoading: googleLoading, error: googleError, handleGoogleAuth } = useGoogleAuth();

  const handleGoogleClick = async () => {
    // Para login, usar tipo "login" específicamente
    await handleGoogleAuth('login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBackend(null);
    setIsLoading(true);

    if (!validarFormulario()) {
      setIsLoading(false);
      return;
    }

    console.log('Formulario válido, listo para enviar:', datosFormulario);

    try {
      const res = await loginUsuario(
        datosFormulario.email,
        datosFormulario.contraseña
      );

      console.log('Login exitoso:', res);
      
      // Guardar token en localStorage/sessionStorage
      if (res.token) {
        localStorage.setItem('authToken', res.token);
        // También puedes guardar datos del usuario si los necesitas
        localStorage.setItem('userData', JSON.stringify(res.user));
      }
      
      // Disparar evento de login exitoso para que el Header se actualice
      const eventLogin = new CustomEvent("login-exitoso");
      window.dispatchEvent(eventLogin);
      
      // ✅ CAMBIO: Redirigir a Homepage en lugar de home
      router.push('/Homepage');
    } catch (error: unknown) {
      console.error('Error completo al iniciar sesión:', error);
      
      let mensajeError = 'Error al iniciar sesión';
      
      if (
        error instanceof Error &&
        (
          error.message.includes('401') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('contraseña') ||
          error.message.includes('password') ||
          error.message.includes('Credenciales')
        )
      ) {
        mensajeError = 'Contraseña incorrecta.';
      } else if (
        error instanceof Error &&
        (
          error.message.includes('404') ||
          error.message.includes('No encontrado') ||
          error.message.includes('Usuario') ||
          error.message.includes('user')
        )
      ) {
        mensajeError = 'Usuario no encontrado. Verifica tu correo electrónico.';
      } else if (error instanceof Error) {
        mensajeError = error.message || 'Error al conectar con el servidor';
      } else {
        mensajeError = 'Error al conectar con el servidor';
      }

      setErrorBackend(mensajeError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-2xl bg-white rounded-3xl shadow-md p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-500">Iniciar sesión</h2>
        </div>

        {/* Mostrar errores de Google */}
        {googleError && (
          <p className="text-red-600 text-sm text-center mb-4">{googleError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Email */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="email"
                name="email"
                type="text"
                value={datosFormulario.email}
                onChange={(e) => {
                  manejarCambio('email', e.target.value);
                  setErrorBackend(null);
                }}
                onBlur={() => manejarBlur('email')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  errores.email && tocados.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Correo electrónico"
              />
              {errores.email && tocados.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.email}</p>
              )}
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="password"
                name="password"
                type="password"
                value={datosFormulario.contraseña}
                onChange={(e) => {
                  manejarCambio('contraseña', e.target.value);
                  setErrorBackend(null);
                }}
                onBlur={() => manejarBlur('contraseña')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  (errores.contraseña && tocados.contraseña) || errorBackend
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Contraseña"
              />
              {/* Mostrar errores de validación frontend */}
              {(errores.contraseña && tocados.contraseña) && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.contraseña}</p>
              )}
              {/* Mostrar TODOS los errores del backend aquí */}
              {errorBackend && !errores.contraseña && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errorBackend}</p>
              )}
            </div>
          </div>

          {/* Botón de Iniciar sesión */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full max-w-xs sm:max-w-sm py-2 sm:py-3 px-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 transition-colors duration-200 flex items-center justify-center gap-3 text-sm sm:text-base ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300'
              }`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>

          {/* Separador visual con "o" */}
          <div className="flex items-center justify-center my-4 sm:my-6">
            <span className="text-gray-500 text-xs sm:text-sm font-medium">o</span>
          </div>

          {/* Botón de Google */}
          <GoogleButton 
            onClick={handleGoogleClick}
            isLoading={googleLoading}
            type="login"
          />

          {/* Botón de Apple */}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-full max-w-xs sm:max-w-sm bg-white text-black py-2 sm:py-3 px-4 border border-gray-300 rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 flex items-center justify-center gap-3 text-xs sm:text-sm"
            >
              {/* ✅ CORRECCIÓN: Usar next/image */}
              <Image
                src={AppleIcon.src}
                alt="Registrarse con Apple"
                width={16}
                height={16}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              Registrarse con Apple
            </button>
          </div>

          {/* Enlace a registro */}
          <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-gray-600">¿Aún no tienes una cuenta?</p>
            <Link href="/registro">
              <span className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline cursor-pointer">
                Regístrate
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};