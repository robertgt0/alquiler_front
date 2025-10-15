'use client';
import ImageCarousel from './ImageCarousel';
import type { Offer } from '../services/offersService';

interface Props {
  offer: Offer | null;
  onClose: () => void;
  currentUserId?: string | null;
}

export default function OfferDetailModal({
  offer,
  onClose,
  currentUserId = null,
}: Props) {
  if (!offer) return null;
  const isOwner = currentUserId && currentUserId === offer.ownerId;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          maxWidth: 900,
          width: '100%',
          padding: 16,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Detalles de la Oferta</h2>
          <button aria-label="Cerrar" onClick={onClose}>
            ✕
          </button>
        </div>

        {offer.isExpired && (
          <span
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '2px 8px',
              borderRadius: 8,
            }}
          >
            Caducada
          </span>
        )}

        {/* Carrusel */}
        <ImageCarousel images={offer.images} />

        {/* Contenido */}
        <h3 style={{ marginTop: 16 }}>{offer.title}</h3>
        <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {offer.description}
        </p>

        <div style={{ marginTop: 12 }}>
          <strong>Categoría:</strong> {offer.category}
        </div>
        <div>
          <strong>Publicada:</strong>{' '}
          {new Date(offer.publishedAt).toLocaleDateString()}
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Información de contacto</strong>
          <div>Fixer: {offer.contact?.name}</div>
          <div>WhatsApp: {offer.contact?.whatsapp}</div>
        </div>

        {/* Acciones condicionales */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {isOwner && <button>Editar oferta</button>}
          {isOwner && (
            <button style={{ background: '#fee2e2' }}>Eliminar oferta</button>
          )}
        </div>
      </div>
    </div>
  );
}
