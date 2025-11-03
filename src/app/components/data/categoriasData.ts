// src/app/components/data/categorias.ts
import type { Categoria } from "../ListaCategorias/tipos";

// Igual que en page.tsx: no usamos totalServicios aquí
export type CategoriaBase = Omit<Categoria, "totalServicios">;

export const categorias: CategoriaBase[] = [
  { id: 1,  titulo: "Plomería",            descripcion: "Reparaciones e instalaciones",      icono: "🪠", slug: "plomeria" },
  { id: 2,  titulo: "Electricidad",        descripcion: "Instalaciones eléctricas",          icono: "⚡", slug: "electricidad" },
  { id: 3,  titulo: "Carpintería",         descripcion: "Muebles y estructuras",             icono: "🪵", slug: "carpinteria" },
  { id: 4,  titulo: "Pintura",             descripcion: "Interior y exterior",               icono: "🎨", slug: "pintura" },
  { id: 5,  titulo: "Limpieza",            descripcion: "Doméstica y comercial",             icono: "🧹", slug: "limpieza" },
  { id: 6,  titulo: "Jardinería",          descripcion: "Mantenimiento de jardines",         icono: "🌿", slug: "jardineria" },
  { id: 7,  titulo: "Construcción",        descripcion: "Obras y remodelación",              icono: "🏗️", slug: "construccion" },
  { id: 8,  titulo: "Aire acondicionado",  descripcion: "Instalación y mantenimiento",       icono: "❄️", slug: "aire-acondicionado" },
  { id: 9,  titulo: "Cerrajería",          descripcion: "Candados y llaves",                 icono: "🔒", slug: "cerrajeria" },
  { id: 10, titulo: "Albañilería",         descripcion: "Construcción de muros",             icono: "🧱", slug: "albanileria" },
  { id: 11, titulo: "Tapicería",           descripcion: "Reparación de muebles",             icono: "🪑", slug: "tapiceria" },
  { id: 12, titulo: "Soldadura",           descripcion: "Trabajo en metal",                  icono: "⚙️", slug: "soldadura" },
  { id: 13, titulo: "Vidriería",           descripcion: "Instalación de vidrios",            icono: "🪟", slug: "vidrieria" },
  { id: 14, titulo: "Mecánica",            descripcion: "Reparación de vehículos",           icono: "🚗", slug: "mecanica" },
  { id: 15, titulo: "Informática",         descripcion: "Soporte técnico",                   icono: "🖥️", slug: "informatica" },
  { id: 16, titulo: "Fotografía",          descripcion: "Eventos y retratos",                icono: "📷", slug: "fotografia" },
  { id: 17, titulo: "Banquetes",           descripcion: "Comidas y bebidas",                 icono: "🍽️", slug: "banquetes" },
  { id: 18, titulo: "Mudanza",             descripcion: "Transporte y mudanzas",             icono: "🚚", slug: "mudanza" },
  { id: 19, titulo: "Costura",             descripcion: "Confección y arreglos",             icono: "🧵", slug: "costura" },
  { id: 20, titulo: "Peluquería",          descripcion: "Corte y peinado",                   icono: "💇", slug: "peluqueria" },
  { id: 21, titulo: "Domótica",            descripcion: "Automatización del hogar",          icono: "🏠", slug: "domotica" },
  { id: 22, titulo: "Pisos y Cerámica",    descripcion: "Colocación y reparación",           icono: "🧩", slug: "pisos-y-ceramica" },
  { id: 23, titulo: "Toldos y Persianas",  descripcion: "Instalación y mantenimiento",       icono: "🎪", slug: "toldos-y-persianas" }, // “cortinas”
  { id: 24, titulo: "Calefacción",         descripcion: "Instalación y revisión",            icono: "🔥", slug: "calefaccion" },
  { id: 25, titulo: "Impermeabilización",  descripcion: "Sellado y protección",              icono: "💧", slug: "impermeabilizacion" },
  { id: 26, titulo: "Metalistería",        descripcion: "Estructuras y acabados metálicos",  icono: "🛠️", slug: "metalisteria" },
  { id: 27, titulo: "Yesería",             descripcion: "Cielos falsos y enlucidos",         icono: "🧰", slug: "yeseria" },
  { id: 28, titulo: "Interiores",          descripcion: "Diseño y ambientación",             icono: "🛋️", slug: "interiores" },
  { id: 29, titulo: "Paisajismo",          descripcion: "Diseño de áreas verdes",            icono: "🌳", slug: "paisajismo" },
  { id: 30, titulo: "Fumigación",          descripcion: "Control de plagas",                 icono: "🐜", slug: "fumigacion" },
  { id: 31, titulo: "Lavandería",          descripcion: "Lavado y planchado",                icono: "🧺", slug: "lavanderia" },
  { id: 32, titulo: "Cuidado de Mascotas", descripcion: "Paseo y atención",                  icono: "🐾", slug: "cuidado-de-mascotas" },
  { id: 33, titulo: "Niñera",              descripcion: "Cuidado infantil",                  icono: "🧒", slug: "ninera" },
  { id: 34, titulo: "Electrodomésticos",   descripcion: "Reparación a domicilio",            icono: "🔧", slug: "electrodomesticos" },
  { id: 35, titulo: "Telefonía y Redes",   descripcion: "Cableado y configuración",          icono: "📡", slug: "telefonia-y-redes" },
  { id: 36, titulo: "Impresión y Copiado", descripcion: "Servicios de impresión",            icono: "🖨️", slug: "impresion-y-copiado" },
];

// export nombrado y default para que puedas importar como prefieras
export default categorias;
