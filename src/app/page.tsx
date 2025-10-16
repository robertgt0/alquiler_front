// src/app/page.tsx
import Mapa from "./componentes/mapa/MapaWrapper";
import CarruselOfertas from "./componentes/CarruselOfertas/CarruselOfertas";
import HomeFixer from "./componentes/ListaCategorias/HomeFixer";
import type { Categoria } from "./componentes/ListaCategorias/tipos";
import Footer from "./componentes/Footer/Footer";
import CarruselInspirador from "./componentes/CarruselInspirador/CarruselInspirador";


// Usaremos un tipo sin el campo que ya no se usa
type CategoriaBase = Omit<Categoria, "totalServicios">;

// Solo datos (sin funciones aquí) — nota: ya NO incluimos totalServicios
const categoriasDemo: CategoriaBase[] = [
  { id: 1,  titulo: "Plomería",            descripcion: "Reparaciones e instalaciones",      icono: "🛠️" },
  { id: 2,  titulo: "Electricidad",        descripcion: "Instalaciones eléctricas",          icono: "⚡" },
  { id: 3,  titulo: "Carpintería",         descripcion: "Muebles y estructuras",             icono: "🪵" },
  { id: 4,  titulo: "Pintura",             descripcion: "Interior y exterior",               icono: "🎨" },
  { id: 5,  titulo: "Limpieza",            descripcion: "Doméstica y comercial",             icono: "✨" },
  { id: 6,  titulo: "Jardinería",          descripcion: "Mantenimiento de jardines",         icono: "🌿" },
  { id: 7,  titulo: "Construcción",        descripcion: "Obras y remodelación",              icono: "🏗️" },
  { id: 8,  titulo: "Climatización",       descripcion: "Aire acondicionado",                icono: "❄️" },
  { id: 9,  titulo: "Cerrajería",          descripcion: "Candados y llaves",                 icono: "🔒" },
  { id: 10, titulo: "Albañilería",         descripcion: "Construcción de muros",             icono: "🧱" },
  { id: 11, titulo: "Tapicería",           descripcion: "Reparación de muebles",             icono: "🪑" },
  { id: 12, titulo: "Soldadura",           descripcion: "Trabajo en metal",                  icono: "⚙️" },
  { id: 13, titulo: "Vidriería",           descripcion: "Instalación de vidrios",            icono: "🪟" },
  { id: 14, titulo: "Mecánica",            descripcion: "Reparación de vehículos",           icono: "🚗" },
  { id: 15, titulo: "Informática",         descripcion: "Soporte técnico",                   icono: "🖥️" },
  { id: 16, titulo: "Fotografía",          descripcion: "Eventos y retratos",                icono: "📷" },
  { id: 17, titulo: "Catering",            descripcion: "Servicio de comida",                icono: "🍽️" },
  { id: 18, titulo: "Mudanza",             descripcion: "Transporte y mudanzas",             icono: "🚚" },
  { id: 19, titulo: "Costura",             descripcion: "Confección y arreglos",             icono: "🧵" },
  { id: 20, titulo: "Peluquería",          descripcion: "Corte y peinado",                   icono: "💇" },
  { id: 21, titulo: "Domótica",            descripcion: "Automatización del hogar",          icono: "🏠" },
  { id: 22, titulo: "Pisos y Cerámica",    descripcion: "Colocación y reparación",           icono: "🧩" },
  { id: 23, titulo: "Toldos y Persianas",  descripcion: "Instalación y mantenimiento",       icono: "🪟" },
  { id: 24, titulo: "Calefacción",         descripcion: "Instalación y revisión",            icono: "🔥" },
  { id: 25, titulo: "Impermeabilización",  descripcion: "Sellado y protección",              icono: "💧" },
  { id: 26, titulo: "Metalistería",        descripcion: "Estructuras y acabados metálicos",  icono: "🛠️" },
  { id: 27, titulo: "Yesería",             descripcion: "Cielos falsos y enlucidos",         icono: "🧰" },
  { id: 28, titulo: "Interiores",          descripcion: "Diseño y ambientación",             icono: "🛋️" },
  { id: 29, titulo: "Paisajismo",          descripcion: "Diseño de áreas verdes",            icono: "🌳" },
  { id: 30, titulo: "Fumigación",          descripcion: "Control de plagas",                 icono: "🐜" },
  { id: 31, titulo: "Lavandería",          descripcion: "Lavado y planchado",                icono: "🧺" },
  { id: 32, titulo: "Cuidado de Mascotas", descripcion: "Paseo y atención",                  icono: "🐾" },
  { id: 33, titulo: "Niñera",              descripcion: "Cuidado infantil",                  icono: "🧒" },
  { id: 34, titulo: "Electrodomésticos",   descripcion: "Reparación a domicilio",            icono: "🔧" },
  { id: 35, titulo: "Telefonía y Redes",   descripcion: "Cableado y configuración",          icono: "📡" },
  { id: 36, titulo: "Impresión y Copiado", descripcion: "Servicios de impresión",            icono: "🖨️" },
];

export default function Home() {
  return (
    <main>
      {/* Puedes colocar aquí el contenido de tu página principal */}
      <h1 className="text-4xl font-bold text-center"></h1>
      <p className="mt-1 text-lg text-center"></p>
      <section className="my-5">
        <CarruselInspirador />
      </section>

      {/* Mapa: target for footer "#mapa" link */}
      <section id="mapa" className="my-10">
        <Mapa />
      </section>

      {/* Lista de servicios: target for footer "#servicios" link */}
      <section id="servicios" className="my-5 w-full">
        {/* HomeFixer solo necesita id, titulo, descripcion, icono */}
        <HomeFixer categorias={categoriasDemo} />
      </section>

      {/* Trabajos recientes / Ofertas: target for footer "#trabajos-recientes" link */}
      <section id="trabajos-recientes" className="my-5 w-full">
        <CarruselOfertas />
      </section>
      <Footer />
    </main>
    

  );
}
