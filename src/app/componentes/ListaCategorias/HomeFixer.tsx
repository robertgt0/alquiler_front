"use client";

import Lista from "./ListaCategorias";
import type { Categoria } from "./tipos";

export default function HomeFixer({ categorias }: { categorias: Categoria[] }) {
  const handleCategoriaClick = (c: Categoria) => {
    alert(`Seleccionaste: ${c.titulo}`);
  };

  return (
    <Lista
      categorias={categorias}
      // si quieres capturar el click en cada tarjeta, descomenta:
      // onCategoriaClick={handleCategoriaClick}
    />
  );
}
