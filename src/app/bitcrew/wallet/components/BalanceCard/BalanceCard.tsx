// src/app/bitcrew/wallet/components/BalanceCard.tsx
import React, { useState } from 'react';
import './BalanceCard.css';

// Importa los iconos de la librería react-icons
import { FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi'; 

// Define las 'props' que el componente espera recibir
interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  
  // Estado para controlar si el saldo es visible o no
  const [showBalance, setShowBalance] = useState(true); 

  // Formatea el número del balance al estilo de moneda de Bolivia
  const formattedBalance = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  // --- Manejadores de Eventos ---

  // Se ejecuta al hacer clic en el icono de recargar
  const handleRefresh = () => {
    console.log('Refrescar saldo...');
    // Aquí iría la lógica futura para llamar a la API
  };

  // Se ejecuta al hacer clic en el icono del ojo
  const handleToggleBalance = () => {
    setShowBalance(!showBalance); // Invierte el estado (de true a false, o viceversa)
  };

  return (
    <div className="balance-card">
      
      {/* --- Encabezado --- */}
      <div className="card-header">
        <span>Balance Total</span>
        
        <div className="card-icons">
          <button onClick={handleRefresh} className="icon-button">
            <FiRefreshCw size={20} />
          </button>
          <button onClick={handleToggleBalance} className="icon-button">
            {/* Renderizado condicional: muestra un icono u otro según el estado */}
            {showBalance ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>
      </div>
      
      {/* --- Monto del Balance --- */}
      <div className="balance-amount">
        <span className="currency">Bs. </span>
        <span className="amount">
          {/* Renderizado condicional: muestra el saldo o los asteriscos */}
          {showBalance ? formattedBalance : '*****.**'}
        </span>
      </div>

      {/* --- Pie de Tarjeta --- */}
      <div className="card-footer">
        <span className="card-number">**** 4829</span>
        <span className="card-status">Verificado</span>
      </div>
    </div>
  );
};

export default BalanceCard;