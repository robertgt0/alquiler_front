import Header from "./componentes/Header/Header";
import Footer from "./componentes/Footer/Footer";
import CarruselInspirador from "./componentes/CarruselInspirador/CarruselInspirador";
import Mapa from "./componentes/mapa/MapaWrapper";
import CarruselOfertas from "./componentes/CarruselOfertas/CarruselOfertas";

import HomeFixer from "./componentes/ListaCategorias/HomeFixer";
import type { Categoria } from "./componentes/ListaCategorias/tipos"; // tipos

// Solo datos (sin funciones aquí)
const categoriasDemo: Categoria[] = [
  { id: 1, nombre: "Plomería", descripcion: "Reparaciones e instalaciones", trabajos: 245, icono: "🛠️" },
  { id: 2, nombre: "Electricidad", descripcion: "Instalaciones eléctricas", trabajos: 189, icono: "⚡" },
  { id: 3, nombre: "Carpintería", descripcion: "Muebles y estructuras", trabajos: 156, icono: "🪵" },
  { id: 4, nombre: "Pintura", descripcion: "Interior y exterior", trabajos: 203, icono: "🎨" },
  { id: 5, nombre: "Limpieza", descripcion: "Doméstica y comercial", trabajos: 312, icono: "✨" },
  { id: 6, nombre: "Jardinería", descripcion: "Mantenimiento de jardines", trabajos: 98, icono: "🌿" },
  { id: 7, nombre: "Construcción", descripcion: "Obras y remodelación", trabajos: 167, icono: "🏗️" },
  { id: 8, nombre: "Climatización", descripcion: "Aire acondicionado", trabajos: 87, icono: "❄️" },
  { id: 9, nombre: "Cerrajería", descripcion: "Candados y llaves", trabajos: 87, icono: "🔒" },
  { id:10, nombre: "Albañilería", descripcion: "Construcción de muros", trabajos: 142, icono: "🧱" },
  { id:11, nombre: "Tapicería", descripcion: "Reparación de muebles", trabajos: 76, icono: "🪑" },
  { id:12, nombre: "Soldadura", descripcion: "Trabajo en metal", trabajos: 64, icono: "⚙️" },
  { id:13, nombre: "Vidriería", descripcion: "Instalación de vidrios", trabajos: 53, icono: "🪟" },
  { id:14, nombre: "Mecánica", descripcion: "Reparación de vehículos", trabajos: 112, icono: "🚗" },
  { id:15, nombre: "Informática", descripcion: "Soporte técnico", trabajos: 178, icono: "🖥️" },
  { id:16, nombre: "Fotografía", descripcion: "Eventos y retratos", trabajos: 89, icono: "📷" },
  { id:17, nombre: "Catering", descripcion: "Servicio de comida", trabajos: 95, icono: "🍽️" },
  { id:18, nombre: "Mudanza", descripcion: "Transporte y mudanzas", trabajos: 124, icono: "🚚" },
  { id:19, nombre: "Costura", descripcion: "Confección y arreglos", trabajos: 67, icono: "🧵" },
  { id:20, nombre: "Peluquería", descripcion: "Corte y peinado", trabajos: 145, icono: "💇" },
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

      {/* 👇 Aquí usamos el Fixer: recibe datos, no funciones */}
      <section className="my-5">
        <HomeFixer categorias={categoriasDemo} />
      </section>

      <section className="my-5">
        <CarruselOfertas />
      </section>

      <Footer />
    </main>
  );
}
