"use client";
import { useState, useEffect } from 'react';
import Mapa from "../components/mapa/MapaWrapper";
import CarruselOfertas from "../components/CarruselOfertas/CarruselOfertas";
import HomeFixer from "../components/ListaCategorias/HomeFixer";
import type { Categoria } from "../components/ListaCategorias/tipos";
import Footer from "../components/Footer/Footer";
import CarruselInspirador from "../components/CarruselInspirador/CarruselInspirador";
import WelcomeModal from '../components/WelcomeModal/WelcomeModal';
import categorias, { type CategoriaBase } from "../components/data/categoriasData";

export default function Homepage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const guideViewed = localStorage.getItem('guiaVista');
    if (guideViewed !== 'true') {
      setIsModalOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (dontShowAgain) {
      localStorage.setItem('guiaVista', 'true');
    }
    setIsModalOpen(false);
    // Lógica para desplazar suavemente a la sección de la guía
    document.getElementById('user-guide')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDecline = () => {
    if (dontShowAgain) {
      localStorage.setItem('guiaVista', 'true');
    }
    setIsModalOpen(false);
  };

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked);
  };

  return (
    <main>
      <WelcomeModal
        isOpen={isModalOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={handleDontShowAgainChange}
      />
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