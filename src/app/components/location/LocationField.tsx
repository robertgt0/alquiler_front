"use client";

import { useState } from "react";
import type { LocationDTO } from "@/types/fixer";
import LocationPicker from "./LocationPicker";
import SelectedMap from "./SelectedMap";

type Props = {
  value: LocationDTO | null;
  onChange: (value: LocationDTO | null) => void;
};

export function LocationField({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-lg font-semibold">Establece tu ubicacion de trabajo</label>
        <p className="text-sm text-gray-600">
          Esta es la zona donde estaras disponible para trabajar; puedes actualizarla mas adelante.
        </p>
      </div>

      {!value ? (
        <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={() => setOpen(true)}>
          Anadir mi ubicacion
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm">
              <b>Lat:</b> {value.lat.toFixed(6)} | <b>Lng:</b> {value.lng.toFixed(6)}
              {value.address ? (
                <span className="block text-gray-600">
                  <b>Direccion:</b> {value.address}
                </span>
              ) : null}
            </div>
            <button className="rounded border px-3 py-2" onClick={() => setOpen(true)}>
              Cambiar ubicacion
            </button>
            <button className="rounded px-3 py-2" onClick={() => onChange(null)}>
              Quitar
            </button>
          </div>
          <SelectedMap lat={value.lat} lng={value.lng} />
        </div>
      )}

      {open && (
        <div className="rounded-lg border border-slate-200 p-3">
          <LocationPicker
            value={value ?? undefined}
            onChange={(loc) => {
              onChange(loc);
              setOpen(false);
            }}
          />
          <div className="mt-2 text-right">
            <button className="text-sm text-slate-600 underline" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
