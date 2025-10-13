// components/BuscarUbicaciones.tsx

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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-1 w-full max-w-6xl mx-1 px-1 transition-all duration-300">


      <h2 className="text-xl font-bold text-gray-900 mb-2">Buscar ubicación</h2>
      <div className="flex flex-row flex-wrap gap-4 items-end">
        <div className="flex-1">
          <select
            value={seleccionada?.id?.toString() ?? ""}
            onChange={handleSeleccionChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-black bg-white" 
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
          className={`px-6 py-3 rounded-lg font-medium transition duration-200 min-w-[120px] h-[50px] ${
            seleccionada
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              : "bg-gray-200 text-black cursor-not-allowed"
          }`}
        >
          Buscar
        </button>
      </div>

      {seleccionada && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-h-40 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700 mb-1">Ubicación seleccionada:</p>
          <ul className="list-disc pl-5">
            <li className="font-semibold text-blue-800">{seleccionada.nombre}</li>
          </ul>
        </div>
      )}
    </div>
  );
}