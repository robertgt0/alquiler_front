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

// Helper: normaliza NEXT_PUBLIC_API_URL evitando duplicar '/api'
function getApiRoot(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

class HistoryService {
  private static API_BASE = getApiRoot();

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
      console.error("❌ [HISTORY-SERVICE] Error obteniendo historial:", error);
      return [];
    }
  }

  static async clearHistorial(endpoint?: string): Promise<boolean> {
    try {
      const apiEndpoint = endpoint || `${this.API_BASE}/borbotones/search/history`;
      const response = await fetch(apiEndpoint, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        return data.success || false;
      }
      return false;
    } catch (error) {
      console.error("❌ [HISTORY-SERVICE] Error limpiando historial:", error);
      return false;
    }
  }
}

export function useSearchHistory({
  mostrarHistorial = true,
  apiConfig,
}: UseSearchHistoryProps): UseSearchHistoryReturn {
  const [historial, setHistorial] = useState<string[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [mostrarHistorialLocal, setMostrarHistorialLocal] = useState(false);

  const historialCargado = useRef(false);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState<number>(-1);

  // ✅ Cargar historial del backend o localStorage
  const cargarHistorialBackend = useCallback(async () => {
    if (!mostrarHistorial) return;

    setCargandoHistorial(true);
    try {
      const terminos = await HistoryService.getHistorial(apiConfig?.endpoint);

      if (terminos.length > 0) {
        // Limpiar y normalizar términos
        const historialUnico: string[] = Array.from(
          new Set(
            terminos
              .map((term: string) => term.trim())
              .filter((term: string) => term.length > 0)
          )
        ).slice(0, 10) as string[];

        setHistorial(historialUnico);
        console.log("📚 [HISTORIAL] Historial cargado del backend:", historialUnico);
      } else {
        // Si viene vacío, intentar localStorage
        try {
          const stored = localStorage.getItem("historialBusquedas");
          if (stored) {
            const historialLocal: string[] = JSON.parse(stored);
            const historialUnico: string[] = Array.from(
              new Set(
                historialLocal
                  .map((term: string) => term.trim())
                  .filter((term: string) => term.length > 0)
              )
            ).slice(0, 10);
            setHistorial(historialUnico);
            console.log('📚 [HISTORIAL] Historial cargado desde localStorage:', historialUnico);
          } else {
            setHistorial([]);
          }
        } catch (localError) {
          console.error('Error con localStorage:', localError);
          setHistorial([]);
        }
        console.log("📚 [HISTORIAL] Historial vacío o no hay datos");
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      try {
        const stored = localStorage.getItem("historialBusquedas");
        if (stored) {
          const historialLocal: string[] = JSON.parse(stored);
          const historialUnico: string[] = Array.from(
            new Set(
              historialLocal
                .map((term: string) => term.trim())
                .filter((term: string) => term.length > 0)
            )
          ).slice(0, 10);
          setHistorial(historialUnico);
        } else {
          setHistorial([]);
        }
      } catch (localError) {
        console.error("Error leyendo localStorage:", localError);
        setHistorial([]);
      }
    } finally {
      setCargandoHistorial(false);
      historialCargado.current = true;
    }
  }, [mostrarHistorial, apiConfig?.endpoint]);

  useEffect(() => {
    cargarHistorialBackend();
  }, [cargarHistorialBackend]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      historialCargado.current = false;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ✅ Guardar en historial - MEJORADO para evitar duplicados y mantener orden
  const guardarEnHistorial = useCallback(
    (texto: string) => {
      if (!mostrarHistorial) return;

      const textoNormalizado = texto.trim();
      if (!textoNormalizado) return;

      console.log("💾 Intentando guardar en historial desde hook:", textoNormalizado);

      setHistorial(prevHistorial => {
        // Eliminar duplicados (case insensitive) y mantener orden
        const historialLimpio = prevHistorial
          .map(item => item.trim())
          .filter(item => item.length > 0);

        const nuevoHistorial = [
          textoNormalizado,
          ...historialLimpio.filter(item =>
            item.toLowerCase() !== textoNormalizado.toLowerCase()
          )
        ].slice(0, 10); // Aumentado a 10 para coincidir con tu código

        // Guardar en localStorage
        try {
          localStorage.setItem(
            "historialBusquedas",
            JSON.stringify(nuevoHistorial)
          );
        } catch (error) {
          console.error("Error guardando historial en localStorage:", error);
        }

        console.log('💾 [HISTORIAL] Guardando búsqueda:', textoNormalizado);
        return nuevoHistorial;
      });
    },
    [mostrarHistorial]
  );

  // ✅ Limpiar historial backend
  const limpiarHistorialBackend = useCallback(async () => {
    try {
      const success = await HistoryService.clearHistorial(apiConfig?.endpoint);
      if (success) {
        setHistorial([]);
        setMostrarHistorialLocal(false);
        localStorage.removeItem("historialBusquedas");
        historialCargado.current = true;
        console.log('✅ [HISTORIAL] Historial limpiado correctamente por el usuario');
      } else {
        console.error('❌ [HISTORIAL] Error al limpiar historial en el backend');
      }
    } catch (error) {
      console.error('❌ [HISTORIAL] Error limpiando historial:', error);
      // Fallback: limpiar localStorage
      try {
        localStorage.removeItem("historialBusquedas");
        setHistorial([]);
        console.log('✅ [HISTORIAL] Historial limpiado localmente');
      } catch (localError) {
        console.error('❌ [HISTORIAL] Error limpiando localStorage:', localError);
      }
    }
  }, [apiConfig?.endpoint]);

  // ✅ Eliminar un solo elemento
  const eliminarDelHistorial = useCallback(
    (texto: string) => {
      setHistorial(prevHistorial => {
        const nuevoHistorial = prevHistorial.filter(item =>
          item.toLowerCase() !== texto.toLowerCase()
        );

        // Actualizar localStorage
        try {
          localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
        } catch (error) {
          console.error("Error actualizando localStorage:", error);
        }

        return nuevoHistorial;
      });
    },
    []
  );

  // ✅ Seleccionar item del historial
  const seleccionarDelHistorial = useCallback((texto: string) => {
    setMostrarHistorialLocal(false);
    return texto;
  }, []);

  // ✅ Seleccionar por índice
  const seleccionarPorIndice = useCallback(
    (indice: number): string | undefined => {
      if (indice >= 0 && indice < historial.length) {
        setMostrarHistorialLocal(false);
        return historial[indice];
      }
      return undefined;
    },
    [historial]
  );

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
    indiceSeleccionado,
    setIndiceSeleccionado,
    seleccionarPorIndice,
  };
}