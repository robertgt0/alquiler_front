"use client";
import { useEffect, useState } from "react";
import type { TrabajoTerminado } from "../interfaces/Trabajo.interface";
import { fetchTrabajosTerminados, subscribeTrabajosTerminados } from "../services/TrabajoTerminados.service";

export function useTrabajosTerminados() {
  const [data, setData] = useState<TrabajoTerminado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        // Puedes forzar simulateError:true para probar el mensaje de error
        const initial = await fetchTrabajosTerminados({ delayMs: 300 });
        setData(initial);
        setLoading(false);

        unsub = subscribeTrabajosTerminados((fresh) => setData(fresh), 10000);
      } catch (e: any) {
        setError(e?.message ?? "Ocurrió un problema al cargar los trabajos.");
        setLoading(false);
      }
    })();

    return () => unsub();
  }, []);

  return { data, loading, error };
}