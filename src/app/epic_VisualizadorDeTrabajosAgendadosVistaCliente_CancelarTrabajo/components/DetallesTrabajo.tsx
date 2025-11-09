import React from "react";
import { Trabajo } from "../interfaces/Trabajo.interface";

interface DetallesTrabajoProps {
  trabajo: Trabajo;
}

const DetallesTrabajo: React.FC<DetallesTrabajoProps> = ({ trabajo }) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex">
        <span className="font-bold text-gray-800 w-32">Proveedor:</span>
        <span className="text-gray-700">{trabajo.proveedor}</span>
      </div>

      <div className="flex">
        <span className="font-bold text-gray-800 w-32">Fecha:</span>
        <span className="text-gray-700">{trabajo.fecha}</span>
      </div>

      <div className="flex">
        <span className="font-bold text-gray-800 w-32">Horario:</span>
        <span className="text-gray-700">{trabajo.horario}</span>
      </div>

      <div className="flex">
        <span className="font-bold text-gray-800 w-32">Descripción:</span>
        <span className="text-gray-700">{trabajo.descripcion}</span>
      </div>

      <div className="flex">
        <span className="font-bold text-gray-800 w-32">Costo:</span>
        <span className="text-gray-700">{trabajo.costo} Bs</span>
      </div>

      <div className="flex items-center">
        <span className="font-bold text-gray-800 w-32">Estado:</span>
        <span
          className={`px-4 py-1 rounded-md font-semibold ${
            trabajo.estado === "Confirmado"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {trabajo.estado}
        </span>
      </div>
    </div>
  );
};

export default DetallesTrabajo;