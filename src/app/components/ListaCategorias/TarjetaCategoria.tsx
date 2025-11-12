"use client";

import { useRouter } from "next/navigation";
import type { Categoria } from "./tipos";

type Props = {
  categoria: Categoria;
  onClick?: () => void;
};

// Función simple para crear un 'slug' desde el nombre
function crearSlug(texto: string): string {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .replace(/ y /g, '-') // Reemplaza " y "
    .replace(/ /g, '-')   // Reemplaza espacios
    .normalize("NFD")    // Quita tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, ''); // Quita caracteres no alfanuméricos
}

export default function TarjetaCategoria({ categoria, onClick }: Props) {
  const router = useRouter();

  const goMain = () => {
    onClick?.();
    const slug = crearSlug(categoria.name);
    router.push(`/servicios/${slug}`);
  };

  const goKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") goMain();
  };

  // --- Soporte icono ---
  const icon = categoria.iconUrl || "🔧"; // Usa el icono o un 'fallback'
  const isImage = false; // Asumimos que solo son emojis por ahora

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goMain}
      onKeyDown={goKey}
      aria-label={`Abrir categoría ${categoria.name}`}
      className="
        flex flex-col
        w-full h-full
        rounded-2xl border-2 border-blue-400 bg-white
        p-5 md:p-6
        shadow-sm hover:shadow-xl hover:border-blue-500
        transition-all duration-300 ease-in-out
        hover:-translate-y-1
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        hover:shadow-blue-300/50 focus-visible:shadow-blue-400/60
        min-h-40 sm:min-h-[170px] md:min-h-[180px] lg:min-h-[190px] 
      " 
      // ☝️ CORRECCIÓN: 'min-h-[160px]' cambiado a 'min-h-40'
    >
      {/* BLOQUE CENTRAL */}
      <div className="my-auto flex flex-col items-center text-center gap-3 md:gap-4">
        {/* Ícono */}
        <div className="flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400 bg-blue-50/20">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={icon}
                alt={categoria.name}
                className="h-5 w-5 object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <span className="text-[18px]" aria-hidden>
                {icon}
              </span>
            )}
          </div>
        </div>

        {/* Título / descripción */}
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-blue-900 leading-snug">
            {categoria.name}
          </h3>
          {categoria.description && (
            <p className="mt-1 text-xs md:text-sm text-blue-700/90 leading-snug line-clamp-2">
              {categoria.description}
            </p>
          )}
        </div>
      </div>

      {/* 👇 CORRECCIÓN:
        Se eliminó por completo el bloque del "Chip contador".
        Ya no causará errores de 'any'.
      */}
    </article>
  );
}