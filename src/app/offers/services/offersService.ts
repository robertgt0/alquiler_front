// Servicio unificado HU9 + HU10
// - listOffers (HU9)
// - getOfferById (HU10)
// - canEditOffer (HU10)

import offersData from '../mocks/offers.mock.json';

// ---- Tipos ----
export type OfferStatus = 'active' | 'inactive' | 'deleted';

export interface Offer {
  id: string;
  ownerId?: string;
  title: string;
  description: string;
  category: string;
  contact: { whatsapp?: string; phone?: string; email?: string };
  createdAt: string;   // ISO
  status: OfferStatus;
  images?: string[];
}

export interface ListOffersParams {
  query?: string;
  page?: number;      // 1-based
  pageSize?: number;  // default 10
  includeInactive?: boolean;
}
export interface ListOffersResult { total: number; items: Offer[]; }

// ---- Utilidades ----
const normalize = (s: string) => s.toLowerCase().trim();

function sanitizeAll(): Offer[] {
  return (offersData as any[]).map((o, i) => ({
    id: String(o?.id ?? `tmp-${i + 1}`),
    ownerId: typeof o?.ownerId === 'string' ? o.ownerId : undefined,
    title: typeof o?.title === 'string' ? o.title : 'Oferta sin título',
    description: typeof o?.description === 'string' ? o.description : '',
    category: typeof o?.category === 'string' ? o.category : 'General',
    contact: {
      whatsapp: typeof o?.contact?.whatsapp === 'string' ? o.contact.whatsapp : undefined,
      phone: typeof o?.contact?.phone === 'string' ? o.contact.phone : undefined,
      email: typeof o?.contact?.email === 'string' ? o.contact.email : undefined,
    },
    createdAt: new Date(o?.createdAt ?? Date.now()).toISOString(),
    status: (o?.status === 'inactive' || o?.status === 'deleted') ? o.status : 'active',
    images: Array.isArray(o?.images) ? o.images.filter((x: any) => typeof x === 'string') : [],
  }));
}

// ---- HU9: Listado ----
export async function listOffers(params: ListOffersParams = {}): Promise<ListOffersResult> {
  const { query = '', page = 1, pageSize = 10, includeInactive = true } = params;
  await new Promise((r) => setTimeout(r, 80)); // latencia simulada

  let data = sanitizeAll().filter((o) => o.status !== 'deleted');

  const q = normalize(query);
  if (q) {
    data = data.filter(
      (o) =>
        normalize(o.title).includes(q) ||
        normalize(o.description).includes(q) ||
        normalize(o.category).includes(q)
    );
  }
  if (!includeInactive) data = data.filter((o) => o.status === 'active');

  data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const total = data.length;
  const start = (page - 1) * pageSize;
  const items = data.slice(start, start + pageSize);
  return { total, items };
}

// ---- HU10: Detalle ----
export async function getOfferById(id: string): Promise<Offer | null> {
  await new Promise((r) => setTimeout(r, 80));
  const item = sanitizeAll().find((o) => o.id === id && o.status !== 'deleted');
  return item ?? null;
}

// ---- HU10: Permisos (simulado) ----
export async function canEditOffer(offer: Offer, currentUserId: string): Promise<boolean> {
  return offer.ownerId === currentUserId;
}
