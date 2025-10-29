// components/PermisoGeolocalizacion.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { UbicacionManager } from './UbicacionManager';

interface PermisoGeolocalizacionProps {
  isLoggedIn: boolean;
}

export default function PermisoGeolocalizacion({ isLoggedIn }: PermisoGeolocalizacionProps) {
  const [estadoPermisos, setEstadoPermisos] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [solicitando, setSolicitando] = useState(false);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [mostrarModalReset, setMostrarModalReset] = useState(false);

  const ubicacionManager = UbicacionManager.getInstancia();

  const verificarEstadoPermisos = useCallback(async () => {
    try {
      const estado = await ubicacionManager.obtenerEstadoPermisos();
      setEstadoPermisos(estado);
    } catch (error) {
      console.log('Error al verificar permisos:', error);
      setEstadoPermisos('prompt');
    }
  }, [ubicacionManager]);

  const inicializarListenerPermisos = useCallback(async () => {
    try {
      if (!navigator.permissions) {
        console.log('Permissions API no soportada');
        await verificarEstadoPermisos();
        return;
      }

      const estado = await ubicacionManager.obtenerEstadoPermisos();
      setEstadoPermisos(estado);

      const result = await navigator.permissions.query({ name: 'geolocation' });
      
      result.onchange = () => {
        console.log('Estado de permisos cambió:', result.state);
        setEstadoPermisos(result.state as 'granted' | 'denied' | 'prompt');
      };

    } catch (error) {
      console.log('Error al inicializar listener de permisos:', error);
      await verificarEstadoPermisos();
    }
  }, [ubicacionManager, verificarEstadoPermisos]);

  useEffect(() => {
    if (isLoggedIn) {
      inicializarListenerPermisos();
    } else {
      setEstadoPermisos('prompt');
    }
  }, [isLoggedIn, inicializarListenerPermisos]);

  const handleSolicitarPermisos = async () => {
    if (!isLoggedIn) return;
    
    if (estadoPermisos === 'denied') {
      setMostrarModalReset(true);
      return;
    }
    
    setSolicitando(true);
    
    try {
      const concedido = await ubicacionManager.solicitarPermisosGeolocalizacion();
      
      if (concedido) {
        setEstadoPermisos('granted');
        console.log('Usuario concedió permisos - obteniendo ubicación...');
        window.dispatchEvent(new CustomEvent('solicitar-geolocalizacion'));
      } else {
        setEstadoPermisos('denied');
      }
    } catch (error) {
      console.log('Error al solicitar permisos:', error);
      setEstadoPermisos('denied');
    } finally {
      setSolicitando(false);
    }
  };

  const handleResetearPermisos = async () => {
    setSolicitando(true);
    
    try {
      const resetExitoso = await ubicacionManager.resetearPermisosGeolocalizacion();
      
      if (resetExitoso) {
        console.log("Permisos reseteados, intentando solicitar nuevamente...");
        setEstadoPermisos('prompt');
        
        setTimeout(async () => {
          const concedido = await ubicacionManager.solicitarPermisosGeolocalizacion();
          setEstadoPermisos(concedido ? 'granted' : 'denied');
          
          if (concedido) {
            window.dispatchEvent(new CustomEvent('solicitar-geolocalizacion'));
          }
        }, 1000);
      } else {
        if (confirm('No se pueden resetear los permisos automáticamente. ¿Quieres ver instrucciones para habilitarlos manualmente en tu navegador?')) {
          window.open('https://support.google.com/chrome/answer/142065?hl=es&co=GENIE.Platform%3DDesktop', '_blank');
        }
      }
    } catch (error) {
      console.log('Error al resetear permisos:', error);
    } finally {
      setSolicitando(false);
      setMostrarModalReset(false);
    }
  };

  const getIcono = () => {
    if (!isLoggedIn) {
      return '🔒';
    }
    
    switch (estadoPermisos) {
      case 'granted':
        return '✅';
      case 'denied':
        return '🔄';
      default:
        return '📍';
    }
  };

  const getTooltipText = () => {
    if (!isLoggedIn) {
      return 'Inicia sesión para acceder a tu ubicación';
    }
    
    switch (estadoPermisos) {
      case 'granted':
        return 'Permisos de ubicación concedidos';
      case 'denied':
        return 'Permisos denegados. Haz clic para intentar resetear';
      default:
        return 'Haz clic para permitir el acceso a tu ubicación';
    }
  };

  const getColorClases = () => {
    if (!isLoggedIn) {
      return 'bg-gray-400 text-white cursor-not-allowed';
    }
    
    switch (estadoPermisos) {
      case 'granted':
        return 'bg-green-500 hover:bg-green-600 text-white cursor-default';
      case 'denied':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  const estaDeshabilitado = !isLoggedIn || solicitando || (estadoPermisos === 'granted');

  return (
    <>
      <div className="fixed bottom-20 right-4 z-[1000] flex flex-col items-end">
        {mostrarTooltip && (
          <div className="mb-2 bg-gray-800 text-white text-sm rounded-lg py-2 px-3 max-w-xs shadow-lg">
            {getTooltipText()}
            <div className="absolute bottom-0 right-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
          </div>
        )}
        
        <button
          className={`
            w-12 h-12 rounded-full shadow-lg transition-all duration-200 
            flex items-center justify-center text-lg font-bold
            ${getColorClases()}
            ${!isLoggedIn ? '' : (solicitando ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105')}
          `}
          onClick={handleSolicitarPermisos}
          disabled={estaDeshabilitado}
          onMouseEnter={() => setMostrarTooltip(true)}
          onMouseLeave={() => setMostrarTooltip(false)}
          title={getTooltipText()}
        >
          {solicitando ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            getIcono()
          )}
        </button>
      </div>

      {mostrarModalReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">Permisos de ubicación denegados</h3>
            <p className="text-gray-600 mb-4">
              Los permisos de ubicación están bloqueados. ¿Quieres intentar resetearlos y solicitar permisos nuevamente?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setMostrarModalReset(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetearPermisos}
                disabled={solicitando}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {solicitando ? 'Procesando...' : 'Resetear permisos'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}