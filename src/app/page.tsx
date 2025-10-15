// src/app/page.tsx

import Mapa from "./componentes/mapa/MapaWrapper";
import CarruselOfertas from "./componentes/CarruselOfertas/CarruselOfertas";
import HomeFixer from "./componentes/ListaCategorias/HomeFixer";
import type { Categoria } from "./componentes/ListaCategorias/tipos";
import Footer from "./componentes/Footer/Footer";

// Solo datos (sin funciones aquí)
const categoriasDemo: Categoria[] = [
  { id: 1,  titulo: "Plomería",              descripcion: "Reparaciones e instalaciones",      totalServicios: 245, icono: "🛠️" },
  { id: 2,  titulo: "Electricidad",          descripcion: "Instalaciones eléctricas",          totalServicios: 189, icono: "⚡" },
  { id: 3,  titulo: "Carpintería",           descripcion: "Muebles y estructuras",             totalServicios: 156, icono: "🪵" },
  { id: 4,  titulo: "Pintura",               descripcion: "Interior y exterior",               totalServicios: 203, icono: "🎨" },
  { id: 5,  titulo: "Limpieza",              descripcion: "Doméstica y comercial",             totalServicios: 312, icono: "✨" },
  { id: 6,  titulo: "Jardinería",            descripcion: "Mantenimiento de jardines",         totalServicios: 98,  icono: "🌿" },
  { id: 7,  titulo: "Construcción",          descripcion: "Obras y remodelación",              totalServicios: 167, icono: "🏗️" },
  { id: 8,  titulo: "Climatización",         descripcion: "Aire acondicionado",                totalServicios: 87,  icono: "❄️" },
  { id: 9,  titulo: "Cerrajería",            descripcion: "Candados y llaves",                 totalServicios: 87,  icono: "🔒" },
  { id: 10, titulo: "Albañilería",           descripcion: "Construcción de muros",             totalServicios: 142, icono: "🧱" },
  { id: 11, titulo: "Tapicería",             descripcion: "Reparación de muebles",             totalServicios: 76,  icono: "🪑" },
  { id: 12, titulo: "Soldadura",             descripcion: "Trabajo en metal",                  totalServicios: 64,  icono: "⚙️" },
  { id: 13, titulo: "Vidriería",             descripcion: "Instalación de vidrios",            totalServicios: 53,  icono: "🪟" },
  { id: 14, titulo: "Mecánica",              descripcion: "Reparación de vehículos",           totalServicios: 112, icono: "🚗" },
  { id: 15, titulo: "Informática",           descripcion: "Soporte técnico",                   totalServicios: 178, icono: "🖥️" },
  { id: 16, titulo: "Fotografía",            descripcion: "Eventos y retratos",                totalServicios: 89,  icono: "📷" },
  { id: 17, titulo: "Catering",              descripcion: "Servicio de comida",                totalServicios: 95,  icono: "🍽️" },
  { id: 18, titulo: "Mudanza",               descripcion: "Transporte y mudanzas",             totalServicios: 124, icono: "🚚" },
  { id: 19, titulo: "Costura",               descripcion: "Confección y arreglos",             totalServicios: 67,  icono: "🧵" },
  { id: 20, titulo: "Peluquería",            descripcion: "Corte y peinado",                   totalServicios: 145, icono: "💇" },
  { id: 21, titulo: "Domótica",              descripcion: "Automatización del hogar",          totalServicios: 72,  icono: "🏠" },
  { id: 22, titulo: "Pisos y Cerámica",      descripcion: "Colocación y reparación",           totalServicios: 83,  icono: "🧩" },
  { id: 23, titulo: "Toldos y Persianas",    descripcion: "Instalación y mantenimiento",       totalServicios: 44,  icono: "🪟" },
  { id: 24, titulo: "Calefacción",           descripcion: "Instalación y revisión",            totalServicios: 58,  icono: "🔥" },
  { id: 25, titulo: "Impermeabilización",    descripcion: "Sellado y protección",              totalServicios: 61,  icono: "💧" },
  { id: 26, titulo: "Metalistería",          descripcion: "Estructuras y acabados metálicos",  totalServicios: 38,  icono: "🛠️" },
  { id: 27, titulo: "Yesería",               descripcion: "Cielos falsos y enlucidos",         totalServicios: 49,  icono: "🧰" },
  { id: 28, titulo: "Interiores",            descripcion: "Diseño y ambientación",             totalServicios: 57,  icono: "🛋️" },
  { id: 29, titulo: "Paisajismo",            descripcion: "Diseño de áreas verdes",            totalServicios: 41,  icono: "🌳" },
  { id: 30, titulo: "Fumigación",            descripcion: "Control de plagas",                 totalServicios: 63,  icono: "🐜" },
  { id: 31, titulo: "Lavandería",            descripcion: "Lavado y planchado",                totalServicios: 70,  icono: "🧺" },
  { id: 32, titulo: "Cuidado de Mascotas",   descripcion: "Paseo y atención",                  totalServicios: 52,  icono: "🐾" },
  { id: 33, titulo: "Niñera",                descripcion: "Cuidado infantil",                  totalServicios: 46,  icono: "🧒" },
  { id: 34, titulo: "Electrodomésticos",     descripcion: "Reparación a domicilio",            totalServicios: 88,  icono: "🔧" },
  { id: 35, titulo: "Telefonía y Redes",     descripcion: "Cableado y configuración",          totalServicios: 74,  icono: "📡" },
  { id: 36, titulo: "Impresión y Copiado",   descripcion: "Servicios de impresión",            totalServicios: 39,  icono: "🖨️" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">¡Bienvenido a Servineo!</h1>
      <p className="mt-4 text-lg text-center">Tu plataforma de servicios.</p>

      <section className="my-5 w-full">
        <Mapa />
      </section>

      <section className="my-5 w-full">
        <HomeFixer categorias={categoriasDemo} />
      </section>

      <section className="my-5 w-full">
        <CarruselOfertas />
      </section>

      <Footer />
    </main>
  );
}
