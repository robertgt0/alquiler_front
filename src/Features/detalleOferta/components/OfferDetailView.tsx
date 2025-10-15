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
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      {/* Título de página */}
      <h1 className="heading text-[28px] font-semibold text-gray-900 mb-6">
        Detalles de la Oferta
      </h1>

      {/* Imagen principal 16:9 con esquinas redondeadas */}
      <div className="mb-8 overflow-hidden rounded-xl">
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

      {/* Título de la oferta y descripción */}
      <h2 className="heading text-[18px] font-semibold text-gray-900 mb-2">
        {offer.title}
      </h2>
      {/* En el mock el párrafo es gris, no azul */}
      <p className="mb-6 max-w-3xl text-[14px] leading-relaxed text-gray-600">
        {offer.description}
      </p>

      {/* Categoría */}
      <div className="mb-6">
        <div className="heading text-[13px] font-semibold text-gray-900">
          Categoría de servicio
        </div>
        <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[12px] text-gray-700">
          {offer.category}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="mb-10">
        <div className="heading text-[13px] font-semibold text-gray-900 mb-1">
          Información de Contacto
        </div>
        <div className="text-[13px] text-gray-700">
          <div>
            <span className="font-medium">Fixer:</span> {offer.contact?.name}
          </div>
          <div>
            <span className="font-medium">Whatsapp:</span>{' '}
            {offer.contact?.whatsapp}
          </div>
        </div>
      </div>

      {/* Acciones: izquierda Borrar (gris chico), derecha Editar (azul) */}
      {isOwner && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onDelete}
            className="rounded-md bg-gray-100 px-3 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-200"
          >
            Borrar Oferta
          </button>
          <button
            onClick={onEdit}
            className="rounded-md bg-[#0c4fe9] px-4 py-2 text-[13px] font-medium text-white hover:brightness-110"
          >
            Editar Oferta
          </button>
        </div>
      )}
    </div>
  );
}
