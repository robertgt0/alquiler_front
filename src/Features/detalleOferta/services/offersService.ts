export interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  isExpired: boolean;
  publishedAt: string; // ISO date
  ownerId: string;
  contact: { name: string; whatsapp: string };
  images: string[];
}

export async function getOfferById(id: string): Promise<Offer> {
  // Simula llamada a backend (mock)
  await new Promise((r) => setTimeout(r, 300));
  return {
    id,
    title: 'Reparar grifo con gotera',
    description:
      'Si su grifo de la cocina sufre de goteras no dude en contactarme, soy experto en arreglarla.',
    category: 'Plomería',
    isExpired: false,
    publishedAt: '2025-10-10T14:20:00Z',
    ownerId: 'fixer-123',
    contact: { name: 'Manuel Quispe', whatsapp: '+591 625-4517' },
    images: [
      '/images/ofertas/grifo-1.jpg',
      '/images/ofertas/grifo-2.jpg',
      '/images/ofertas/grifo-3.jpg',
    ],
  };
}
