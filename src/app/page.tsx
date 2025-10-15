// src/app/page.tsx

import Mapa from "./componentes/mapa/MapaWrapper";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Puedes colocar aquí el contenido de tu página principal */}
      <h1 className="text-4xl font-bold text-center">¡Bienvenido a Servineo!</h1>
      <p className="mt-4 text-lg text-center">Tu plataforma de servicios.</p>
       <section className="my-5">
        <Mapa />
      </section>

      {/* Aquí podrías añadir otros componentes como el CarruselInspirador o CarruselOfertas */}
      {/* <CarruselInspirador /> */}
      {/* <CarruselOfertas /> */}
    </main>
  );
}