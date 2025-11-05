import React from 'react';
// Importamos componentes y tipos desde la carpeta 'components'
import BalanceCard from './BalanceCard/BalanceCard'; 
import TransactionList from './TransactionList/TransactionList';
import type { Transaction } from './TransactionList/TransactionList';
import './Wallet.css';

// --- Datos Ficticios (Mock Data) ---
const mockTransactions: Transaction[] = [
  { id: '1', type: 'Transferencia recibida', date: 'Hoy, 10:15', amount: 698.23 },
  { id: '2', type: 'Transferencia recibida', date: '02, Dic', amount: 118.13 },
  { id: '3', type: 'Transferencia recibida', date: '15, Feb', amount: 800.13 },
];

const mockBalance = 12730.50;
// ---------------------------------

const Wallet: React.FC = () => {
  return (
    <div className="wallet-app-container">
      
      {/* --- Encabezado Principal --- */}
      <header className="wallet-header">
        <div className="header-title">
          <h1>Mi Billetera</h1>
          <p>Gestiona tus finanzas fácilmente</p>
        </div>
        
        {/* Contiene solo el botón de "Recargar Saldo" para Desktop */}
        <div className="header-actions">
          <button className="reload-button desktop-only">
            <span>Recargar Saldo</span>
          </button>
        </div>
      </header>

      {/* --- Contenido Principal (Tarjeta y Lista) --- */}
      <main className="wallet-main-content">
        
        {/* Tarjeta de Balance Degradada */}
        <BalanceCard balance={mockBalance} />
        
        {/* Botón de "Recargar Saldo" solo visible en Mobile */}
        <button className="reload-button mobile-only">
          <span>Recargar Saldo</span>
        </button>

        {/* Lista de Transacciones Recientes */}
        <TransactionList transactions={mockTransactions} />
      </main>
    </div>
  );
};

export default Wallet;