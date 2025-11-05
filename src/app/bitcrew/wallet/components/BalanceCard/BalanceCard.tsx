// src/app/bitcrew/wallet/components/BalanceCard.tsx
import React, { useState } from 'react';
import './BalanceCard.css';

// Importa los iconos que usaremos
import { FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi'; 

// Esta es tu 'prop' original. Asumimos que la página se la pasará.
interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  
  // Estado para visibilidad
  const [showBalance, setShowBalance] = useState(true); 

  // Formatear el número
  const formattedBalance = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  // Funciones para los botones
  const handleRefresh = () => {
    console.log('Refrescar saldo...');
    // Aquí iría la lógica de API
  };

  const handleToggleBalance = () => {
    setShowBalance(!showBalance); // Invierte el estado
  };

  return (
    // ¡Aquí están las clases CSS que faltaban!
    <div className="balance-card">
      <div className="card-header">
        <span>Balance Total</span>
        
        <div className="card-icons">
          <button onClick={handleRefresh} className="icon-button">
            <FiRefreshCw size={20} />
          </button>
          <button onClick={handleToggleBalance} className="icon-button">
            {showBalance ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>
      </div>
      
      <div className="balance-amount">
        <span className="currency">Bs. </span>
        <span className="amount">
          {showBalance ? formattedBalance : '*****.**'}
        </span>
      </div>

      <div className="card-footer">
        <span className="card-number">**** 4829</span>
        <span className="card-status">Verificado</span>
      </div>
    </div>
  );
};

export default BalanceCard;