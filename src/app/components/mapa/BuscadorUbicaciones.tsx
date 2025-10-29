// components/BuscarUbicacion.tsx

"use client";

import { useState } from "react";
import type { Ubicacion } from "../../types";

interface BuscadorUbicacionesProps {
  ubicaciones: Ubicacion[];
  onBuscar: (ubicacion: Ubicacion) => void;
  ubicacionActual?: Ubicacion | null;
}

export default function BuscadorUbicaciones({ 
  ubicaciones, 
  onBuscar, 
  ubicacionActual = null 
}: BuscadorUbicacionesProps) {
  const [seleccionada, setSeleccionada] = useState<Ubicacion | null>(null);

  const esMismaUbicacion = Boolean(
    seleccionada && 
    ubicacionActual && 
    seleccionada.id === ubicacionActual.id
  );

  const handleSeleccionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    const ubicacion = ubicaciones.find(u => u.id.toString() === id) || null;
    setSeleccionada(ubicacion);
  };

  const handleBuscar = () => {
    if (seleccionada && !esMismaUbicacion) {
      onBuscar(seleccionada);
    }
  };

  const botonDeshabilitado = !seleccionada || esMismaUbicacion;

  return (
    <div className="bg-white rounded-md shadow-md p-3 mb-2 w-full max-w-4xl mx-auto transition-all duration-300">
      {/* ✅ Título actualizado */}
      <h2 className="text-lg sm:text-xl font-bold text-[#2a87ff] mb-2">
        Buscar ubicación
      </h2>

      <div className="flex flex-row flex-wrap gap-2 items-end">
        <div className="flex-1">
          <select
            value={seleccionada?.id?.toString() ?? ""}
            onChange={handleSeleccionChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-black bg-white text-sm sm:text-base"
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
          disabled={botonDeshabilitado}
          className={`px-4 py-2 rounded-md font-medium text-sm sm:text-base transition duration-200 min-w-[100px] h-[40px] ${
            !botonDeshabilitado
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          title={esMismaUbicacion ? "Ya estás en esta ubicación" : "Buscar"}
        >
          Buscar
        </button>
      </div>

      {seleccionada && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200 max-h-32 overflow-y-auto">
          {/* ✅ Textos actualizados */}
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Ubicación seleccionada:
          </p>
          <ul className="list-disc pl-4">
            <li className="font-semibold text-blue-800 text-sm sm:text-base">
              {seleccionada.nombre}
              {esMismaUbicacion && (
                <span className="ml-2 text-green-600 text-xs sm:text-sm font-normal">
                  ✓ Ya estás aquí
                </span>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}