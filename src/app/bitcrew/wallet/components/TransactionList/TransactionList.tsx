import React from 'react';
import TransactionRow from '../TransactionRow/TransactionRow';
import './TransactionList.css';

// Definimos el tipo de una transacción
export interface Transaction {
  id: string;
  type: string;
  date: string;
  amount: number;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h2>Transacciones Recientes</h2>
        <a href="#" className="view-all-link">Ver todas</a>
      </div>

      <div className="transactions-list">
        {/* Requerimiento: Manejo de lista vacía */}
        {transactions.length === 0 ? (
          <p className="empty-state">Sin transacciones registradas</p>
        ) : (
          transactions.map(tx => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;