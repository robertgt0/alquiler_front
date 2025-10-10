'use client';

import React, { useState } from 'react';
import styles from './OfferModal.module.css';

interface Offer {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
  };
  images: string[];
  rating?: number;
  reviewCount?: number;
  provider: {
    _id: string;
    name: string;
    profileImage?: string;
    rating: number;
    completedServices: number;
  };
  tags?: string[];
  availability?: {
    startDate: string;
    endDate: string;
  };
}

interface OfferModalProps {
  isOpen: boolean;
  offer: Offer | null;
  onClose: () => void;
  onDelete?: (offerId: string) => void;
  loading?: boolean;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  offer,
  onClose,
  onDelete,
  loading = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !offer) return null;

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta oferta?')) {
      setIsDeleting(true);
      if (onDelete) {
        await onDelete(offer._id);
        onClose();
      }
      setIsDeleting(false);
    }
  };

  const handleNextImage = () => {
    if (offer.images) {
      setCurrentImageIndex((prev) => (prev + 1) % offer.images.length);
    }
  };

  const handlePrevImage = () => {
    if (offer.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? offer.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Modal */}
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{offer.title}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Carrusel de imágenes */}
          {offer.images && offer.images.length > 0 ? (
            <div className={styles.imageCarousel}>
              <img
                src={offer.images[currentImageIndex]}
                alt={`${offer.title} - imagen ${currentImageIndex + 1}`}
                className={styles.mainImage}
              />

              {/* Controles del carrusel */}
              {offer.images.length > 1 && (
                <>
                  <button
                    className={`${styles.carouselBtn} ${styles.prevBtn}`}
                    onClick={handlePrevImage}
                    aria-label="Imagen anterior"
                  >
                    ‹
                  </button>
                  <button
                    className={`${styles.carouselBtn} ${styles.nextBtn}`}
                    onClick={handleNextImage}
                    aria-label="Siguiente imagen"
                  >
                    ›
                  </button>
                  <div className={styles.imageIndicator}>
                    {currentImageIndex + 1} / {offer.images.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.noImage}>Sin imágenes</div>
          )}

          {/* Información de precio y categoría */}
          <div className={styles.priceSection}>
            <span className={styles.price}>
              ${offer.price} {offer.currency}
            </span>
            <span className={styles.category}>{offer.category}</span>
          </div>

          {/* Información del proveedor */}
          <div className={styles.providerSection}>
            <h3 className={styles.sectionTitle}>Proveedor</h3>
            <div className={styles.providerCard}>
              {offer.provider.profileImage && (
                <img
                  src={offer.provider.profileImage}
                  alt={offer.provider.name}
                  className={styles.providerImage}
                />
              )}
              <div className={styles.providerDetails}>
                <p className={styles.providerName}>{offer.provider.name}</p>
                <div className={styles.providerStats}>
                  <span className={styles.rating}>
                    ⭐ {offer.provider.rating.toFixed(1)}/5
                  </span>
                  <span className={styles.services}>
                    {offer.provider.completedServices} servicios completados
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Descripción</h3>
            <p className={styles.description}>{offer.description}</p>
          </div>

          {/* Ubicación */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📍 Ubicación</h3>
            <p className={styles.address}>{offer.location.address}</p>
            <p className={styles.city}>{offer.location.city}</p>
          </div>

          {/* Disponibilidad */}
          {offer.availability && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>📅 Disponibilidad</h3>
              <p>
                Desde:{' '}
                {new Date(offer.availability.startDate).toLocaleDateString(
                  'es-BO'
                )}
              </p>
              <p>
                Hasta:{' '}
                {new Date(offer.availability.endDate).toLocaleDateString(
                  'es-BO'
                )}
              </p>
            </div>
          )}

          {/* Tags */}
          {offer.tags && offer.tags.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Etiquetas</h3>
              <div className={styles.tags}>
                {offer.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          {typeof offer.rating !== 'undefined' && (
            <div className={styles.section}>
              <p className={styles.offerRating}>
                Calificación de la oferta: ⭐ {offer.rating.toFixed(1)}/5 (
                {offer.reviewCount} comentarios)
              </p>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className={styles.footer}>
          <button className={styles.contactBtn} disabled={loading}>
            💬 Contactar Proveedor
          </button>
          {onDelete && (
            <button
              className={`${styles.deleteBtn} ${isDeleting ? styles.deleting : ''}`}
              onClick={handleDelete}
              disabled={isDeleting || loading}
            >
              {isDeleting ? '⏳ Eliminando...' : '🗑️ Eliminar Oferta'}
            </button>
          )}
          <button className={styles.closeFooterBtn} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
};