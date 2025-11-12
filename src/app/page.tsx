// src/app/page.tsx
import Mapa from "./components/mapa/MapaWrapper";
import CarruselOfertas from "./components/CarruselOfertas/CarruselOfertas";
import HomeFixer from "./components/ListaCategorias/HomeFixer";
// ❌ Eliminamos la importación de tipos estáticos
// import type { Categoria } from "./components/ListaCategorias/tipos";
import Footer from "./components/Footer/Footer";
import CarruselInspirador from "./components/CarruselInspirador/CarruselInspirador";

// ❌ ELIMINADO: Ya no importamos los datos estáticos que borraste
// import categorias, { type CategoriaBase } from "./components/data/categoriasData";

export default function Home() {
  return (
    <main>
      <section className="my-5">
        <CarruselInspirador />
      </section>

      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      <section id="servicios" className="my-5 w-full">
        {/* ✅ SOLUCIÓN:
          Llamamos a HomeFixer SIN la prop 'categorias'.
          Ahora, HomeFixer se encargará de hacer el fetch por sí mismo.
        */}
        <HomeFixer />
      </section>

      <section id="trabajos-recientes" className="my-5 w-full">
        <CarruselOfertas />
      </section>

      <Footer />
    </main>
  );
}