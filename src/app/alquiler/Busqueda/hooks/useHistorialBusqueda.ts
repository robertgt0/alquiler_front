
import { useState, useEffect, useRef, useCallback } from "react";

interface UseSearchHistoryProps {
  mostrarHistorial?: boolean;
  apiConfig?: {
    endpoint: string;
  };
}

interface UseSearchHistoryReturn {
  historial: string[];
  cargandoHistorial: boolean;
  mostrarHistorialLocal: boolean;
  setMostrarHistorialLocal: (show: boolean) => void;
  guardarEnHistorial: (texto: string) => void;
  limpiarHistorialBackend: () => Promise<void>;
  seleccionarDelHistorial: (texto: string) => string;
  cargarHistorialBackend: () => Promise<void>;
  eliminarDelHistorial: (texto: string) => void;
  indiceSeleccionado: number;
  setIndiceSeleccionado: (indice: number | ((prev: number) => number)) => void;
  seleccionarPorIndice: (indice: number) => string | undefined;
}


class HistoryService {
  private static API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000/api';

  static async getHistorial(endpoint?: string): Promise<string[]> {
    try {
      const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/history`;
      const response = await fetch(apiEndpoint);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.data || data.historial || [];
        }
      }
      return [];
    } catch (error) {
      console.error('❌ [HISTORY-SERVICE] Error obteniendo historial:', error);
      return [];
    }
  }

  static async clearHistorial(endpoint?: string): Promise<boolean> {
    try {
      const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/history`;
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        return data.success || false;
      }
      return false;
    } catch (error) {
      console.error('❌ [HISTORY-SERVICE] Error limpiando historial:', error);
      return false;
    }
  }
}

export function useSearchHistory({
  mostrarHistorial = true,
  apiConfig
}: UseSearchHistoryProps): UseSearchHistoryReturn {
  const [historial, setHistorial] = useState<string[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [mostrarHistorialLocal, setMostrarHistorialLocal] = useState(false);
  const historialCargado = useRef(false);
  
  //estado para controlar la navegacion
  const [indiceSeleccionado, setIndiceSeleccionado] = useState<number>(-1);

  // Cargar historial del backend
  const cargarHistorialBackend = useCallback(async () => {
    if (!mostrarHistorial || historialCargado.current) return;

    try {
      setCargandoHistorial(true);
      const terminos = await HistoryService.getHistorial(apiConfig?.endpoint);

      if (terminos.length > 0 && !historialCargado.current) {
        setHistorial(terminos);
        console.log('📚 [HISTORIAL] Historial cargado:', terminos);
      } else {
        console.log('📚 [HISTORIAL] Historial vacío o ya limpiado');
        setHistorial([]);
      }

      historialCargado.current = true;
    } catch (error) {
      console.error('Error cargando historial del backend:', error);
      try {
        const stored = localStorage.getItem("historialBusquedas");
        if (stored && !historialCargado.current) {
          setHistorial(JSON.parse(stored));
        }
      } catch (localError) {
        console.error('Error con localStorage:', localError);
      } finally {
        historialCargado.current = true;
      }
    } finally {
      setCargandoHistorial(false);
    }
  }, [mostrarHistorial, apiConfig?.endpoint]);

  //  Limpiar historial automáticamente al recargar
  useEffect(() => {
    const limpiarHistorialAlRecargar = async () => {
      if (!mostrarHistorial || historialCargado.current) return;

      console.log('🧹 [HISTORIAL] Limpiando historial por recarga de página');

      try {
        await HistoryService.clearHistorial(apiConfig?.endpoint);
        setHistorial([]);
        localStorage.removeItem("historialBusquedas");
        historialCargado.current = true;
        console.log('✅ [HISTORIAL] Historial limpiado correctamente');
      } catch (error) {
        console.error('❌ [HISTORIAL] Error limpiando historial:', error);
        setHistorial([]);
        localStorage.removeItem("historialBusquedas");
        historialCargado.current = true;
      }
    };

    limpiarHistorialAlRecargar();

    const handleBeforeUnload = () => {
      historialCargado.current = false;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mostrarHistorial, apiConfig?.endpoint]);

  //Cargar historial al montar
  useEffect(() => {
    cargarHistorialBackend();
  }, [cargarHistorialBackend]);

  //Guardar en historial
  const guardarEnHistorial = useCallback((texto: string) => {
    if (!mostrarHistorial) return;

    const textoNormalizado = texto.trim();
    if (!textoNormalizado) return;

    const nuevoHistorial = Array.from(
      new Set([textoNormalizado, ...historial])
    ).slice(0, 5);

    setHistorial(nuevoHistorial);
    try {
      localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
    } catch (error) {
      console.error("Error guardando historial en localStorage:", error);
    }
  }, [historial, mostrarHistorial]);

  //Limpiar historial del backend
  const limpiarHistorialBackend = useCallback(async () => {
    try {
      const success = await HistoryService.clearHistorial(apiConfig?.endpoint);
      if (success) {
        setHistorial([]);
        setMostrarHistorialLocal(false);
        localStorage.removeItem("historialBusquedas");
        historialCargado.current = true;
        console.log('✅ Historial limpiado correctamente');
      } else {
        console.error('❌ Error al limpiar historial en el backend');
      }
    } catch (error) {
      console.error('❌ Error limpiando historial:', error);
    }
  }, [apiConfig?.endpoint]);
 
  
   const eliminarDelHistorial = useCallback((texto: string) => {
    const nuevoHistorial = historial.filter(item => item !== texto);
    setHistorial(nuevoHistorial);
    localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
  }, [historial]);

  // 🔥 Seleccionar item del historial
  const seleccionarDelHistorial = useCallback((texto: string) => {
    console.log('📚 [HISTORIAL] Seleccionado del historial:', texto);
    setMostrarHistorialLocal(false);
    return texto;
  }, []);

  //seleciona termino basado en indice
  const seleccionarPorIndice = useCallback((indice: number): string | undefined => {
    if (indice >= 0 && indice < historial.length) {
      setMostrarHistorialLocal(false);
      return historial[indice]; // Devuelve el término para iniciar la búsqueda
    }
    return undefined;
  }, [historial]);

  return {
    historial,
    cargandoHistorial,
    mostrarHistorialLocal,
    setMostrarHistorialLocal,
    guardarEnHistorial,
    limpiarHistorialBackend,
    seleccionarDelHistorial,
    eliminarDelHistorial,
    cargarHistorialBackend,
    //navegacion
    indiceSeleccionado,
    setIndiceSeleccionado,
    seleccionarPorIndice
  };
}