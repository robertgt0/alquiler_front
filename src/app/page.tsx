// src/app/page.tsx

import Mapa from "./componentes/mapa/MapaWrapper";
import Footer from "./componentes/Footer/Footer";
import CarruselInspirador from "./componentes/CarruselInspirador/CarruselInspirador";

export default function Home() {
  return (
    <main>
      {/* Puedes colocar aquí el contenido de tu página principal */}
      <h1 className="text-4xl font-bold text-center">¡Bienvenido a Servineo!</h1>
      <p className="mt-4 text-lg text-center">Tu plataforma de servicios.</p>
      <section className="my-5">
        <CarruselInspirador />
      </section>
        <section className="my-10">
        <Mapa />
      </section>
      
      <Footer />
    </main>
    

  );
}