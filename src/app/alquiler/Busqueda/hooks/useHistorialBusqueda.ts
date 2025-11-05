
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
  private static API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:5000/api";

  static async getHistorial(endpoint?: string): Promise<string[]> {
    try {
      const apiEndpoint =
        endpoint || `${this.API_BASE}/borbotones/search/history`;
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
      const apiEndpoint =
        endpoint || `${this.API_BASE}/borbotones/search/history`;
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
        setHistorial(terminos);
        console.log("📚 [HISTORIAL] Historial cargado:", terminos);
      } else {
        // Si viene vacío, igual seteamos [] para que se muestre el mensaje
        const stored = localStorage.getItem("historialBusquedas");
        if (stored) {
          setHistorial(JSON.parse(stored));
        } else {
          setHistorial([]);
        }
        console.log("📚 [HISTORIAL] Historial vacío o no hay localStorage");
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      try {
        const stored = localStorage.getItem("historialBusquedas");
        setHistorial(stored ? JSON.parse(stored) : []);
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

  // ✅ Guardar en historial
  const guardarEnHistorial = useCallback(
    (texto: string) => {
      if (!mostrarHistorial) return;

      const textoNormalizado = texto.trim();
      if (!textoNormalizado) return;

      const nuevoHistorial = Array.from(
        new Set([textoNormalizado, ...historial])
      ).slice(0, 5);

      setHistorial(nuevoHistorial);
      try {
        localStorage.setItem(
          "historialBusquedas",
          JSON.stringify(nuevoHistorial)
        );
      } catch (error) {
        console.error("Error guardando historial en localStorage:", error);
      }
    },
    [historial, mostrarHistorial]
  );

  // ✅ Limpiar historial backend
  const limpiarHistorialBackend = useCallback(async () => {
    try {
      const success = await HistoryService.clearHistorial(apiConfig?.endpoint);
      if (success) {
        setHistorial([]);
        setMostrarHistorialLocal(false);
        localStorage.removeItem("historialBusquedas");
        console.log("✅ Historial limpiado correctamente");
      } else {
        console.error("❌ Error al limpiar historial en el backend");
      }
    } catch (error) {
      console.error("❌ Error limpiando historial:", error);
    }
  }, [apiConfig?.endpoint]);

  // ✅ Eliminar un solo elemento
  const eliminarDelHistorial = useCallback(
    (texto: string) => {
      const nuevoHistorial = historial.filter((item) => item !== texto);
      setHistorial(nuevoHistorial);
      localStorage.setItem("historialBusquedas", JSON.stringify(nuevoHistorial));
    },
    [historial]
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
