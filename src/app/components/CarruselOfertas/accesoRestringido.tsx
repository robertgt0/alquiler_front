'use client';

import Link from 'next/link';

interface AccesoRestringidoProps {
  servicioNombre?: string | null;
  servicioId?: string | null;
  onClose?: () => void;
  isModal?: boolean;
}

export default function AccesoRestringido({ 
  servicioNombre, 
  onClose,
  isModal = false 
}: AccesoRestringidoProps) {
  return (
    <div className={`${!isModal ? 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4' : ''}`}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icono de candado */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Título y mensaje */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Acceso Restringido
        </h1>
        
        {servicioNombre && (
          <p className="text-lg text-blue-600 font-semibold mb-4">
            Servicio: {decodeURIComponent(servicioNombre)}
          </p>
        )}

        <p className="text-gray-600 mb-6 leading-relaxed">
          Este contenido está actualmente en desarrollo o requiere permisos especiales para acceder. 
          Estamos trabajando para ofrecerte la mejor experiencia posible.
        </p>

        {/* Información adicional */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Nota:</strong> Esta es una página temporal. El servicio estará disponible próximamente.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isModal ? (
            <button 
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Cerrar
            </button>
          ) : (
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Volver al Inicio
            </Link>
          )}
          
          <button 
            onClick={() => isModal && onClose ? onClose() : window.history.back()}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
          >
            {isModal ? 'Volver' : 'Volver Atrás'}
          </button>
        </div>

        {/* Contacto */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            ¿Necesitas ayuda?{' '}
            <a href="mailto:soporte@empresa.com" className="text-blue-600 hover:text-blue-800 font-medium">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}