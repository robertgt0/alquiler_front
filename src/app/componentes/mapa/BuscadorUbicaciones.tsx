// components/BuscarUbicacion.tsx

"use client";

import { useState } from "react";
import type { Ubicacion } from "../../types";

interface BuscadorUbicacionesProps {
  ubicaciones: Ubicacion[];
  onBuscar: (ubicacion: Ubicacion) => void;
}

export default function BuscadorUbicaciones({ ubicaciones, onBuscar }: BuscadorUbicacionesProps) {
  const [seleccionada, setSeleccionada] = useState<Ubicacion | null>(null);

  const handleSeleccionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    const ubicacion = ubicaciones.find(u => u.id.toString() === id) || null;
    setSeleccionada(ubicacion);
  };

  const handleBuscar = () => {
    if (seleccionada) {
      onBuscar(seleccionada);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-3 mb-2 w-full max-w-4xl mx-auto transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Buscar ubicación</h2>

      <div className="flex flex-row flex-wrap gap-2 items-end">
        <div className="flex-1">
          <select
            value={seleccionada?.id?.toString() ?? ""}
            onChange={handleSeleccionChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-black bg-white text-sm"
            aria-label="Selecciona una ubicación"
          >
            <option value="">Selecciona una ubicación</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id.toString()}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleBuscar}
          disabled={!seleccionada}
          className={`px-4 py-2 rounded-md font-medium text-sm transition duration-200 min-w-[100px] h-[40px] ${
            seleccionada
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              : "bg-gray-200 text-black cursor-not-allowed"
          }`}
        >
          Buscar
        </button>
      </div>

      {seleccionada && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200 max-h-32 overflow-y-auto">
          <p className="text-xs font-medium text-gray-700 mb-1">Ubicación seleccionada:</p>
          <ul className="list-disc pl-4">
            <li className="font-semibold text-blue-800 text-sm">{seleccionada.nombre}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
