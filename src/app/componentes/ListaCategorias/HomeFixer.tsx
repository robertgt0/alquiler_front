"use client";

import Lista from "./ListaCategorias";
import type { Categoria } from "./tipos";

export default function HomeFixer({ categorias }: { categorias: Categoria[] }) {
  const handleCategoriaClick = (c: Categoria) => {
    alert(`Seleccionaste: ${c.nombre}`);
  };

  const handleVerMas = () => {
    alert("Cargar más categorías…");
  };

  return (
    <Lista
      categorias={categorias}
      onCategoriaClick={handleCategoriaClick}
      onVerMas={handleVerMas}
    />
  );
}
