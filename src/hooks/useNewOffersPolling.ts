// src/hooks/useNewOffersPolling.ts
import { useState, useEffect, useRef } from 'react';

interface UseNewOffersPollingOptions {
  clienteId: string;
  enabled?: boolean;
  intervalMs?: number; // default 15 minutos
  onNewOffers?: (count: number, servicios: any[]) => void;
}

export function useNewOffersPolling({
  clienteId,
  enabled = true,
  intervalMs = 15 * 60 * 1000, // 15 minutos
  onNewOffers,
}: UseNewOffersPollingOptions) {
  const [nuevasOfertas, setNuevasOfertas] = useState(0);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const checkNewOffers = async () => {
    if (!enabled || !clienteId) return;

    try {
      setChecking(true);
      setError(null);

      const res = await fetch(
        `${API_URL}/api/devcode/ofertas/nuevas/${clienteId}?minutos=15`
      );

      if (!res.ok) throw new Error('Error al verificar nuevas ofertas');

      const data = await res.json();

      if (data.success && data.nuevas > 0) {
        setNuevasOfertas(data.nuevas);
        onNewOffers?.(data.nuevas, data.servicios || []);
      } else {
        setNuevasOfertas(0);
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      console.error('[useNewOffersPolling] Error:', err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!enabled || !clienteId) return;

    // Verificar inmediatamente al montar
    checkNewOffers();

    // Configurar intervalo
    intervalRef.current = setInterval(checkNewOffers, intervalMs);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [clienteId, enabled, intervalMs]);

  const markAsRead = async (serviciosIds: string[]) => {
    try {
      const res = await fetch(`${API_URL}/api/devcode/ofertas/marcar-vistas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId, serviciosIds }),
      });

      if (!res.ok) throw new Error('Error al marcar ofertas como vistas');

      setNuevasOfertas(0);
      return await res.json();
    } catch (err: any) {
      console.error('[markAsRead] Error:', err);
      throw err;
    }
  };

  return {
    nuevasOfertas,
    checking,
    error,
    checkNewOffers,
    markAsRead,
  };
}