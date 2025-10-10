'use client';

import { useState } from 'react';
import { OfferModal } from './components/OfferModal';
import { OfferForm } from './components/OfferForm';

export default function JobOffersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const exampleOffer = {
    _id: '1',
    title: 'Limpieza de casa profesional',
    description:
      'Servicio completo de limpieza incluye cocina, baños, salas y habitaciones. Disponible para limpiezas puntuales o periódicas. Se cuenta con todos los productos de limpieza necesarios.',
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

  const handleFormSubmit = async (formData: any) => {
    setIsLoadingForm(true);
    try {
      console.log('Datos del formulario:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Oferta creada exitosamente');
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error al crear oferta:', error);
      throw error;
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HU13 - Modal Test */}
        <section style={{ marginBottom: '60px' }}>
          <h1 style={{ color: '#1a1a1a' }}>HU13 - Modal de Oferta (Test)</h1>
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
              background: '#fff',
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
            <h3
              style={{
                margin: '0 0 10px 0',
                color: '#1a1a1a', // título más oscuro
                fontWeight: 700,
                fontSize: '18px',
              }}
            >
              {exampleOffer.title}
            </h3>
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
        </section>

        {/* HU06 - Formulario */}
        <section>
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h1 style={{ color: '#1a1a1a' }}>HU06 - Formulario de Nueva Oferta</h1>
            {!isFormVisible && (
              <button
                onClick={() => setIsFormVisible(true)}
                style={{
                  padding: '12px 30px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '20px',
                }}
              >
                + Crear Nueva Oferta
              </button>
            )}
          </div>

          {isFormVisible && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px',
                overflowY: 'auto', // permite scroll si el contenido es más alto
              }}
            >
              <div
                style={{
                  background: '#fff',
                  padding: '30px',
                  borderRadius: '10px',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '90vh', // limita altura al 90% de la ventana
                  overflowY: 'auto', // scroll interno
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <button
                  onClick={() => setIsFormVisible(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#e0e0e0',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                  }}
                >
                  ← Volver
                </button>
                <OfferForm onSubmit={handleFormSubmit} isLoading={isLoadingForm} />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
