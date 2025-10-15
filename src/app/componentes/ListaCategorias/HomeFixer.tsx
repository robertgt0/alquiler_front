"use client";

import Lista from "./ListaCategorias";
import type { Categoria } from "./tipos";

export default function HomeFixer({ categorias }: { categorias: Categoria[] }) {
  // si más adelante quieres usar el click, puedes reactivar esta función:
  // const handleCategoriaClick = (c: Categoria) => {
  //   alert(`Seleccionaste: ${c.titulo}`);
  // };

  // ✅ Filtramos los datos para eliminar el campo totalServicios antes de pasarlos
  const categoriasSinConteo = categorias.map((c) => {
    const { totalServicios, ...resto } = c;
    return resto;
  });

  return (
    <Lista
      categorias={categoriasSinConteo}
      // si quieres capturar el click en cada tarjeta, descomenta:
      // onCategoriaClick={handleCategoriaClick}
    />
  );
}
