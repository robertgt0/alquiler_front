"use client";

import Lista from "./ListaCategorias";
import type { Categoria } from "./tipos";

// Acepta categorías sin el campo totalServicios
type CategoriaBase = Omit<Categoria, "totalServicios">;

export default function HomeFixer({ categorias }: { categorias: CategoriaBase[] }) {
  // Si luego quieres manejar clicks:
  // const handleCategoriaClick = (c: CategoriaBase) => { ... };

  return (
    <Lista
      categorias={categorias as unknown as Categoria[]} // <- si Lista tipa a Categoria, esto permite pasar el mínimo necesario
      // onCategoriaClick={handleCategoriaClick}
    />
  );
}
