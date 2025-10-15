'use client';
import Image from 'next/image';
import type { Offer } from '../services/offersService';

interface Props {
  offer: Offer;
  currentUserId?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function OfferDetailView({
  offer,
  currentUserId = null,
  onEdit,
  onDelete,
}: Props) {
  const isOwner = currentUserId && currentUserId === offer.ownerId;

  return (
    <div className="container-page">
      {/* Encabezado */}
      <h1 className="heading title text-2xl mb-6">Detalles de la Oferta</h1>

      {/* Imagen principal (16:9) */}
      <div className="mb-6 overflow-hidden rounded-xl">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={
              offer.images?.[0] ?? 'https://picsum.photos/seed/oferta1/1200/675'
            }
            alt={offer.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Título y descripción */}
      <h2 className="heading text-lg mb-2">{offer.title}</h2>
      <p className="mb-6 max-w-3xl p-text">{offer.description}</p>

      {/* Categoría */}
      <div className="mb-6">
        <div className="heading text-sm font-semibold">
          Categoría de servicio
        </div>
        <div className="mt-1 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
          {offer.category}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="mb-8">
        <div className="heading text-sm font-semibold">
          Información de Contacto
        </div>
        <div className="mt-1 text-sm">Fixer: {offer.contact?.name}</div>
        <div className="text-sm">Whatsapp: {offer.contact?.whatsapp}</div>
      </div>

      {/* Acciones (solo dueño) */}
      {isOwner && (
        <div className="mt-6 flex items-center justify-between">
          <button onClick={onDelete} className="btn btn-gray text-sm">
            Borrar Oferta
          </button>
          <button onClick={onEdit} className="btn btn-primary text-sm">
            Editar Oferta
          </button>
        </div>
      )}
    </div>
  );
}
