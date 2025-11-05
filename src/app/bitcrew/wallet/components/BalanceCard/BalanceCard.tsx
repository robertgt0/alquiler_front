import React from 'react';
import './BalanceCard.css';

// Importa tus iconos (ej. react-icons)
// import { FiRefreshCw, FiEye } from 'react-icons/fi'; 

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  
  // Formatear el número a un estilo de moneda
  const formattedBalance = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <div className="balance-card">
      <div className="card-header">
        <span>Balance Total</span>
        <div className="card-icons">
          {/* Aquí irían tus iconos de refrescar y ocultar */}
          {/* <FiRefreshCw /> <FiEye /> */}
        </div>
      </div>
      
      <div className="balance-amount">
        {/* Requerimiento: "Bs." no editable y monto no seleccionable */}
        <span className="currency">Bs. </span>
        <span className="amount">{formattedBalance}</span>
      </div>

      <div className="card-footer">
        <span className="card-number">**** 4829</span>
        <span className="card-status">Verificado</span>
      </div>
    </div>
  );
};

export default BalanceCard;