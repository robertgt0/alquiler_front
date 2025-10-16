// src/app/components/DeleteOfferConfirmation.js

import React from 'react';

const DeleteOfferConfirmation = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div style={modalBackgroundStyle}>
      <div style={modalContentStyle}>
        <h2>¿Estás seguro de que deseas eliminar esta oferta?</h2>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

// Estilos básicos para el modal
const modalBackgroundStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
};

export default DeleteOfferConfirmation;
