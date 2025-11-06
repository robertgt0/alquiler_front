'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const ProteccionQr: React.FC = () => {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarInputCodigo, setMostrarInputCodigo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!codigo.trim()) {
      setError('Por favor ingresa el código de verificación');
      setIsLoading(false);
      return;
    }

    try {
      // Simulación de verificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/');
    } catch (error) {
      setError('Código incorrecto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const manejarProblemasAutenticacion = () => {
    setMostrarInputCodigo(true);
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-2xl bg-white rounded-3xl shadow-md p-4 sm:p-6 lg:p-8">
        {/* Encabezado */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-500">Protege tu cuenta</h2>
          <div className="mt-2 text-sm sm:text-base text-gray-600 space-y-1">
             <p>Escanea el codigo QR a continuacion usando tu</p>
             <p>aplicación de autenticación preferida y luego</p>
             <p>ingresa el código único proporcionado a continuación.</p>
             </div>
             </div>

        {/* Sección del código QR */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gray-100 rounded-2xl border border-gray-300 shadow-inner flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-2">📱</div>
            <p className="text-xs text-gray-500 text-center px-4">
              Código QR simulado para demostración
            </p>
          </div>
        </div>

        {/* Enlace de problemas */}
        <div className="text-center mb-6">
         <Link href="/proteccionCodigo">
         <span className="text-sm text-blue-600 hover:text-blue-500 hover:underline cursor-pointer transition-colors">
          ¿Tienes problemas de autentificación para escanear?
        </span>
       </Link>
         </div>

          <div className="flex flex-col items-center justify-center my-6 space-y-1">
           <span className="text-gray-500 text-sm font-medium">Luego</span>
          <span className="text-gray-500 text-sm font-medium">Ingresa el código</span>
           </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Campo para código de verificación */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="codigo"
                name="codigo"
                type="text"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value);
                  setError(null);
                }}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-gray-950 text-center placeholder-gray-500 ${
                  error
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Código de verificación de 6 dígitos"
                maxLength={6}
                pattern="[0-9]{6}"
              />
              {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 text-center">{error}</p>
              )}
              <p className="mt-1 text-xs text-center text-gray-500">
                Ingresa el código de tu app de autenticación
              </p>
            </div>
          </div>

          {/* Botón de continuar */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full max-w-xs sm:max-w-sm py-2 sm:py-3 px-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 flex items-center justify-center gap-3 text-sm sm:text-base font-medium transition-colors duration-200 ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300'
              }`}
            >
              {isLoading ? 'Verificando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
