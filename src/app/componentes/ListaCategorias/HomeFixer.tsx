"use client";

import Lista from "./ListaCategorias";
import type { Categoria } from "./tipos";

export default function HomeFixer({ categorias }: { categorias: Categoria[] }) {
  const handleCategoriaClick = (c: Categoria) => {
    alert(`Seleccionaste: ${c.nombre}`);
  };

  return (
    <Lista
      categorias={categorias}
      // onVerMas ya no es necesario
      // onCategoriaClick={handleCategoriaClick} // si lo usas en TarjetaCategoria
    />
  );
}
