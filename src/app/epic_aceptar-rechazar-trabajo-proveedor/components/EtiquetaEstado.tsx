"use client";

import React from "react";
import { EstadoTrabajo } from "../interfaces/Trabajo.interface";

export default function EtiquetaEstado({ estado }: { estado: EstadoTrabajo }) {
  const styles: Record<EstadoTrabajo, string> = {
    Pendiente: "bg-[#F0D92B] text-black",
    Confirmado: "bg-blue-100 text-blue-800",
    Cancelado: "bg-red-100 text-red-700",
    Terminado: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-6 sm:px-8 py-1 rounded-md text-[16px] sm:text-[18px] font-normal Poppins shadow-sm ${styles[estado]}`}
    >
      {estado}
    </span>
  );
}
