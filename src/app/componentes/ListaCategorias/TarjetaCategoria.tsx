"use client";
import type { Categoria } from "./tipos";

type Props = { categoria: Categoria; onClick?: (c: Categoria) => void };

export default function TarjetaCategoria({ categoria, onClick }: Props) {
  const goMain = () => onClick?.(categoria);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goMain();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goMain}
      onKeyDown={onKey}
      aria-label={`Abrir categoría ${categoria.nombre}`}
      className="
        w-full rounded-2xl border border-blue-600/70 bg-white p-4 md:p-5
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-400
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      "
    >
      {/* Ícono en círculo */}
      <div className="flex justify-center">
        <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl border-2 border-blue-600/70 bg-blue-50 flex items-center justify-center shrink-0">
          <span className="text-lg md:text-xl text-blue-600" style={{ minWidth: 24, minHeight: 24 }}>
            {categoria.icono ?? "🔧"}
          </span>
        </div>
      </div>

      {/* Título / descripción */}
      <div className="mt-3 md:mt-4 text-center">
        <h3 className="text-base md:text-lg font-semibold text-blue-900 break-words">
          {categoria.nombre}
        </h3>
        {categoria.descripcion && (
          <p className="mt-1 text-xs md:text-sm text-blue-700/90 line-clamp-2">
            {categoria.descripcion}
          </p>
        )}
      </div>

      {/* Chip contador: botón separado, sin anidar botones */}
      {typeof categoria.trabajos === "number" && (
        <div className="mt-3 md:mt-4 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-blue-600/50 bg-blue-50 px-3 py-1 text-[11px] md:text-xs font-medium text-blue-800 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`${categoria.trabajos} servicios en ${categoria.nombre}`}
            onClick={(e) => {
              e.stopPropagation(); // evita activar el click del contenedor
              // aquí navegas a la lista de servicios de la categoría
              // router.push(`/servicios/${categoria.slug}?tab=resultados`);
              onClick?.(categoria);
            }}
          >
            {categoria.trabajos} servicios
          </button>
        </div>
      )}
    </article>
  );
}
