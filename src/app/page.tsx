// src/app/page.tsx
import Mapa from "@/app/components/mapa/MapaWrapper";
import CarruselOfertas from "@/app/components/CarruselOfertas/CarruselOfertas";
import HomeFixer from "@/app/components/ListaCategorias/HomeFixer";
// ❌ ELIMINADO: Ya no importamos 'Categoria' porque HomeFixer no lo necesita
// import type { Categoria } from "./components/ListaCategorias/tipos";
import Footer from "@/app/components/Footer/Footer";
import CarruselInspirador from "@/app/components/CarruselInspirador/CarruselInspirador";
import Link from "next/link";
// ❌ ELIMINADO: Ya no importamos los datos estáticos de 'categoriasData'
// import categorias, { type CategoriaBase } from "./components/data/categoriasData";

export default function Home() {
  return (
    <main>
      {/* Hero / inspiración */}
      <section className="my-5">
        <CarruselInspirador />
      </section>

      {/* Mapa */}
      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      {/* Servicios / categorías */}
      <section id="servicios" className="my-5 w-full">
        {/*
          ✅ SOLUCIÓN:
          Llamamos a HomeFixer SIN la prop 'categorias'.
          HomeFixer (que adentro llama a ListaCategorias) 
          se encargará de hacer el fetch por sí mismo.
        */}
        <HomeFixer />
      </section>

      {/* Trabajos recientes */}
      <section id="trabajos-recientes" className="my-5 w-full">
        <CarruselOfertas />
      </section>

      {/* Acciones rápidas (contenido que tenías en el segundo Home) */}
      {/* 👍 MANTENIDO: Todo tu código nuevo se queda intacto. */}
      <section className="my-10">
        <div className="min-h-[0] flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Acciones rápidas</h2>

            <div className="flex flex-col gap-4">
              <Link
                href="/register_a_job"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors text-center"
              >
                Agregar Disponibilidad
              </Link>

              <Link
                href="/agenda_proveedor"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors text-center"
              >
                Agendar tu servicio
              </Link>

              <Link
                href="/epic_VisualizadorDeTrabajosAgendadosVistaProveedor"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-center"
              >
                Trabajos Agendados (Vista-Proveedor)
              </Link>

              <Link
                href="/epic_VisualizadorDeTrabajosAgendadosVistaCliente"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                Mis Trabajos (Vista-Cliente)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}