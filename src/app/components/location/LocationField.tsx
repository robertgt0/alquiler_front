// src/app/components/location/LocationField.tsx
"use client";
import { useState } from "react";
import type { LocationDTO } from "@/types/fixer";
import LocationPicker from "./LocationPicker";
import SelectedMap from "./SelectedMap";

export function LocationField({
  value,
  onChange,
}: {
  value: LocationDTO | null;
  onChange: (v: LocationDTO | null) => void;
}) {
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
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setOpen(true)}
        >
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

            <button
              className="px-3 py-2 rounded border"
              onClick={() => setOpen(true)}
            >
              Cambiar ubicación
            </button>

            <button
              className="px-3 py-2 rounded"
              onClick={() => onChange(null)}
            >
              Quitar
            </button>
          </div>

          {/* 👇 Vista previa del mapa con el punto seleccionado */}
          <SelectedMap lat={value.lat} lng={value.lng} />
        </div>
      )}

      {/* Modal ligero para seleccionar ubicación */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded max-w-3xl w-full p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Selecciona ubicación</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 rounded border text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <div className="mb-3">
              <LocationPicker
                value={value ? { lat: value.lat, lng: value.lng } : undefined}
                onChange={(coords) => {
                  // Construimos un LocationDTO mínimo con lat/lng.
                  // Si tu LocationDTO requiere otros campos, añádelos aquí.
                  const loc = { lat: coords.lat, lng: coords.lng } as LocationDTO;
                  onChange(loc);
                  setOpen(false);
                }}
                height={400}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
