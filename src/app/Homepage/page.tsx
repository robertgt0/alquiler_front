"use client"; // 👈 1. Necesario para usar hooks

import { useState, useEffect } from "react"; // 👈 2. Importar hooks
import Link from "next/link"; // 👈 Importar Link

/*
 * IMPORTANTE:
 * Todas las rutas ahora usan "../" para subir un nivel
 */
import Mapa from "../components/mapa/MapaWrapper";
import CarruselOfertas from "../components/CarruselOfertas/CarruselOfertas";
import HomeFixer from "../components/ListaCategorias/HomeFixer";
import Footer from "../components/Footer/Footer";
import CarruselInspirador from "../components/CarruselInspirador/CarruselInspirador";
import GiaUsuariosNuevos from "../components/guiaUsuarios/GiaUsuariosNuevos";
import categorias, { type CategoriaBase } from "../components/data/categoriasData";
import HelpButton from "../components/HelpButton/HelpButton"; // 👈 Importar HelpButton
import ModalGuiaUsuario from "../components/guiaUsuarios/modalUsuario"; // 👈 3. Importar tu modal

// Es buena práctica que la función se llame como la página
export default function Homepage() {
  // 4. Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 5. Efecto para comprobar si el modal debe mostrarse
  useEffect(() => {
    const noMostrarGuia = localStorage.getItem('noMostrarGuia');
    if (noMostrarGuia !== 'true') {
      setIsModalOpen(true);
    }
  }, []); // El array vacío asegura que esto solo se ejecute una vez

  return (
    <main>
      {/* 6. Renderizar el modal */}
      <ModalGuiaUsuario 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* El resto de tu página */}
      <section className="my-0">
        <CarruselInspirador />
      </section>

      {/* Sección de HelpButton añadida */}
      <HelpButton />

      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      <section id="servicios" className="my-5 w-full">
        <HomeFixer categorias={categorias as CategoriaBase[]} />
      </section>

      <section id="trabajos-recientes" className="my-5 w-full">
        <CarruselOfertas />
      </section>

      <section id="gia-usuarios-nuevos" className="my-5 w-full">
        <GiaUsuariosNuevos />
      </section>

      {/* Sección de Acciones Rápidas añadida */}
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

      <Footer />
    </main>
  );
}