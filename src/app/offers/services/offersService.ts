// src/app/offers/services/offersService.ts
// Servicio de listado/paginación/búsqueda de ofertas (con saneo del mock JSON)

import offersData from '../mocks/offers.mock.json';

export type OfferStatus = 'active' | 'inactive' | 'deleted';

export interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  contact: {
    whatsapp?: string;
    phone?: string;
    email?: string;
  };
  createdAt: string; // ISO date
  status: OfferStatus;
}

export interface ListOffersParams {
  query?: string;
  page?: number;      // 1-based
  pageSize?: number;  // default 10
  includeInactive?: boolean; // para “Mis ofertas activas”
}

export interface ListOffersResult {
  total: number;
  items: Offer[];
}

const normalize = (s: string) => s.toLowerCase().trim();

export async function listOffers(params: ListOffersParams = {}): Promise<ListOffersResult> {
  const {
    query = '',
    page = 1,
    pageSize = 10,
    includeInactive = true,
  } = params;

  // Simula pequeña latencia de red (opcional)
  await new Promise((r) => setTimeout(r, 200));

  // --- S A N E O  D E  D A T O S ---
  // Convertimos el JSON a Offer[], garantizando defaults seguros.
  let data: Offer[] = (offersData as any[]).map((o, i) => ({
    id: String(o?.id ?? `tmp-${i + 1}`),
    title: typeof o?.title === 'string' ? o.title : 'Oferta sin título',
    description: typeof o?.description === 'string' ? o.description : '', // evita undefined
    category: typeof o?.category === 'string' ? o.category : 'General',
    contact: {
      whatsapp: typeof o?.contact?.whatsapp === 'string' ? o.contact.whatsapp : undefined,
      phone: typeof o?.contact?.phone === 'string' ? o.contact.phone : undefined,
      email: typeof o?.contact?.email === 'string' ? o.contact.email : undefined,
    },
    createdAt: new Date(o?.createdAt ?? Date.now()).toISOString(),
    status: ((): OfferStatus => {
      if (o?.status === 'inactive' || o?.status === 'deleted') return o.status;
      return 'active';
    })(),
  }));

  // Excluir eliminadas (criterio 18)
  data = data.filter((o) => o.status !== 'deleted');

  // Búsqueda por título/descr/categoría
  const q = normalize(query);
  if (q) {
    data = data.filter(
      (o) =>
        normalize(o.title).includes(q) ||
        normalize(o.description).includes(q) ||
        normalize(o.category).includes(q)
    );
  }

  // Solo activas si se solicita (criterio 4)
  if (!includeInactive) {
    data = data.filter((o) => o.status === 'active');
  }

  // Ordenar por fecha más reciente (criterio 10)
  data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  // Paginación (criterio 8)
  const total = data.length;
  const start = (page - 1) * pageSize;
  const items = data.slice(start, start + pageSize);

  return { total, items };
}
