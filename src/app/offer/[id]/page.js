// src/app/offer/[id]/page.js
'use client';
import React, { useState } from 'react';
import DeleteOfferConfirmation from '../../components/DeleteOfferConfirmation';

const OfferDetail = ({ offer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteOffer = () => {
    // Lógica para eliminar la oferta (simulada por ahora)
    console.log('Oferta eliminada');
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal sin eliminar
  };

  return (
    <div>
      <h1>{offer.title}</h1>
      <p>{offer.description}</p>
      <button onClick={handleOpenModal}>Eliminar Oferta</button>

      {/* Modal de confirmación */}
      <DeleteOfferConfirmation
        isOpen={isModalOpen}
        onConfirm={handleDeleteOffer}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

// Datos simulados para la oferta
const offer = {
  title: 'Oferta de Plomería',
  description: 'Se necesita plomero para reparar caño.',
};

export default function OfferPage() {
  return <OfferDetail offer={offer} />;
}
