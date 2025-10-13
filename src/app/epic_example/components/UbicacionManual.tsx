"use client";
import React from "react";

interface Props {
  direccion: string;
  notas: string;
  onChange: (field: string, value: string) => void;
  errorMessage?: string;
}

export default function UbicacionManual({ direccion, notas, onChange, errorMessage }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección del servicio <span className="text-red-500">*</span>
        </label>
        <input
          id="direccion"
          type="text"
          placeholder="Ej: Av. Central #123, Col. Centro"
          value={direccion}
          onChange={(e) => onChange("direccion", e.target.value)}
          aria-invalid={!!errorMessage}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2
            ${errorMessage ? "border-red-400 ring-red-200" : "border-gray-300 focus:ring-[#ffffff]"}
          text-[#545864]`}
        />
        {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
      </div>

      <div>
        <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales (opcional)
        </label>
        <textarea
          id="notas"
          placeholder="Ej: Edificio azul, segundo piso, apartamento 201"
          value={notas}
          onChange={(e) => onChange("notas", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4289CC] resize-none   text-[#545864]"
         

        />
      </div>
    </div>
  );
}
