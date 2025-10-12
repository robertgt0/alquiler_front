<<<<<<< HEAD
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/Ordenamiento');
}
=======
import Header from "./componentes/Header/Header";
import Footer from "./componentes/Footer/Footer";
import CarruselInspirador from "./componentes/CarruselInspirador/CarruselInspirador";
import Mapa from "./componentes/mapa/MapaWrapper";
import Lista from "./componentes/Lista/Lista";
import CarruselOfertas from "./componentes/CarruselOfertas/CarruselOfertas";

export default function HomePage() {
  return (
    <main className="container-fluid p-0">
      <Header />
      <section className="my-5">
        <CarruselInspirador />
      </section>
      <section className="my-5">
        <Mapa />
      </section>
      <section className="my-5">
        <Lista />
      </section>
      <section className="my-5">
        <CarruselOfertas />
      </section>
      <Footer />
    </main>
  );
}
>>>>>>> origin/F-Gustavo_soft-war/Map
