"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Coords = { lat: number; lng: number };
type Suggestion = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
};

export default function SearchLocation({
  onPick,
  placeholder = "Buscar ubicación",
  className = "",
}: {
  onPick: (coords: Coords, label?: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // pequeña espera para no saturar la API
  useEffect(() => {
    if (!q || q.length < 3) {
      setItems([]);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&addressdetails=1&limit=8`;
        const res = await fetch(url, {
          headers: { "Accept-Language": "es" },
        });
        const data = (await res.json()) as Suggestion[];
        setItems(data);
        setOpen(true);
      } catch {
        setItems([]);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [q]);

  // cerrar dropdown al hacer click afuera
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const show = open && items.length > 0;

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => items.length && setOpen(true)}
        className="w-full border rounded px-3 py-2"
        placeholder={placeholder}
      />

      {show && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-auto bg-white border rounded shadow">
          {items.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onClick={() => {
                const lat = parseFloat(s.lat);
                const lng = parseFloat(s.lon);
                onPick({ lat, lng }, s.display_name);
                setQ(s.display_name);
                setOpen(false);
              }}
              className="text-left w-full px-3 py-2 hover:bg-gray-50"
            >
              {s.display_name}
            </button>
          ))}
          {items.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
          )}
        </div>
      )}
    </div>
  );
}
