"use client";
import { useState } from "react";
import type { LocationDTO } from "@/types/fixer";
import { LocationPicker } from "./LocationPicker";
import SelectedMap from "./SelectedMap";

export function LocationField({
  value, onChange
}: { value: LocationDTO | null; onChange: (v: LocationDTO | null) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="font-semibold text-lg">Establece tu ubicación de trabajo</label>
        <p className="text-sm text-gray-600">
          Esta es la zona donde estarás disponible para trabajar, puedes cambiar esto más adelante.
        </p>
      </div>

      {!value ? (
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setOpen(true)}>
          Añadir mi ubicación
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm">
              <b>Lat:</b> {value.lat.toFixed(6)} | <b>Lng:</b> {value.lng.toFixed(6)}
              {value.address ? (
                <span className="block text-gray-600">
                  <b>Dirección:</b> {value.address}
                </span>
              ) : null}
            </div>

        

            <button className="px-3 py-2 rounded border" onClick={() => setOpen(true)}>
              Cambiar ubicación
            </button>

            <button className="px-3 py-2 rounded" onClick={() => onChange(null)}>
              Quitar
            </button>
          </div>

          {/* 👇 Vista previa del mapa con el punto seleccionado */}
          <SelectedMap lat={value.lat} lng={value.lng} />
        </div>
      )}

      {open && (
        <LocationPicker
          initial={value ?? undefined}
          onConfirm={(loc) => { onChange(loc); setOpen(false); }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
