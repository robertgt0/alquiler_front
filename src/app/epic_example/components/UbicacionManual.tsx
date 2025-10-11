"use client";
import { useState } from "react";

interface Props {
  direccion: string;
  notas: string;
  onChange: (field: string, value: string) => void;
}

export default function UbicacionManual({ direccion, notas, onChange }: Props) {
  const [error, setError] = useState("");

  const validarDireccion = () => {
    if (!direccion.trim()) {
      setError("La dirección del servicio es obligatoria.");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        validarDireccion();
      }}
      className="flex flex-col gap-4"
    >
      {/* Campo dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección del servicio <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Ej: Av. Central #123, Zona Sur"
          value={direccion}
          onChange={(e) => onChange("direccion", e.target.value)}
          onBlur={validarDireccion}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#4289CC]"
          }`}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      {/* Campo notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales (opcional)
        </label>
        <textarea
          placeholder="Ej: Edificio azul, 2do piso, departamento 4B"
          value={notas}
          onChange={(e) => onChange("notas", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4289CC] resize-none"
          rows={3}
        />
      </div>
    </form>
  );
}
