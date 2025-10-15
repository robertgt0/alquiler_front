// 1) Tipos para tener autocompletado y validar estructura de datos
export type Offer = {
  id: string;
  description: string;
  category: string;
  contact: { whatsapp: string; email: string };
  status: "active" | "inactive" | "deleted";
  createdAt: string; // ISO date string
};

// 2) Importamos el JSON local (Next permite importar JSON estático)
import data from "../mocks/offers.mock.json";

// 3) Normalizamos y pre-procesamos:
//    - Convertimos a Offer[]
//    - Filtramos eliminadas (no deben listarse)
//    - Ordenamos por fecha DESC (más recientes primero)
const ALL_OFFERS: Offer[] = (data as Offer[])
  .filter((o) => o.status !== "deleted")
  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

// 4) Pequeña utilidad para simular latencia de red (mejora percepción UX)
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 5) Parámetros que acepta nuestro listado (paginación + búsqueda + modo offline)
export type ListParams = {
  page: number;   // página actual (1-based)
  limit: number;  // ítems por página
  q?: string;     // texto de búsqueda (opcional)
  offline?: boolean; // si true, simulamos “sin conexión”
};

// 6) Función principal para Listado (HU9):
//    - Simula error si offline
//    - Aplica búsqueda simple por description/category/contact
//    - Aplica paginación
export async function fetchOffers(params: ListParams) {
  // 6.1) Simular “sin conexión” (para testear estados de error)
  if (params.offline) {
    await delay(300);
    throw new Error("offline");
  }

  // 6.2) Simular latencia normal
  await delay(250);

  // 6.3) Búsqueda simple (si viene q)
  let filtered = ALL_OFFERS;
  if (params.q && params.q.trim()) {
    const q = params.q.toLowerCase();
    filtered = ALL_OFFERS.filter((o) =>
      o.description.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.contact.whatsapp.includes(q) ||
      o.contact.email.toLowerCase().includes(q)
    );
  }

  // 6.4) Paginación (1-based)
  const total = filtered.length;
  const start = (params.page - 1) * params.limit;
  const end = start + params.limit;
  const pageItems = filtered.slice(start, end);

  // 6.5) Estructura de retorno (contrato estable para la UI)
  return {
    data: pageItems,
    page: params.page,
    pageSize: params.limit,
    total
  };
}
