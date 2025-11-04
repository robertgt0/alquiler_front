// src/app/Homepage/page.tsx

/*
 * IMPORTANTE:
 * He cambiado tus rutas de "./components/..." a "../components/..."
 * porque ahora este archivo está dentro de la carpeta 'Homepage',
 * y necesita "subir un nivel" para encontrar la carpeta 'components'.
*/
import Mapa from "../components/mapa/MapaWrapper";
import CarruselOfertas from "../components/CarruselOfertas/CarruselOfertas";
import HomeFixer from "../components/ListaCategorias/HomeFixer";
import type { Categoria } from "../components/ListaCategorias/tipos";
import Footer from "../components/Footer/Footer";
import CarruselInspirador from "../components/CarruselInspirador/CarruselInspirador";

import categorias, { type CategoriaBase } from "../components/data/categoriasData";

// Es buena práctica que la función se llame como la página
export default function Homepage() {
  return (
    <main>
      <section className="my-0">
        <CarruselInspirador />
      </section>

      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      <section id="servicios" className="my-5 w-full">
        {/* HomeFixer solo necesita id, titulo, descripcion, icono */}
        <HomeFixer categorias={categorias as CategoriaBase[]} />
      </section>

      <section id="trabajos-recientes" className="my-5 w-full">
        <CarruselOfertas />
      </section>

      <Footer />
    </main>
  );
}