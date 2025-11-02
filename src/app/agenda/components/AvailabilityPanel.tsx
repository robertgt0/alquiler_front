"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type UISlot = { label: string; startISO: string; endISO: string };

export function toYYYYMMDDLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

type Props = {
  providerId: string;
  selectedDate?: Date;
  slotMinutes?: number;
  hours?: string; // "08:00-12:00,14:00-18:00"
  onSelectTime: (label: string, slot: UISlot) => void;
};

export default function AvailabilityPanel({
  providerId,
  selectedDate,
  slotMinutes = 30,
  hours = "08:00-12:00,14:00-18:00",
  onSelectTime,
}: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [available, setAvailable] = useState<UISlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [lastReq, setLastReq] = useState<string | null>(null);

  async function load() {
    if (!API_URL) return setErr("Falta NEXT_PUBLIC_API_URL");
    if (!providerId || !selectedDate) return;
    try {
      setLoading(true);
      setErr(null);
      setAvailable([]);

      const ymd = toYYYYMMDDLocal(selectedDate);
      const url = `${API_URL}/api/devcode/providers/${providerId}/available-slots?date=${ymd}&slot=${slotMinutes}&hours=${encodeURIComponent(
        hours
      )}`;
      setLastReq(url);

      const res = await fetch(url);
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || `HTTP ${res.status}`);
      }
      const data = await res.json(); // { available, busy, ... }
      const slots: UISlot[] = (data.available || []).map((s: any) => {
        const start = new Date(s.start);
        const end = new Date(s.end);
        const label = `${start.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })} - ${end.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
        return { label, startISO: s.start, endISO: s.end };
      });
      setAvailable(slots);
    } catch (e: any) {
      setErr(e?.message || "No se pudo cargar disponibilidad");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId, selectedDate, slotMinutes, hours]);

  return (
    <div>
      {err && <div className="mb-2 text-sm text-red-600">⚠️ {err}</div>}
      {lastReq && <div className="mb-2 text-xs text-gray-500 break-all">Última solicitud: {lastReq}</div>}
      {loading && <div className="text-sm text-gray-500 mb-2">Cargando horarios...</div>}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {!loading && !err && selectedDate && available.length === 0 && (
          <div className="text-sm text-gray-500 border rounded-md p-4">No hay horarios disponibles para este día.</div>
        )}

        {available.map((slot) => (
          <button
            key={slot.startISO}
            onClick={() => onSelectTime(slot.label, slot)}
            className="w-full p-3 text-left rounded-lg border bg-white hover:bg-green-50 text-gray-700 border-gray-300 hover:border-green-300 transition"
          >
            {slot.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <Button variant="outline" size="sm" onClick={load} disabled={loading || !selectedDate}>
          {loading ? "Cargando..." : "Recargar"}
        </Button>
      </div>
    </div>
  );
}
