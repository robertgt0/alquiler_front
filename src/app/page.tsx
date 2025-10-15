// src/app/page.tsx
import Mapa from "./componentes/mapa/MapaWrapper";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Sección de bienvenida separada del mapa */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
          ¡Bienvenido a Servineo!
        </h1>
      </div>

      {/* Sección del mapa */}
      <section className="w-full">
        <Mapa />
      </section>

      {/* Aquí podrías añadir otros componentes */}
      {/* <CarruselInspirador /> */}
      {/* <CarruselOfertas /> */}
    </main>
  );
}