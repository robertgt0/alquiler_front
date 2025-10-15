"use client";

import TarjetaCategoria from "./TarjetaCategoria";
import BotonVerMas from "./BotonVerMas";
import type { Categoria } from "./tipos";

type Props = {
  categorias: Categoria[];
  onCategoriaClick?: (c: Categoria) => void;
  onVerMas?: () => void;
  maxVisible?: number;
};

export default function ListaCategorias({
  categorias,
  onCategoriaClick,
  onVerMas,
  maxVisible,
}: Props) {
  const visibles = maxVisible ? categorias.slice(0, maxVisible) : categorias;
  const hayMas = maxVisible ? categorias.length > maxVisible : false;

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 flex items-center justify-center gap-2">
          <span>Servicios Disponibles</span>
        </h2>
        <p className="mt-1 sm:mt-2 text-blue-700/90 text-sm sm:text-base">
          Descubre todos nuestros servicios
        </p>
      </div>

      {/* Grid: 2 columnas (sm), 4 columnas (lg) */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {visibles.map((c) => (
          <TarjetaCategoria key={c.id} categoria={c} onClick={onCategoriaClick} />
        ))}
      </div>

      <div className="flex justify-center">
        {hayMas && <BotonVerMas onClick={onVerMas} />}
      </div>
    </section>
  );
}