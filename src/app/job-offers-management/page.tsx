'use client';

import { useState } from 'react';
import { OfferModal } from './components/OfferModal';

export default function JobOffersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const exampleOffer = {
    _id: '1',
    title: 'Limpieza de casa profesional',
    description: 'Servicio completo de limpieza incluye cocina, baños, salas y habitaciones. Disponible para limpiezas puntuales o periódicas. Se cuenta con todos los productos de limpieza necesarios.',
    category: 'limpieza',
    price: 150,
    currency: 'BOB',
    location: {
      address: 'Calle Principal 123, Cochabamba',
      city: 'Cochabamba',
    },
    images: [
      'https://via.placeholder.com/800x600?text=Limpieza+1',
      'https://via.placeholder.com/800x600?text=Limpieza+2',
      'https://via.placeholder.com/800x600?text=Limpieza+3',
    ],
    rating: 4.8,
    reviewCount: 25,
    provider: {
      _id: 'p1',
      name: 'María García',
      profileImage: 'https://via.placeholder.com/60x60?text=Maria',
      rating: 4.9,
      completedServices: 45,
    },
    tags: ['rápido', 'profesional', 'confiable'],
    availability: {
      startDate: '2025-10-15',
      endDate: '2025-12-31',
    },
  };

  const handleOpenModal = (offer: any) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  };

  const handleDeleteOffer = async (offerId: string) => {
    console.log('Eliminando oferta:', offerId);
    handleCloseModal();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Ofertas de Trabajo - HU13 Test</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Haz clic en "Ver Detalles" para probar el modal
      </p>

      <div
        style={{
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          cursor: 'pointer',
          maxWidth: '400px',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        onClick={() => handleOpenModal(exampleOffer)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>{exampleOffer.title}</h3>
        <p style={{ margin: '8px 0', color: '#666' }}>
          Precio: ${exampleOffer.price} {exampleOffer.currency}
        </p>
        <p style={{ margin: '8px 0', color: '#666' }}>
          Ubicación: {exampleOffer.location.city}
        </p>
        <p style={{ margin: '8px 0', color: '#666' }}>
          Proveedor: {exampleOffer.provider.name}
        </p>
        <button
          style={{
            padding: '10px 20px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            marginTop: '10px',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1976d2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2196f3';
          }}
        >
          Ver Detalles
        </button>
      </div>

      <OfferModal
        isOpen={isModalOpen}
        offer={selectedOffer}
        onClose={handleCloseModal}
        onDelete={handleDeleteOffer}
      />
    </div>
  );
}