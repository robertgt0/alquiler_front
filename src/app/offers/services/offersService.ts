// src/app/offers/services/offersService.ts
// Cliente de la API para HU9 (listado) y HU10 (detalle)

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

// Base URL: toma env del front o usa localhost:4000
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') || 'http://localhost:4000';

// Pequeña ayuda para armar querystrings
function qs(params: Record<string, any>) {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    url.set(k, String(v));
  });
  return url.toString();
}

// ---- HU9: Listado ----
export async function listOffers(params: ListOffersParams = {}): Promise<ListOffersResult> {
  const {
    query = '',
    page = 1,
    pageSize = 10,
    includeInactive = true,
  } = params;

  const url = `${API_BASE}/api/offers?${qs({
    query,
    page,
    pageSize,
    includeInactive,
  })}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar ofertas');
  const data = (await res.json()) as ListOffersResult;

  // Saneo mínimo por si algún campo viene raro
  const items = (data.items || []).map((o) => ({
    ...o,
    id: String(o.id),
    title: o.title ?? 'Oferta sin título',
    description: o.description ?? '',
    category: o.category ?? 'General',
    contact: o.contact ?? {},
    createdAt: o.createdAt ?? new Date().toISOString(),
    status: (o.status === 'inactive' || o.status === 'deleted') ? o.status : 'active',
    images: Array.isArray(o.images) ? o.images.filter((x) => typeof x === 'string') : [],
  }));

  return { total: Number(data.total ?? items.length), items };
}

// ---- HU10: Detalle ----
export async function getOfferById(id: string): Promise<Offer | null> {
  const res = await fetch(`${API_BASE}/api/offers/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('No se pudo cargar la oferta');
  const o = (await res.json()) as Offer;
  return {
    ...o,
    id: String(o.id),
    title: o.title ?? 'Oferta sin título',
    description: o.description ?? '',
    category: o.category ?? 'General',
    contact: o.contact ?? {},
    createdAt: o.createdAt ?? new Date().toISOString(),
    status: (o.status === 'inactive' || o.status === 'deleted') ? o.status : 'active',
    images: Array.isArray(o.images) ? o.images.filter((x) => typeof x === 'string') : [],
  };
}

// ---- HU10: Permisos (simulado) ----
// Mantén esto igual que antes (el backend aún no valida dueño).
export async function canEditOffer(offer: Offer, currentUserId: string): Promise<boolean> {
  return offer.ownerId === currentUserId;
}
