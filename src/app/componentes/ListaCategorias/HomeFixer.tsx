"use client";

import { useState } from "react";
import Lista from "./ListaCategorias";
import type { Categoria } from "./tipos";

const SERVICIOS_POR_PAGINA = 20; // 5 filas x 4 columnas

export default function HomeFixer({ categorias }: { categorias: Categoria[] }) {
  const [visibles, setVisibles] = useState(SERVICIOS_POR_PAGINA);

  const handleCategoriaClick = (c: Categoria) => {
    alert(`Seleccionaste: ${c.nombre}`);
  };

  const handleVerMas = () => {
    setVisibles((prev) => prev + SERVICIOS_POR_PAGINA);
  };

  return (
    <Lista
      categorias={categorias}
      onCategoriaClick={handleCategoriaClick}
      onVerMas={handleVerMas}
      maxVisible={visibles}
    />
  );
}
