import Header from "./componentes/Header/Header";
import Footer from "./componentes/Footer/Footer";
import CarruselInspirador from "./componentes/CarruselInspirador/CarruselInspirador";
import Mapa from "./componentes/mapa/MapaWrapper";
import Lista from "./componentes/Lista/Lista";
import CarruselOfertas from "./componentes/CarruselOfertas/CarruselOfertas";
import HomeFixer from "./componentes/ListaCategorias/HomeFixer";
import { Categoria } from "./componentes/ListaCategorias/tipos";

const sampleCategorias: Categoria[] = [
  { id: 1, nombre: 'Plomería', trabajos: 120 },
  { id: 2, nombre: 'Electricidad', trabajos: 80 },
  { id: 3, nombre: 'Carpintería', trabajos: 95 },
  { id: 4, nombre: 'Jardinería', trabajos: 60 },
  { id: 5, nombre: 'Pintura', trabajos: 110 },
  { id: 6, nombre: 'Albañilería', trabajos: 75 },
  { id: 7, nombre: 'Cerrajería', trabajos: 50 },
  { id: 8, nombre: 'Fontanería', trabajos: 85 },
  { id: 9, nombre: 'Gasfitería', trabajos: 40 },
  { id: 10, nombre: 'Limpieza', trabajos: 200 },
  { id: 11, nombre: 'Mudanzas', trabajos: 30 },
  { id: 12, nombre: 'Reparación de Electrodomésticos', trabajos: 90 },
  { id: 13, nombre: 'Instalación de Aires Acondicionados', trabajos: 45 },
  { id: 14, nombre: 'Diseño de Interiores', trabajos: 25 },
  { id: 15, nombre: 'Arquitectura', trabajos: 15 },
  { id: 16, nombre: 'Consultoría Legal', trabajos: 10 },
  { id: 17, nombre: 'Contabilidad', trabajos: 55 },
  { id: 18, nombre: 'Desarrollo Web', trabajos: 70 },
  { id: 19, nombre: 'Diseño Gráfico', trabajos: 65 },
  { id: 20, nombre: 'Marketing Digital', trabajos: 130 },
  { id: 21, nombre: 'Clases Particulares', trabajos: 150 },
  { id: 22, nombre: 'Cuidado de Mascotas', trabajos: 180 },
  { id: 23, nombre: 'Organización de Eventos', trabajos: 20 },
  { id: 24, nombre: 'Fotografía', trabajos: 35 },
  { id: 25, nombre: 'Catering', trabajos: 40 },
  { id: 26, nombre: 'Traducción', trabajos: 50 },
  { id: 27, nombre: 'Edición de Video', trabajos: 60 },
  { id: 28, nombre: 'Animación', trabajos: 25 },
  { id: 29, nombre: 'Locución', trabajos: 15 },
  { id: 30, nombre: 'Redacción de Contenidos', trabajos: 80 },
  { id: 31, nombre: 'Asesoría de Imagen', trabajos: 30 },
  { id: 32, nombre: 'Entrenamiento Personal', trabajos: 90 },
  { id: 33, nombre: 'Nutrición', trabajos: 45 },
  { id: 34, nombre: 'Psicología', trabajos: 55 },
  { id: 35, nombre: 'Terapia Ocupacional', trabajos: 20 },
  { id: 36, nombre: 'Fisioterapia', trabajos: 70 },
  { id: 37, nombre: 'Cuidado de Niños', trabajos: 120 },
  { id: 38, nombre: 'Cuidado de Adultos Mayores', trabajos: 100 },
  { id: 39, nombre: 'Reparación de Computadoras', trabajos: 110 },
  { id: 40, nombre: 'Soporte Técnico', trabajos: 130 },
  { id: 41, nombre: 'Instalación de Software', trabajos: 85 },
  { id: 42, nombre: 'Seguridad Informática', trabajos: 65 },
  { id: 43, nombre: 'Reparación de Celulares', trabajos: 150 },
  { id: 44, nombre: 'Mantenimiento de Vehículos', trabajos: 95 },
  { id: 45, nombre: 'Lavado de Autos', trabajos: 200 },
];

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
        <HomeFixer categorias={sampleCategorias} />
      </section>
      <section className="my-5">
        <CarruselOfertas />
      </section>
      <Footer />
    </main>
  );
}

