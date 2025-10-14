import Header from "./componentes/Header/Header";
import Footer from "./componentes/Footer/Footer";
import CarruselInspirador from "./componentes/CarruselInspirador/CarruselInspirador";
import Mapa from "./componentes/mapa/MapaWrapper";
import CarruselOfertas from "./componentes/CarruselOfertas/CarruselOfertas";

import HomeFixer from "./componentes/ListaCategorias/HomeFixer";
import type { Categoria } from "./componentes/ListaCategorias/tipos"; // tipos

// Solo datos (sin funciones aquí)
const categoriasDemo: Categoria[] = [
  { id: 1, titulo: "Plomería", descripcion: "Reparaciones e instalaciones", totalServicios: 245, icono: "🛠️" },
  { id: 2, titulo: "Electricidad", descripcion: "Instalaciones eléctricas", totalServicios: 189, icono: "⚡" },
  { id: 3, titulo: "Carpintería", descripcion: "Muebles y estructuras", totalServicios: 156, icono: "🪵" },
  { id: 4, titulo: "Pintura", descripcion: "Interior y exterior", totalServicios: 203, icono: "🎨" },
  { id: 5, titulo: "Limpieza", descripcion: "Doméstica y comercial", totalServicios: 312, icono: "✨" },
  { id: 6, titulo: "Jardinería", descripcion: "Mantenimiento de jardines", totalServicios: 98, icono: "🌿" },
  { id: 7, titulo: "Construcción", descripcion: "Obras y remodelación", totalServicios: 167, icono: "🏗️" },
  { id: 8, titulo: "Climatización", descripcion: "Aire acondicionado", totalServicios: 87, icono: "❄️" },
  { id: 9, titulo: "Cerrajería", descripcion: "Candados y llaves", totalServicios: 87, icono: "🔒" },
  { id:10, titulo: "Albañilería", descripcion: "Construcción de muros", totalServicios: 142, icono: "🧱" },
  { id:11, titulo: "Tapicería", descripcion: "Reparación de muebles", totalServicios: 76, icono: "🪑" },
  { id:12, titulo: "Soldadura", descripcion: "Trabajo en metal", totalServicios: 64, icono: "⚙️" },
  { id:13, titulo: "Vidriería", descripcion: "Instalación de vidrios", totalServicios: 53, icono: "🪟" },
  { id:14, titulo: "Mecánica", descripcion: "Reparación de vehículos", totalServicios: 112, icono: "🚗" },
  { id:15, titulo: "Informática", descripcion: "Soporte técnico", totalServicios: 178, icono: "🖥️" },
  { id:16, titulo: "Fotografía", descripcion: "Eventos y retratos", totalServicios: 89, icono: "📷" },
  { id:17, titulo: "Catering", descripcion: "Servicio de comida", totalServicios: 95, icono: "🍽️" },
  { id:18, titulo: "Mudanza", descripcion: "Transporte y mudanzas", totalServicios: 124, icono: "🚚" },
  { id:19, titulo: "Costura", descripcion: "Confección y arreglos", totalServicios: 67, icono: "🧵" },
  { id:20, titulo: "Peluquería", descripcion: "Corte y peinado", totalServicios: 145, icono: "💇" },
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
