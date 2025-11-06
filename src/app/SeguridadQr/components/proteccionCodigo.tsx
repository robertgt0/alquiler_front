'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Componente para mostrar el código secreto y copiarlo
const SecretCodeBox: React.FC = () => {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = () => {
    const codigoSecreto = "ABCD-EFGH-IJKL-MNOP"; // Código de ejemplo
    navigator.clipboard.writeText(codigoSecreto)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      })
      .catch(err => console.error('Error al copiar: ', err));
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="text-center mb-2 text-xs text-gray-500">
        Haz clic en el cuadro para copiar tu código secreto
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-xs sm:max-w-sm">
          <div 
            className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl shadow-sm bg-gray-100 text-center cursor-pointer hover:bg-gray-200 transition-colors duration-200"
            onClick={copiarCodigo}
            role="button"
            tabIndex={0}
          >
            Haz clic para copiar el código
          </div>
          {copiado && (
            <p className="mt-1 text-xs text-center text-green-600" role="alert">
              Código copiado al portapapeles
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProteccionCodigo: React.FC = () => {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!/^\d{6}$/.test(codigo)) {
      setError('El código debe tener 6 dígitos numéricos');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Verificando código:', codigo);
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/'); // Cambia la ruta si quieres ir a otra página
    } catch (err) {
      console.error('Error al verificar el código:', err);
      setError('Código incorrecto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <div className="min-h-screen bg-blue-500 flex items-center justify-center py-6 px-3 sm:px-6 lg:px-8">
        <div className="w-full max-w-md lg:max-w-2xl bg-white rounded-3xl shadow-md p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-500">Protege tu cuenta</h2>
          <div className="mt-2 text-sm sm:text-base text-gray-600 space-y-1">
             <p>Ingresa manualmente el siguiente código en tu</p>
             <p>aplicación de autenticación preferida y luego</p>
             <p>ingresa el código único proporcionado a continuación.</p>
             </div>
             </div>

        <SecretCodeBox />

        {/* Enlace para redireccionar a ProteccionCodigo */}
          <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4">
           
            <Link href="/Poner direccion">
              <span className="text-sm text-blue-600 hover:text-blue-500 hover:underline cursor-pointer">
                escanear codigo QR
              </span>
            </Link>
          </div>

           {/* Separador */}
            <div className="flex flex-col items-center justify-center my-6 space-y-1">
            <span className="text-gray-500 text-sm font-medium">Luego</span>
            <span className="text-gray-500 text-sm font-medium">Ingresa el código</span>
          </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="codigo"
                name="codigo"
                type="text"
                value={codigo}
                onChange={(e) => { setCodigo(e.target.value); setError(null); }}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 text-center ${
                  error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Código de verificación"
                maxLength={6}
              />
              {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 text-center" role="alert">{error}</p>
              )}
            </div>
          </div>

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
              {isLoading ? 'Verificando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
