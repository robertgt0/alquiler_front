"use client";
import type { Categoria } from "./tipos";

type Props = { categoria: Categoria; onClick?: (c: Categoria) => void };

export default function TarjetaCategoria({ categoria, onClick }: Props) {
  return (
        <button
      type="button"
      onClick={() => onClick?.(categoria)}
      className="
        w-full text-left rounded-xl border-2 border-blue-600/70 bg-white p-3 md:p-5
        transition-all duration-150
        hover:-translate-y-0.5 hover:shadow-md
        active:translate-y-0 active:shadow-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
      "
      aria-label={`Abrir categoría ${categoria.nombre}`}
    >
      {/* Icono en círculo */}
      <div className="flex justify-center">
        <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl border-2 border-blue-600/70 bg-blue-50 flex items-center justify-center">
          <span className="text-lg md:text-xl text-blue-600">{categoria.icono ?? "🔧"}</span>
        </div>
      </div>

      {/* Título / descripción */}
      <div className="mt-3 md:mt-4 text-center">
        <h3 className="text-base md:text-lg font-semibold text-blue-900">{categoria.nombre}</h3>
        {categoria.descripcion && (
          <p className="mt-1 text-xs md:text-sm text-blue-700/90">{categoria.descripcion}</p>
        )}
      </div>

      {/* Pill contador */}
      {typeof categoria.trabajos === "number" && (
        <div className="mt-3 md:mt-4 flex justify-center">
          <span
            className="
              rounded-full border border-blue-600/50 bg-blue-50
              px-2.5 py-1 text-[10px] md:text-xs font-medium text-blue-800
            "
          >
            {categoria.trabajos} servicios
          </span>
        </div>
      )}
    </button>

  );
}
