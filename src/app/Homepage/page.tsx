/// /src/app/Homepage/page.tsx

import Mapa from "../components/mapa/MapaWrapper";
import CarruselOfertas from "../components/CarruselOfertas/CarruselOfertas";
import HomeFixer from "../components/ListaCategorias/HomeFixer";
// import type { Categoria } from "./components/ListaCategorias/tipos"; // ← no se usa
import Footer from "../components/Footer/Footer";
import CarruselInspirador from "../components/CarruselInspirador/CarruselInspirador";
import Link from "next/link";
import categorias, { type CategoriaBase } from "../components/data/categoriasData";
import HelpButton from "../components/HelpButton/HelpButton";

// 🔸 Línea relacionada con la guía de usuario (comentada)
// import GiaUsuariosNuevos from "../components/guiaUsuarios/GiaUsuariosNuevos";

export default function Home() {
  return (
    <main>
      {/* --- Hero / inspiración --- */}
      <section id="carrusel" className="my-5">
        <CarruselInspirador />
      </section>

      {/* Botón de ayuda flotante */}
      <HelpButton />

      {/* --- Mapa --- */}
      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      {/* --- Servicios / categorías --- */}
      <section id="servicios" className="my-5 w-full">
        {/* HomeFixer solo necesita id, titulo, descripcion, icono */}
        <HomeFixer categorias={categorias as CategoriaBase[]} />
      </section>

      {/* --- Trabajos recientes --- */}
      <section id="trabajos-recientes" className="my-5 w-full">
        <CarruselOfertas />
      </section>

      {/* --- Acciones rápidas --- */}
      <section className="my-10">
        <div className="min-h-0 flex items-center justify-center">
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

      {/* 🔸 Sección de Guía de Usuarios Nuevos (comentada completamente)
          Esta parte era donde se mostraba una guía o tutorial para nuevos usuarios,
          pero se comenta para desactivar cualquier referencia a la guía. */}

      {/*
      <section id="gia-usuarios-nuevos" className="my-5 w-full">
        <GiaUsuariosNuevos />
      </section>
      */}

      {/* --- Pie de página --- */}
      <Footer />
    </main>
  );
}
