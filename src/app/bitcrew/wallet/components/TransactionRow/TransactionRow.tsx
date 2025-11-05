import React from 'react';
import './TransactionRow.css';
// import { BsWallet } from 'react-icons/bs'; // Icono de ejemplo

interface TransactionRowProps {
  transaction: {
    type: string;
    date: string;
    amount: number;
  };
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  
  const formattedAmount = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(transaction.amount);

  return (
    <div className="transaction-row">
      {/* Requerimiento: [Icono] */}
      <div className="transaction-icon">
        {/* <BsWallet size={20} /> */}
        {/* Placeholder para tu icono "S" */}
        <div className="icon-placeholder">S</div>
      </div>
      
      {/* Requerimiento: [Descripción/Fecha] */}
      <div className="transaction-details">
        <span className="type">{transaction.type}</span>
        <span className="date">{transaction.date}</span>
      </div>
      
      {/* Requerimiento: [Monto] */}
      <div className="transaction-amount">
        <span className="currency">Bs. </span>
        <span className="amount">{formattedAmount}</span>
      </div>
    </div>
  );
};

export default TransactionRow;