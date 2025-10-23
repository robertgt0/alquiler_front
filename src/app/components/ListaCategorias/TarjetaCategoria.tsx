"use client";

import { useRouter } from "next/navigation";
import type { Categoria } from "./tipos";

type Props = {
  categoria: Categoria;
  onClick?: () => void;
};

export default function TarjetaCategoria({ categoria, onClick }: Props) {
  const router = useRouter();

  const goMain = () => {
    onClick?.(); // dispara el callback opcional si lo pasas desde arriba
    router.push(`/servicios/${categoria.slug ?? ""}`);
  };

  const goKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") goMain();
  };

  // --- Soporte icono como URL/ruta o como emoji/texto ---
  const icon = (categoria as { iconoUrl?: string; icono?: string }).iconoUrl ?? (categoria as { iconoUrl?: string; icono?: string }).icono ?? "";
  const isImage =
    typeof icon === "string" &&
    (
      /^(https?:\/\/|\/|\.{1,2}\/)/i.test(icon) ||          // http(s), /, ./, ../
      /\.(svg|png|jpg|jpeg|webp|gif)$/i.test(icon)          // extensiones típicas
    );

  return (
    <article
          role="button"
          tabIndex={0}
          onClick={goMain}
          onKeyDown={goKey}
          aria-label={`Abrir categoría ${categoria.titulo}`}
          className="w-full rounded-2xl border-2 border-blue-400 bg-white p-4 md:p-5
                    shadow-sm hover:shadow-xl hover:border-blue-500
                    transition-all duration-300 ease-in-out
                    hover:-translate-y-1
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    hover:shadow-blue-300/50 focus-visible:shadow-blue-400/60"
    >


      {/* Ícono */}
      <div className="flex justify-center mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400 bg-blue-50/20">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={icon}
              alt={categoria.titulo}
              className="h-6 w-6 object-contain"
              onError={(e) => {
                // Si la URL existe pero no carga, escondemos la imagen y dejamos el contorno
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-base" aria-hidden>
              {icon || "🔧"}
            </span>
          )}
        </div>
      </div>

      {/* Título / descripción */}
      <div className="text-center">
        <h3 className="font-semibold text-sm sm:text-base text-blue-900">
          {categoria.titulo}
        </h3>
        {categoria.descripcion && (
          <p className="mt-1 text-xs md:text-sm text-blue-700/90 line-clamp-2">
            {categoria.descripcion}
          </p>
        )}
      </div>

      {/* Chip contador */}
      {typeof categoria.totalServicios === "number" && (
        <div className="mt-3 md:mt-4 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-blue-600/50 bg-blue-50 px-3 py-1 text-[11px] sm:text-xs text-blue-700
                       hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`${categoria.totalServicios} servicios en ${categoria.titulo}`}
            onClick={(e) => {
              e.stopPropagation(); // evita que dispare el click del <article>
              router.push(`/servicios/${categoria.slug ?? ""}?tab=resultados`);
            }}
          >
            {categoria.totalServicios} servicios
          </button>
        </div>
      )}
    </article>
  );
}
