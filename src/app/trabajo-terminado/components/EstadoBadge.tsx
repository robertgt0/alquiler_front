import React from "react";

export default function EstadoBadge({ estado }: { estado: string }) {
  // Solo “Terminado” se muestra verde, como exige el criterio.
  const isTerminado = estado === "Terminado";
  return (
    <span
      aria-label={`Estado: ${estado}`}
      className="inline-block rounded-md px-3 py-1 text-sm font-semibold"
      style={{
        background: isTerminado ? "#2ecc71" : "#9e9e9e",
        color: "white",
      }}
    >
      {estado}
    </span>
  );
}
