"use client";

// Mantenemos la importación del componente Lista (que es ListaCategorias.tsx)
import Lista from "./ListaCategorias";

// ❌ Ya no importamos 'Categoria' ni 'CategoriaBase' porque este
//    componente ya no recibe la prop 'categorias'.
// import type { Categoria } from "./tipos";
// type CategoriaBase = Omit<Categoria, "totalServicios">;


// ❌ Quitamos 'categorias' de los argumentos de la función.
//    Ahora HomeFixer ya no recibe props.
export default function HomeFixer() {
  // Si luego quieres manejar clicks, esa lógica
  // ahora debería vivir dentro de 'ListaCategorias.tsx'
  // const handleCategoriaClick = (c: Categoria) => { ... };

  return (
    // ❌ Quitamos la prop 'categorias' de la llamada al componente.
    //    El componente 'Lista' ahora hace el fetch por sí mismo.
    <Lista
      // onCategoriaClick={handleCategoriaClick}
    />
  );
}